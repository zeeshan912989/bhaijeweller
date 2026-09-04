"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Film, 
  Upload, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Link as LinkIcon,
  ShoppingBag,
  Layers,
  ArrowRight,
  Search,
  Check,
  PackagePlus,
  Play
} from "lucide-react";
import { Product } from "@/data/products";
import { uploadProductImage } from "@/lib/storageHelper";
import { supabase } from "@/lib/supabaseClient";
import { setPersistentItem, getPersistentItem } from "@/lib/clientStorage";
import { compressVideo, CompressionProgress } from "@/lib/videoCompressor";

export interface VideoReelItem {
  id: string;
  videoUrl: string;
  posterUrl: string;
  product: {
    name: string;
    price: number;
    originalPrice?: number;
    thumbnail: string;
    href: string;
  };
}

interface VideoManagerViewProps {
  products: Product[];
  onNavigateToAddProduct?: () => void;
}

export default function VideoManagerView({ 
  products, 
  onNavigateToAddProduct 
}: VideoManagerViewProps) {
  const [reels, setReels] = useState<VideoReelItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isPreviewMuted, setIsPreviewMuted] = useState(true);
  const [successToast, setSuccessToast] = useState(false);
  const [compressProgress, setCompressProgress] = useState<CompressionProgress | null>(null);

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const posterFileInputRef = useRef<HTMLInputElement>(null);

  // Load existing reels safely from persistent storage or Supabase on mount
  useEffect(() => {
    async function initReels() {
      try {
        const stored = await getPersistentItem<VideoReelItem[]>("bhai_shoppable_reels_v1");
        if (stored && Array.isArray(stored)) {
          setReels(stored);
        }
      } catch (e) {
        console.warn("Local reel load notice:", e);
      }

      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "shoppable_reels")
          .maybeSingle();

        if (!error && data && Array.isArray(data.value)) {
          setReels(data.value);
          await setPersistentItem("bhai_shoppable_reels_v1", data.value);
        }
      } catch (err) {
        console.warn("Supabase video load notice:", err);
      }
    }
    initReels();
  }, []);

  // Update default selected product if products change
  useEffect(() => {
    if (!selectedProduct && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  // Filtered products for selection picker
  const filteredProducts = products.filter((p) => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  // Video file upload with automatic in-browser compression
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    try {
      // 1. In-browser client-side compression (reduces 40-100MB to 2-3MB 720p HD)
      const compressedFile = await compressVideo(file, {
        maxWidth: 720,
        maxHeight: 1280,
        videoBitrate: 1_800_000,
        onProgress: (p) => setCompressProgress(p),
      });

      // 2. Upload compressed file to Supabase / Persistent Media Storage
      const url = await uploadProductImage(compressedFile, "videos");
      setVideoUrl(url);
    } catch (err) {
      console.error("Video upload/compression failed:", err);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Poster photo upload
  const handlePosterFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPoster(true);
    try {
      const url = await uploadProductImage(file, "posters");
      setPosterUrl(url);
    } catch (err) {
      console.error("Poster upload failed:", err);
    } finally {
      setIsUploadingPoster(false);
    }
  };

  // Add new Shoppable Video Reel
  const handleAddReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !selectedProduct) return;

    const newReel: VideoReelItem = {
      id: `reel-${Date.now()}`,
      videoUrl,
      posterUrl: posterUrl || selectedProduct.images.primary,
      product: {
        name: selectedProduct.name,
        price: selectedProduct.price,
        originalPrice: selectedProduct.originalPrice,
        thumbnail: selectedProduct.images.primary,
        href: `/collections/${selectedProduct.category}`,
      },
    };

    const updated = [newReel, ...reels];
    setReels(updated);
    persistReels(updated);

    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  // Delete Reel
  const handleDeleteReel = (id: string) => {
    const updated = reels.filter((r) => r.id !== id);
    setReels(updated);
    persistReels(updated);
  };

  // Broadcast & Persist to Supabase / IndexedDB / LocalStorage safely
  const persistReels = async (items: VideoReelItem[]) => {
    try {
      await setPersistentItem("bhai_shoppable_reels_v1", items);

      // Broadcast to live homepage without refresh
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("bhai_realtime_videos");
        channel.postMessage({ type: "REELS_UPDATED", payload: items });
      }

      window.dispatchEvent(new Event("storage"));

      // Upsert to Supabase
      try {
        await supabase.from("site_settings").upsert({
          key: "shoppable_reels",
          value: items,
          updated_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn("Supabase video sync:", dbErr);
      }
    } catch (err) {
      console.warn("Reel persistence notice:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="bg-white p-5 border border-neutral-200 rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#997b24] flex items-center gap-1.5 mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>Shoppable Video Manager</span>
          </span>
          <h1
            style={{ fontFamily: "var(--font-neue-haas)" }}
            className="text-base sm:text-lg font-bold text-neutral-950 uppercase tracking-wider"
          >
            Homepage Video Reels & Product Selector
          </h1>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Upload on-model video and select which added product from your catalogue will be shoppable
          </p>
        </div>

        <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3 py-1 border border-emerald-300 text-[10.5px] font-bold uppercase tracking-wider rounded-none">
          <span className="w-2 h-2 bg-emerald-600 animate-pulse" />
          <span>Live Storefront Sync</span>
        </div>
      </div>

      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-none flex items-center gap-3 text-xs font-bold animate-in fade-in duration-200 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <div>
            <p className="text-emerald-950 uppercase tracking-wider font-extrabold">Shoppable Video Reel Published!</p>
            <p className="text-[11px] text-emerald-800 font-normal">
              Reel linked to &quot;{selectedProduct?.name}&quot; is now live on the homepage carousel.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Form (7 cols) + Right Live Reel Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Add New Reel Form */}
        <form onSubmit={handleAddReel} className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Video File & Media */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>1. Video Reel File & Source</span>
              </h2>
              <span className="text-[10px] font-mono text-neutral-500 uppercase bg-neutral-100 px-2 py-0.5">
                MP4 / WebM
              </span>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={videoFileInputRef}
              onChange={handleVideoFileUpload}
              accept="video/mp4,video/webm,video/*"
              className="hidden"
            />
            <input
              type="file"
              ref={posterFileInputRef}
              onChange={handlePosterFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Video Reel URL or Upload from Device *
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/...mp4 or /videos/reel1.mp4"
                  className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-mono outline-none focus:border-black"
                />
                <button
                  type="button"
                  disabled={isUploadingVideo}
                  onClick={() => videoFileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-none disabled:opacity-50 whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingVideo ? "Processing..." : "Upload MP4"}</span>
                </button>
              </div>

              {/* In-Browser Video Compression Progress Indicator */}
              {compressProgress && (
                <div className="mt-2.5 p-3 bg-neutral-50 border border-neutral-200 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5 font-mono">
                    <span className="text-[11px] font-bold text-neutral-800 flex items-center gap-1.5">
                      {compressProgress.status === "compressing" && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
                      )}
                      {compressProgress.status === "done" && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>
                        {compressProgress.status === "compressing"
                          ? "In-Browser Video Compressor Active"
                          : compressProgress.status === "done"
                          ? "Video Compressed & Ready"
                          : "Processing Video"}
                      </span>
                    </span>
                    <span className="text-[11px] font-bold text-[#997b24]">
                      {compressProgress.percent}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-neutral-200 h-1.5 rounded-none overflow-hidden">
                    <div
                      className="bg-[#d4af37] h-full transition-all duration-200"
                      style={{ width: `${compressProgress.percent}%` }}
                    />
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-neutral-500 font-mono">
                    <span>{compressProgress.message}</span>
                    {compressProgress.savedPercentage !== undefined && compressProgress.savedPercentage > 0 && (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                        -{compressProgress.savedPercentage}% Size Saved
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Cover Photo (Optional - Defaults to Linked Product Photo)
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  placeholder="/ear.jpeg or https://images.unsplash.com/..."
                  className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-mono outline-none focus:border-black"
                />
                <button
                  type="button"
                  disabled={isUploadingPoster}
                  onClick={() => posterFileInputRef.current?.click()}
                  className="px-4 py-2.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-none disabled:opacity-50 whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingPoster ? "Uploading..." : "Cover Photo"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Select From Added Products (Visual Picker) */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>2. Select Linked Product from Added Catalog</span>
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Click any product below to link it directly to the shoppable bottom pill
                </p>
              </div>

              {onNavigateToAddProduct && (
                <button
                  type="button"
                  onClick={onNavigateToAddProduct}
                  className="text-[10.5px] font-bold text-neutral-900 hover:text-[#b8860b] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <PackagePlus className="w-3.5 h-3.5" />
                  <span>+ Add New Product</span>
                </button>
              )}
            </div>

            {/* Search Filter for Products */}
            {products.length > 4 && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 pl-8 pr-3 py-2 text-xs font-medium outline-none focus:border-black rounded-none"
                />
              </div>
            )}

            {/* Visual Products Selection Grid */}
            {products.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF7F2] border border-neutral-200 rounded-none space-y-3">
                <ShoppingBag className="w-8 h-8 text-neutral-400 mx-auto" />
                <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  No Products Found in Catalogue Yet
                </p>
                <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                  Please add your jewellery products in the &quot;Add Product&quot; studio first so you can link them to video reels.
                </p>
                {onNavigateToAddProduct && (
                  <button
                    type="button"
                    onClick={onNavigateToAddProduct}
                    className="px-4 py-2 bg-neutral-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#d4af37] hover:text-black transition-colors rounded-none"
                  >
                    Go to Add Product Page
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {filteredProducts.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id || selectedProduct?.slug === prod.slug;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setSelectedProduct(prod);
                        setPosterUrl(prod.images.primary);
                      }}
                      className={`p-3 border rounded-none flex items-center gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? "border-black bg-neutral-950 text-white shadow-sm"
                          : "border-neutral-200 bg-white hover:border-neutral-400 text-neutral-900"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-12 h-12 relative bg-neutral-100 flex-shrink-0 border border-black/10 overflow-hidden">
                        <Image
                          src={prod.images.primary}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-neutral-950"}`}>
                          {prod.name}
                        </p>
                        <p className={`text-[10px] uppercase font-mono mt-0.5 ${isSelected ? "text-neutral-400" : "text-neutral-500"}`}>
                          /collections/{prod.category}
                        </p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className={`text-xs font-extrabold ${isSelected ? "text-[#d4af37]" : "text-[#997b24]"}`}>
                            £{prod.price.toFixed(2)}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-[10px] text-neutral-400 line-through">
                              £{prod.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Check indicator */}
                      <div className="flex-shrink-0">
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-neutral-300 inline-block" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedProduct && (
              <div className="p-3 bg-[#FAF7F2] border border-[#d4af37]/40 flex items-center justify-between text-xs text-neutral-800">
                <span className="font-semibold">
                  Linked Product: <strong className="text-neutral-950">{selectedProduct.name}</strong> (£{selectedProduct.price.toFixed(2)})
                </span>
                <span className="text-[10px] font-mono text-[#997b24] font-bold uppercase">
                  ✓ Auto-Configured
                </span>
              </div>
            )}

          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={isUploadingVideo || isUploadingPoster || !selectedProduct}
              className="px-8 py-3.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer rounded-none disabled:opacity-50 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Reel to Homepage Carousel</span>
            </button>
          </div>

        </form>

        {/* RIGHT COLUMN: Live Interactive Reel Preview */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          
          <div className="bg-white p-5 border border-neutral-200 rounded-none">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-950 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Live Homepage Reel Preview</span>
              </span>
              <span className="text-[10px] uppercase font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                Interactive
              </span>
            </div>

            {/* Vertical Video Reel Card (Matching Homepage InspirationStation Exact Styling) */}
            <div className="relative w-full max-w-[280px] mx-auto aspect-[9/16] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-300 shadow-xl group">
              
              {/* Video Element */}
              {videoUrl ? (
                <video
                  src={videoUrl}
                  poster={posterUrl || selectedProduct?.images.primary}
                  autoPlay
                  loop
                  muted={isPreviewMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 p-4 text-center">
                  <Play className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs">Upload or paste a video URL to preview</p>
                </div>
              )}

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setIsPreviewMuted(!isPreviewMuted)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm z-10 hover:bg-black transition-colors"
              >
                {isPreviewMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Linked Product Bottom Pill (Exact Match to Reference Screenshot!) */}
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-lg border border-black/10 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0 relative border border-neutral-200">
                    <Image
                      src={selectedProduct?.images.primary || "/ear.jpeg"}
                      alt={selectedProduct?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-neutral-900 truncate leading-tight">
                      {selectedProduct?.name || "Select a product from left list"}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      {selectedProduct?.originalPrice && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          £{selectedProduct.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xs font-bold text-[#b8860b]">
                        £{selectedProduct ? selectedProduct.price.toFixed(2) : "85.00"}
                      </span>
                    </div>
                  </div>
                  <span className="p-1 rounded-full bg-neutral-100 text-neutral-700 flex-shrink-0">
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>

          </div>

          <div className="bg-[#FAF7F2] p-4 border border-neutral-200 rounded-none text-xs text-neutral-700 space-y-1.5">
            <p className="font-bold text-neutral-950 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>One-Click Product Binding</span>
            </p>
            <p className="leading-relaxed font-light text-[11px]">
              Simply click on any product from your catalogue list. Title, price, photo thumbnail, and collection links are automatically bound to the video reel.
            </p>
          </div>

        </div>

      </div>

      {/* Active Video Reels List Table */}
      <div className="bg-white p-6 border border-neutral-200 rounded-none space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950">
              Active Video Reels on Homepage ({reels.length})
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Manage existing carousel reels displayed in the Inspiration Station section
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {reels.map((item, idx) => (
            <div
              key={item.id}
              className="border border-neutral-200 bg-neutral-50 p-3 rounded-none flex flex-col justify-between group hover:border-black transition-colors"
            >
              <div className="space-y-2">
                <div className="relative aspect-[9/14] w-full bg-black overflow-hidden">
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      poster={item.posterUrl || undefined}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">
                      No Video
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5">
                    Reel #{idx + 1}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <div className="w-7 h-7 relative rounded bg-white border border-neutral-300 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-neutral-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[10.5px] font-extrabold text-[#b8860b]">
                      £{item.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteReel(item.id)}
                className="mt-3 pt-2 border-t border-neutral-200 text-neutral-400 hover:text-red-600 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors cursor-pointer w-full"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Reel</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
