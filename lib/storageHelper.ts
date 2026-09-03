import { supabase } from "@/lib/supabaseClient";

/**
 * Upload an image file to Supabase Storage bucket 'product-images'.
 * If the bucket doesn't exist or fails, falls back gracefully to Base64 data URL.
 */
export async function uploadProductImage(file: File, folder: string = "products"): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 1. Try uploading to Supabase Storage 'product-images' bucket
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        return urlData.publicUrl;
      }
    }
  } catch (err) {
    console.warn("Supabase storage bucket upload notice:", err);
  }

  // 2. High-reliability fallback: Convert file to Base64 Data URL so upload never fails
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read image file"));
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
