import { NextRequest, NextResponse } from "next/server";
import {
  CART_COOKIE_NAME,
  getClientIp,
  checkRateLimit,
} from "@/lib/cart/cart-security";
import { getOrCreateCart } from "@/lib/cart/cart-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`validate_cart:${ip}`, 30);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait." },
        { status: 429 }
      );
    }

    const sessionCookie = req.cookies.get(CART_COOKIE_NAME)?.value;
    const authHeader = req.headers.get("x-user-id");

    const { cart } = await getOrCreateCart(authHeader, sessionCookie);

    if (cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your shopping bag is empty." },
        { status: 400 }
      );
    }

    // Verify stock availability on all items
    const unavailableItems = cart.items.filter((it) => !it.product.inStock);
    if (unavailableItems.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Some items in your cart are no longer available: ${unavailableItems.map((u) => u.product.name).join(", ")}`,
          unavailableItemIds: unavailableItems.map((u) => u.id),
        },
        { status: 409 }
      );
    }

    // Return authoritative validated summary for checkout
    const checkoutPayload = {
      cartId: cart.id,
      itemCount: cart.totals.itemCount,
      subtotal: cart.totals.subtotal,
      shipping: cart.totals.shipping,
      discount: cart.totals.discount,
      total: cart.totals.total,
      currency: "GBP",
      items: cart.items.map((it) => ({
        productId: it.productId,
        productName: it.product.name,
        variant: it.variantId,
        unitPrice: it.product.price,
        quantity: it.quantity,
        lineTotal: it.lineTotal,
      })),
      timestamp: new Date().toISOString(),
    };

    const res = NextResponse.json({
      success: true,
      validated: true,
      checkout: checkoutPayload,
    });

    res.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
    return res;
  } catch (error: any) {
    console.error("Cart validate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate shopping bag for checkout." },
      { status: 500 }
    );
  }
}
