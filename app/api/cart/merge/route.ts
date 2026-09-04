import { NextRequest, NextResponse } from "next/server";
import {
  CART_COOKIE_NAME,
  getClientIp,
  checkRateLimit,
} from "@/lib/cart/cart-security";
import { MergeCartSchema } from "@/lib/cart/types";
import { mergeGuestCart } from "@/lib/cart/cart-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(`merge_cart:${ip}`, 15);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many merge requests." },
        { status: 429 }
      );
    }

    const authHeader = req.headers.get("x-user-id");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Authentication required to merge cart." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parseResult = MergeCartSchema.safeParse(body);

    const guestSessionId =
      parseResult.success ? parseResult.data.guestSessionId : req.cookies.get(CART_COOKIE_NAME)?.value;

    if (!guestSessionId) {
      return NextResponse.json(
        { success: false, error: "No guest cart found to merge." },
        { status: 400 }
      );
    }

    const finalCart = await mergeGuestCart(guestSessionId, authHeader);

    const res = NextResponse.json({
      success: true,
      cart: finalCart,
      message: "Guest cart merged successfully.",
    });

    // Clear guest cookie after merge
    res.cookies.delete(CART_COOKIE_NAME);
    res.headers.set("Cache-Control", "private, no-store, max-age=0, must-revalidate");

    return res;
  } catch (error: any) {
    console.error("Merge cart error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to merge shopping bag." },
      { status: 500 }
    );
  }
}
