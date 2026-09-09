import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handleRecalculation(request);
}

export async function POST(request: NextRequest) {
  return handleRecalculation(request);
}

async function handleRecalculation(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Verify secret if configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow local development and manual invocation
      const isDev = process.env.NODE_ENV === "development";
      if (!isDev && !request.nextUrl.searchParams.get("admin_key")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    // Call Supabase Stored Procedure
    const { data, error } = await supabaseAdmin.rpc("recalculate_popularity_scores");

    if (error) {
      console.warn("RPC recalculate_popularity_scores error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Fetch quick stats on recalculated products
    const { data: topTrending } = await supabaseAdmin
      .from("product_analytics")
      .select("product_slug, trending_score, popularity_score, hidden_gem_score")
      .order("trending_score", { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      message: "Popularity scores successfully recalculated.",
      timestamp: new Date().toISOString(),
      topTrending: topTrending || [],
    });
  } catch (err: any) {
    console.error("Popularity Cron Calculation Exception:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
