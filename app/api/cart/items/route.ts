import { NextRequest, NextResponse } from "next/server";
import {
  CART_COOKIE_NAME,
  getClientIp,
  checkRateLimit,
  generateGuestSessionToken,
  setGuestCartCookie,
} from "@/lib/cart/cart-security";
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  RemoveCartItemSchema,
} from "@/lib/cart/types";
import {
  getOrCreateCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
} from "@/lib/cart/cart-service";

export const dynamic = "force-dynamic";

// POST: Add Item to Cart
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`add_to_cart:${ip}`, 30);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many requests. Please try again in ${rateCheck.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = AddToCartSchema.safeParse(body);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ success: false, error: issue }, { status: 400 });
    }

    const sessionCookie = req.cookies.get(CART_COOKIE_NAME)?.value;
    const authHeader = req.headers.get("x-user-id");

    let sessionId = sessionCookie;
    let isNewSession = false;

    if (!sessionId && !authHeader) {
      sessionId = generateGuestSessionToken();
      isNewSession = true;
    }

    const { cart: currentCart } = await getOrCreateCart(authHeader, sessionId);

    const updatedCart = await addItemToCart(
      currentCart.id,
      parseResult.data,
      authHeader,
      sessionId
    );

    const res = NextResponse.json({
      success: true,
      cart: updatedCart,
      message: "Piece added to your shopping bag.",
    });

    res.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");

    if (isNewSession && sessionId) {
      setGuestCartCookie(res, sessionId);
    }

    return res;
  } catch (error: any) {
    console.error("Add to cart API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Unable to add piece to shopping bag.",
      },
      { status: 400 }
    );
  }
}

// PATCH: Update Cart Item Quantity
export async function PATCH(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`update_cart:${ip}`, 45);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many updates. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = UpdateCartItemSchema.safeParse(body);

    if (!parseResult.success) {
      const issue = parseResult.error.issues[0]?.message || "Invalid quantity update";
      return NextResponse.json({ success: false, error: issue }, { status: 400 });
    }

    const sessionCookie = req.cookies.get(CART_COOKIE_NAME)?.value;
    const authHeader = req.headers.get("x-user-id");

    const { cart: currentCart } = await getOrCreateCart(authHeader, sessionCookie);

    const updatedCart = await updateItemQuantity(
      currentCart.id,
      parseResult.data,
      authHeader,
      sessionCookie
    );

    const res = NextResponse.json({
      success: true,
      cart: updatedCart,
      message: "Quantity updated.",
    });

    res.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
    return res;
  } catch (error: any) {
    console.error("Update cart API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unable to update quantity." },
      { status: 400 }
    );
  }
}

// DELETE: Remove Item from Cart
export async function DELETE(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`remove_cart_item:${ip}`, 45);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = RemoveCartItemSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid item reference." },
        { status: 400 }
      );
    }

    const sessionCookie = req.cookies.get(CART_COOKIE_NAME)?.value;
    const authHeader = req.headers.get("x-user-id");

    const { cart: currentCart } = await getOrCreateCart(authHeader, sessionCookie);

    const updatedCart = await removeItemFromCart(
      currentCart.id,
      parseResult.data.itemId,
      authHeader,
      sessionCookie
    );

    const res = NextResponse.json({
      success: true,
      cart: updatedCart,
      message: "Piece removed from shopping bag.",
    });

    res.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
    return res;
  } catch (error: any) {
    console.error("Remove cart item API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unable to remove piece." },
      { status: 400 }
    );
  }
}
