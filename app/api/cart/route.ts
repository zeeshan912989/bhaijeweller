import { NextRequest, NextResponse } from "next/server";
import {
  CART_COOKIE_NAME,
  getClientIp,
  checkRateLimit,
  generateGuestSessionToken,
  setGuestCartCookie,
} from "@/lib/cart/cart-security";
import { getOrCreateCart, clearCart } from "@/lib/cart/cart-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`get_cart:${ip}`, 120);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const sessionCookie = req.cookies.get(CART_COOKIE_NAME)?.value;
    const authHeader = req.headers.get("x-user-id"); // Authenticated user ID if passed by client/session

    let sessionId = sessionCookie;
    let isNewSession = false;

    if (!sessionId && !authHeader) {
      sessionId = generateGuestSessionToken();
      isNewSession = true;
    }

    const { cart } = await getOrCreateCart(authHeader, sessionId);

    const res = NextResponse.json({
      success: true,
      cart,
    });

    // Set private, no-store cache control headers
    res.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");

    if (isNewSession && sessionId) {
      setGuestCartCookie(res, sessionId);
    }

    return res;
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to retrieve cart." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`delete_cart:${ip}`, 20);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests." },
        { status: 429 }
      );
    }

    const sessionCookie = req.cookies.get(CART_COOKIE_NAME)?.value;
    const authHeader = req.headers.get("x-user-id");

    const { cart: currentCart } = await getOrCreateCart(authHeader, sessionCookie);
    const updatedCart = await clearCart(currentCart.id, authHeader, sessionCookie);

    const res = NextResponse.json({
      success: true,
      cart: updatedCart,
      message: "Cart cleared successfully.",
    });

    res.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");
    return res;
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to clear cart." },
      { status: 500 }
    );
  }
}
