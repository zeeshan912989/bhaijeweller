import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const VALID_EVENT_TYPES = [
  "PRODUCT_VIEW",
  "IMAGE_ZOOM",
  "ADD_TO_WISHLIST",
  "REMOVE_WISHLIST",
  "ADD_TO_CART",
  "CHECKOUT_STARTED",
  "PURCHASE_COMPLETED",
  "PRODUCT_SHARED",
];

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    if (!rawBody) {
      return NextResponse.json({ success: false, error: "Empty body" }, { status: 400 });
    }

    const data = JSON.parse(rawBody);
    const { productId, productSlug, eventType, sessionId, userId } = data;

    if (!productSlug || !eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { success: false, error: "Invalid event parameters" },
        { status: 400 }
      );
    }

    const safeSessionId = sessionId || `anon_${Date.now()}`;

    // Optional 24-hour rate-limiting/deduplication for views to prevent spam
    if (eventType === "PRODUCT_VIEW") {
      const { data: recentView } = await supabaseAdmin
        .from("product_events")
        .select("id")
        .eq("session_id", safeSessionId)
        .eq("product_slug", productSlug)
        .eq("event_type", "PRODUCT_VIEW")
        .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (recentView && recentView.length > 0) {
        // Already recorded within 24h for this session
        return NextResponse.json({ success: true, deduplicated: true });
      }
    }

    let finalProductId = productId;

    // If productId wasn't provided or isn't a valid UUID, lookup by slug
    if (!finalProductId || typeof finalProductId !== "string" || finalProductId.length < 30) {
      const { data: prod } = await supabaseAdmin
        .from("products")
        .select("id")
        .eq("slug", productSlug)
        .maybeSingle();

      if (prod?.id) {
        finalProductId = prod.id;
      }
    }

    // Insert into product_events
    const { error: insertError } = await supabaseAdmin
      .from("product_events")
      .insert({
        product_id: finalProductId || null,
        product_slug: productSlug,
        user_id: userId || null,
        session_id: safeSessionId,
        event_type: eventType,
      });

    if (insertError) {
      console.warn("Analytics event insertion notice:", insertError.message);
      // Even if table doesn't exist yet or has foreign key warning, gracefully succeed
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Analytics Event Tracking Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
