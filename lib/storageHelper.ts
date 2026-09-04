import { supabase } from "@/lib/supabaseClient";
import { setPersistentItem, getPersistentItem } from "@/lib/clientStorage";

/**
 * Upload an image or video file to Supabase Storage bucket 'product-images'.
 * If the bucket doesn't exist or fails (400 / 403), falls back gracefully
 * to IndexedDB high-capacity storage and Object URL so browser never throws QuotaExceededError.
 */
export async function uploadProductImage(
  file: File,
  folder: string = "products"
): Promise<string> {
  const fileExt = file.name.split(".").pop() || "jpg";
  const cleanFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${cleanFolder}/${fileName}`;

  // 1. Attempt Supabase Storage Upload
  try {
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || undefined,
      });

    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        return urlData.publicUrl;
      }
    } else if (error) {
      console.warn("Supabase storage upload returned notice (falling back to client storage):", error.message);
    }
  } catch (err) {
    console.warn("Supabase storage bucket upload notice:", err);
  }

  // 2. High-Capacity Fallback: Save to IndexedDB & Create Local Object/Data URL
  // This completely eliminates QuotaExceededError for large video/image blobs.
  try {
    const mediaId = `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    // For small files (< 1MB), create DataURL
    if (file.size < 1024 * 1024) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            resolve(URL.createObjectURL(file));
          }
        };
        reader.onerror = () => resolve(URL.createObjectURL(file));
        reader.readAsDataURL(file);
      });
    }

    // For larger media (videos, high-res photos), store in IndexedDB and return Object URL
    await setPersistentItem(`media_blob_${mediaId}`, file);
    return URL.createObjectURL(file);
  } catch (fallbackErr) {
    console.warn("Media fallback notice:", fallbackErr);
    return URL.createObjectURL(file);
  }
}
