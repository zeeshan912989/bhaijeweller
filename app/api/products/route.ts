import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search") || "";
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10), 1), 100);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" });

    // Category filter
    if (category && category !== "all") {
      query = query.eq("category", category.toLowerCase());
    }

    // Search query
    if (search.trim()) {
      query = query.or(`name.ilike.%${search.trim()}%,category.ilike.%${search.trim()}%,badge.ilike.%${search.trim()}%`);
    }

    // Price & Name Sorting on SQL level
    if (sort === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price-desc") {
      query = query.order("price", { ascending: false });
    } else if (sort === "name") {
      query = query.order("name", { ascending: true });
    } else {
      // Default: newest first
      query = query.order("created_at", { ascending: false });
    }

    // Pagination
    query = query.range(from, to);

    const { data: dbProducts, error, count } = await query;

    if (error) {
      console.warn("Supabase products query error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message, products: [], total: 0 },
        { status: 500 }
      );
    }

    // Normalize format
    let products = (dbProducts || []).map((p: any) => ({
      id: p.id,
      slug: p.slug || p.id,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      badge: p.badge || undefined,
      primaryImage: p.primary_image || "/ear.jpeg",
      hoverImage: p.hover_image || "/ear ring.jpeg",
      galleryImages: Array.isArray(p.gallery_images) ? p.gallery_images : [],
      metals: Array.isArray(p.metals) ? p.metals : [],
      inStock: p.in_stock !== false,
      createdAt: p.created_at,
    }));

    // If sorting by algorithm score (trending, popularity, hidden-gems), rank in memory with fallback
    if ((sort === "trending" || sort === "popularity" || sort === "hidden-gems") && products.length > 1) {
      try {
        const scoreColumn =
          sort === "trending"
            ? "trending_score"
            : sort === "popularity"
            ? "popularity_score"
            : "hidden_gem_score";

        const { data: analyticsList } = await supabase
          .from("product_analytics")
          .select("product_id, product_slug, " + scoreColumn);

        if (analyticsList && analyticsList.length > 0) {
          const scoreMap = new Map<string, number>();
          analyticsList.forEach((a: any) => {
            if (a.product_id) scoreMap.set(a.product_id, Number(a[scoreColumn] || 0));
            if (a.product_slug) scoreMap.set(a.product_slug, Number(a[scoreColumn] || 0));
          });

          products.sort((a, b) => {
            const scoreA = scoreMap.get(a.id) ?? scoreMap.get(a.slug) ?? 0;
            const scoreB = scoreMap.get(b.id) ?? scoreMap.get(b.slug) ?? 0;
            if (scoreB !== scoreA) {
              return scoreB - scoreA;
            }
            // Tie breaker: newest first
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          });
        }
      } catch (analyticsErr) {
        console.warn("Analytics sort fallback:", analyticsErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total: count || products.length,
          totalPages: Math.ceil((count || products.length) / limit),
        },
      },
      {
        status: 200,
        headers: {
          // CDN Cache: 60 seconds freshness, 300 seconds stale-while-revalidate
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "Vercel-CDN-Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: any) {
    console.error("Products API exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error", products: [] },
      { status: 500 }
    );
  }
}
