import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

interface BulkProductRow {
  name: string;
  category: string;
  price: number | string;
  originalPrice?: number | string;
  slug?: string;
  badge?: string;
  primaryImage?: string;
  hoverImage?: string;
  inStock?: boolean;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { products } = body as { products: BulkProductRow[] };

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please provide an array of products to import." },
        { status: 400 }
      );
    }

    if (products.length > 500) {
      return NextResponse.json(
        { success: false, error: "Maximum batch limit is 500 items per request for serverless safety." },
        { status: 400 }
      );
    }

    // 1. Sanitize & Prepare Rows
    const validRows: any[] = [];
    const validationErrors: Array<{ index: number; name?: string; reason: string }> = [];

    products.forEach((p, idx) => {
      if (!p.name || typeof p.name !== "string" || !p.name.trim()) {
        validationErrors.push({ index: idx, reason: "Missing product name" });
        return;
      }

      const numPrice = Number(p.price);
      if (isNaN(numPrice) || numPrice <= 0) {
        validationErrors.push({ index: idx, name: p.name, reason: "Invalid price value" });
        return;
      }

      const category = (p.category || "earrings").toLowerCase().trim();
      const baseSlug = p.slug ? slugify(p.slug) : slugify(p.name);
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

      validRows.push({
        name: p.name.trim(),
        slug: uniqueSlug,
        category: ["earrings", "necklaces", "bracelets", "rings"].includes(category) ? category : "earrings",
        price: numPrice,
        original_price: p.originalPrice ? Number(p.originalPrice) : null,
        badge: p.badge || null,
        primary_image: p.primaryImage || "/ear.jpeg",
        hover_image: p.hoverImage || "/ear ring.jpeg",
        gallery_images: [],
        metals: [
          { name: "18k Gold Vermeil", type: "gold", colorHex: "#d4af37" },
          { name: "Sterling Silver", type: "silver", colorHex: "#e5e7eb" },
        ],
        in_stock: p.inStock !== false,
      });
    });

    if (validRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid product rows to insert.", details: validationErrors },
        { status: 400 }
      );
    }

    // 2. Safe Chunked Batch Processing (Chunk size 50 to prevent connection/timeout spikes)
    const CHUNK_SIZE = 50;
    let totalImported = 0;
    const dbErrors: string[] = [];

    for (let i = 0; i < validRows.length; i += CHUNK_SIZE) {
      const chunk = validRows.slice(i, i + CHUNK_SIZE);
      const { data, error } = await supabaseAdmin
        .from("products")
        .upsert(chunk, { onConflict: "slug" })
        .select("id");

      if (error) {
        console.error(`Error importing chunk ${i / CHUNK_SIZE + 1}:`, error.message);
        dbErrors.push(`Chunk ${Math.floor(i / CHUNK_SIZE) + 1}: ${error.message}`);
      } else {
        totalImported += (data ? data.length : chunk.length);
      }
    }

    // Purge cached catalog paths immediately on Edge CDN
    try {
      revalidatePath("/products");
      revalidatePath("/collections");
      revalidatePath("/api/products");
    } catch (e) {
      console.warn("Revalidation notice:", e);
    }


    return NextResponse.json({
      success: dbErrors.length === 0 || totalImported > 0,
      totalProcessed: products.length,
      importedCount: totalImported,
      validationErrorsCount: validationErrors.length,
      validationErrors: validationErrors.slice(0, 10), // Return top 10 errors
      databaseErrors: dbErrors,
      message: `Successfully imported ${totalImported} of ${products.length} products.`,
    });
  } catch (err: any) {
    console.error("Bulk import exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process bulk import." },
      { status: 500 }
    );
  }
}
