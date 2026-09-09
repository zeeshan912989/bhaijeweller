import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const tag = searchParams.get("tag");
    const path = searchParams.get("path");

    // Optional secret verification for external webhook invocations
    const expectedSecret = process.env.REVALIDATION_SECRET || "bhai_luxury_cache_key";
    if (secret && secret !== expectedSecret) {
      return NextResponse.json({ success: false, error: "Invalid revalidation secret." }, { status: 401 });
    }

    if (tag) {
      // Revalidate all data tagged with this key (Zero Redis needed)
      revalidateTag(tag, "default");
    }

    if (path) {
      // Revalidate specific page/path in Next.js ISR cache
      revalidatePath(path);
    } else {
      // Default: purge product catalog paths
      revalidatePath("/products");
      revalidatePath("/collections");
      revalidatePath("/api/products");
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      tag: tag || null,
      path: path || "/products",
      now: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to revalidate." },
      { status: 500 }
    );
  }
}
