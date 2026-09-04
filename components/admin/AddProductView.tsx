"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { 
  PackagePlus, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Eye, 
  Plus, 
  Trash2, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Tag,
  Layers,
  DollarSign,
  Image as ImageIcon,
  Loader2,
  X,
  Globe,
  Search,
  Check,
  ExternalLink,
  Wand2
} from "lucide-react";
import { Product } from "@/data/products";
import { uploadProductImage } from "@/lib/storageHelper";

interface AddProductViewProps {
  onAddProduct: (product: Product) => void;
  onNavigateToProducts: () => void;
}

export default function AddProductView({
  onAddProduct,
  onNavigateToProducts,
}: AddProductViewProps) {
  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("earrings");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [badge, setBadge] = useState("Bestseller");
  const [primaryImage, setPrimaryImage] = useState("/ear.jpeg");
  const [hoverImage, setHoverImage] = useState("/ear ring.jpeg");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [description, setDescription] = useState(
    "Handcrafted from 100% certified recycled 18ct gold vermeil. Designed for effortless everyday styling and luxury ear stacks."
  );
  const [inStock, setInStock] = useState(true);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([
    "18K Gold Vermeil",
    "Recycled Sterling Silver",
  ]);

  // SEO State
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [seoGeneratedSuccess, setSeoGeneratedSuccess] = useState(false);

  // Upload States
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [isUploadingHover, setIsUploadingHover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const primaryFileInputRef = useRef<HTMLInputElement>(null);
  const hoverFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(autoSlug);
  };

  // ONE-CLICK AUTO SEO GENERATOR
  const handleAutoGenerateSeo = () => {
    if (!name.trim()) return;
    setIsGeneratingSeo(true);
    setSeoGeneratedSuccess(false);

    setTimeout(() => {
      const catCapitalized = category.charAt(0).toUpperCase() + category.slice(1);
      const cleanName = name.trim();
      const primaryMetal = selectedMetals[0] || "18K Gold Vermeil";
      
      const generatedTitle = `Buy ${cleanName} in ${primaryMetal} | BHAI Fine Jewellery UK`;
      
      const generatedDesc = `Discover the handcrafted ${cleanName} at BHAI. Made from 100% certified recycled precious metals with signature luxury packaging. Free tracked UK delivery over £100.`;
      
      const generatedKeys = `${cleanName.toLowerCase()}, buy ${category} online, luxury ${category} uk, ${primaryMetal.toLowerCase()}, fine jewellery london, hypoallergenic ${category}, handcrafted jewellery`;

      setSeoTitle(generatedTitle);
      setSeoDescription(generatedDesc);
      setSeoKeywords(generatedKeys);
      setIsGeneratingSeo(false);
      setSeoGeneratedSuccess(true);

      setTimeout(() => setSeoGeneratedSuccess(false), 3500);
    }, 450);
  };

  const handlePrimaryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPrimary(true);
    try {
      const url = await uploadProductImage(file, "primary");
      setPrimaryImage(url);
    } catch (err) {
      console.error("Primary upload failed:", err);
    } finally {
      setIsUploadingPrimary(false);
    }
  };

  const handleHoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHover(true);
    try {
      const url = await uploadProductImage(file, "hover");
      setHoverImage(url);
    } catch (err) {
      console.error("Hover upload failed:", err);
    } finally {
      setIsUploadingHover(false);
    }
  };

  // MULTIPLE GALLERY IMAGES UPLOAD (Handles multiple files at once)
  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file, "gallery");
        if (url) newUrls.push(url);
      }
      setGalleryImages((prev) => [...prev, ...newUrls]);
    } catch (err) {
      console.error("Gallery batch upload failed:", err);
    } finally {
      setIsUploadingGallery(false);
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = "";
      }
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setGalleryImages((prev) => [...prev, galleryUrlInput.trim()]);
    setGalleryUrlInput("");
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const AVAILABLE_METALS = [
    { name: "18K Gold Vermeil", type: "gold" as const, colorHex: "#E5C158" },
    { name: "Recycled Sterling Silver", type: "silver" as const, colorHex: "#D1D5DB" },
    { name: "14K Solid Gold", type: "gold" as const, colorHex: "#ECC96A" },
    { name: "Rose Gold", type: "rose-gold" as const, colorHex: "#E8A598" },
    { name: "Mixed 18K Gold & Silver", type: "mixed" as const, colorHex: "#E5C158", secondaryColorHex: "#D1D5DB" },
  ];

  const toggleMetal = (metalName: string) => {
    if (selectedMetals.includes(metalName)) {
      if (selectedMetals.length > 1) {
        setSelectedMetals(selectedMetals.filter((m) => m !== metalName));
      }
    } else {
      setSelectedMetals([...selectedMetals, metalName]);
    }
  };

  const TARGET_COLLECTIONS = [
    { id: "earrings", label: "Earrings Collection", path: "/collections/earrings", icon: "💎" },
    { id: "necklaces", label: "Necklaces & Chains", path: "/collections/necklaces", icon: "📿" },
    { id: "bracelets", label: "Bracelets & Bangles", path: "/collections/bracelets", icon: "💫" },
    { id: "rings", label: "Stacking & Solitaire Rings", path: "/collections/rings", icon: "💍" },
    { id: "best-sellers", label: "Best Sellers Page", path: "/collections/best-sellers", icon: "✨" },
    { id: "gifts", label: "Luxury Gifting Suite", path: "/collections/gifts", icon: "🎁" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    setIsSubmitting(true);

    const priceNum = parseFloat(price);
    const origPriceNum = originalPrice ? parseFloat(originalPrice) : undefined;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const metalsData = AVAILABLE_METALS.filter((m) => selectedMetals.includes(m.name));

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug: finalSlug,
      name,
      category,
      price: priceNum,
      originalPrice: origPriceNum,
      badge: badge || undefined,
      images: {
        primary: primaryImage || "/ear.jpeg",
        hover: hoverImage || undefined,
        gallery: galleryImages,
      },
      metals: metalsData.length > 0 ? metalsData : [
        { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
        { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" }
      ],
      inStock,
    };

    onAddProduct(newProduct);

    setIsSubmitting(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
      onNavigateToProducts();
    }, 1800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Actions */}
      <div className="bg-white p-5 border border-neutral-200 rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#997b24] flex items-center gap-1.5 mb-1">
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Product Catalog Studio</span>
          </span>
          <h1
            style={{ fontFamily: "var(--font-neue-haas)" }}
            className="text-base sm:text-lg font-bold text-neutral-950 uppercase tracking-wider"
          >
            Add New Fine Jewellery Piece
          </h1>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Select target collection destination, upload photography, and auto-generate Google SEO metadata
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToProducts}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer"
        >
          Back to Catalogue
        </button>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-none flex items-center gap-3 text-xs font-bold animate-in fade-in duration-200 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <div>
            <p className="text-emerald-950 uppercase tracking-wider font-extrabold">Piece Published Successfully!</p>
            <p className="text-[11px] text-emerald-800 font-normal">
              &quot;{name}&quot; has been routed to <strong>/collections/{category}</strong> in Supabase database. Redirecting...
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Left Form Editor (7 cols) + Right Live Storefront Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Comprehensive Form Editor (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Target Collection Destination */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950">
                  1. Target Collection Page Routing
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Select which collection sub-page this piece should be published into
                </p>
              </div>
              <span className="text-[10px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 border border-neutral-300">
                /collections/{category}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {TARGET_COLLECTIONS.map((col) => {
                const isSelected = category === col.id;

                return (
                  <button
                    type="button"
                    key={col.id}
                    onClick={() => setCategory(col.id)}
                    className={`p-3.5 text-left border flex items-center justify-between text-xs transition-all cursor-pointer rounded-none ${
                      isSelected
                        ? "border-black bg-neutral-950 text-white font-bold shadow-xs"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{col.icon}</span>
                      <div>
                        <p className="font-bold uppercase tracking-wider text-[11px]">{col.label}</p>
                        <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? "text-neutral-400" : "text-neutral-400"}`}>
                          {col.path}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] text-[#d4af37] font-extrabold uppercase tracking-wider">
                        ✓ SELECTED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 2: General Information */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 border-b border-neutral-200 pb-3">
              2. Product Details
            </h2>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 18K Gold Pavé Chubby Huggie Hoops"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-semibold outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                URL Slug (Auto Generated) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-[10px]">
                  /products/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-none pl-20 pr-3 py-2 text-xs font-mono font-medium outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Editorial Craftsmanship Story & Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the materials, styling inspiration, and craftsmanship..."
                className="w-full bg-white border border-neutral-300 rounded-none p-3 text-xs text-neutral-900 outline-none focus:border-black font-medium leading-relaxed"
              />
            </div>
          </div>

          {/* Card 3: Pricing & Commercials */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 border-b border-neutral-200 pb-3">
              3. Pricing & Commercials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                  Selling Price (£ GBP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">
                    £
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="98.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none pl-8 pr-3.5 py-2.5 text-xs text-neutral-900 font-bold outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                  Original / Compare-At Price (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">
                    £
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="120.00"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none pl-8 pr-3.5 py-2.5 text-xs text-neutral-900 font-bold outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                  Product Badge Tag
                </label>
                <select
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-xs text-neutral-900 font-semibold outline-none focus:border-black"
                >
                  <option value="">None (Standard)</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Statement">Statement</option>
                  <option value="New In">New In</option>
                  <option value="Everyday Staple">Everyday Staple</option>
                  <option value="Limited Edition">Limited Edition</option>
                  <option value="Save £20">Save £20</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-900 text-xs">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4 accent-black rounded-none cursor-pointer"
                  />
                  <span>Mark as In Stock Ready to Ship</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 4: Interactive File & Photo Upload System */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950">
                  4. Photography & Asset Upload
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Upload high-resolution photography directly from your device (PNG, JPG, WEBP)
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5">
                Supabase Storage Ready
              </span>
            </div>

            {/* Hidden native file inputs */}
            <input
              type="file"
              ref={primaryFileInputRef}
              onChange={handlePrimaryFileUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={hoverFileInputRef}
              onChange={handleHoverFileUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={galleryFileInputRef}
              onChange={handleGalleryFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* 1. Primary Photo Upload Stage */}
            <div className="space-y-2">
              <label className="block font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Primary Product Photo (Required) *
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#FAF7F2]/60 border border-neutral-300">
                <div className="w-20 h-20 relative bg-white border border-neutral-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {primaryImage ? (
                    <Image
                      src={primaryImage}
                      alt="Primary product preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-300" />
                  )}
                  {isUploadingPrimary && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isUploadingPrimary}
                      onClick={() => primaryFileInputRef.current?.click()}
                      className="px-4 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-none disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPrimary ? "Uploading..." : "Upload from Computer"}</span>
                    </button>
                    {primaryImage && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage("")}
                        className="px-3 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Or paste image URL (/ear.jpeg)"
                    value={primaryImage}
                    onChange={(e) => setPrimaryImage(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3 py-1.5 text-xs text-neutral-800 font-mono outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* 2. Hover / On-Model Photo Upload Stage */}
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <label className="block font-bold text-neutral-800 uppercase tracking-wider text-[11px]">
                Hover / On-Model Photo (Optional)
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#FAF7F2]/60 border border-neutral-300">
                <div className="w-20 h-20 relative bg-white border border-neutral-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {hoverImage ? (
                    <Image
                      src={hoverImage}
                      alt="Hover product preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-300" />
                  )}
                  {isUploadingHover && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isUploadingHover}
                      onClick={() => hoverFileInputRef.current?.click()}
                      className="px-4 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-none disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingHover ? "Uploading..." : "Upload from Computer"}</span>
                    </button>
                    {hoverImage && (
                      <button
                        type="button"
                        onClick={() => setHoverImage("")}
                        className="px-3 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Or paste on-model image URL (/ear ring.jpeg)"
                    value={hoverImage}
                    onChange={(e) => setHoverImage(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3 py-1.5 text-xs text-neutral-800 font-mono outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* 3. Multiple Gallery Photos Stage (Add as many images as you want!) */}
            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block font-bold text-neutral-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>Additional Gallery Photos (Upload Multiple)</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 font-mono">
                      {galleryImages.length} {galleryImages.length === 1 ? "Photo" : "Photos"} Added
                    </span>
                  </label>
                  <p className="text-[10.5px] text-neutral-500">
                    Add unlimited angles, detail shots, lifestyle crops, and packaging photos. All added photos will appear in the product gallery.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isUploadingGallery}
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="px-4 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-none disabled:opacity-50 whitespace-nowrap self-start sm:self-auto"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingGallery ? "Uploading Photos..." : "Upload Multiple Photos"}</span>
                </button>
              </div>

              {/* Paste URL Input Option */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste an image URL to add to gallery (e.g. /brace.jpeg or https://...)"
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGalleryUrl();
                    }
                  }}
                  className="flex-1 bg-white border border-neutral-300 rounded-none px-3 py-1.5 text-xs text-neutral-800 font-mono outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  disabled={!galleryUrlInput.trim()}
                  className="px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Gallery Thumbnails Visual Grid */}
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {galleryImages.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square bg-[#FAF7F2] border border-neutral-300 overflow-hidden"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Gallery photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Badge count */}
                      <span className="absolute top-1 left-1 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.2">
                        #{index + 1}
                      </span>

                      {/* Action overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 text-white">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            title="Remove photo"
                            className="w-5 h-5 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-none cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(imgUrl)}
                            className="w-full bg-white/90 hover:bg-white text-black text-[9px] font-bold uppercase py-0.5 transition-colors"
                          >
                            Set Primary
                          </button>
                          <button
                            type="button"
                            onClick={() => setHoverImage(imgUrl)}
                            className="w-full bg-neutral-800/90 hover:bg-neutral-800 text-white text-[9px] font-bold uppercase py-0.5 transition-colors"
                          >
                            Set Hover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-neutral-300 bg-[#FAF7F2]/40 text-center">
                  <p className="text-[11px] text-neutral-500">
                    No extra gallery photos added yet. Click <strong>&quot;Upload Multiple Photos&quot;</strong> above to select multiple photos at once.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Card 5: Available Metals Selection */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 border-b border-neutral-200 pb-3">
              5. Available Metals & Craftsmanship Swatches
            </h2>
            <p className="text-[11px] text-neutral-500">
              Select all metal variations that customers can toggle between on the storefront:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {AVAILABLE_METALS.map((metal) => {
                const isSelected = selectedMetals.includes(metal.name);

                return (
                  <button
                    type="button"
                    key={metal.name}
                    onClick={() => toggleMetal(metal.name)}
                    className={`p-3 text-left border flex items-center justify-between text-xs transition-all cursor-pointer rounded-none ${
                      isSelected
                        ? "border-black bg-neutral-900 text-white font-bold"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                        style={{
                          background:
                            metal.type === "mixed"
                              ? "linear-gradient(135deg, #E5C158 50%, #D1D5DB 50%)"
                              : metal.colorHex,
                        }}
                      />
                      <span>{metal.name}</span>
                    </div>
                    {isSelected && <span className="text-[10px] text-[#d4af37] font-bold">✓ ACTIVE</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 6: ONE-CLICK AUTO SEO GENERATOR */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>6. Search Engine Optimization (SEO)</span>
                </h2>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Rank high on Google Search for jewellery buyers
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoGenerateSeo}
                disabled={!name.trim() || isGeneratingSeo}
                className="px-4 py-2 bg-[#d4af37] hover:bg-[#c5a030] text-neutral-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer rounded-none disabled:opacity-50 shadow-xs"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>{isGeneratingSeo ? "Generating..." : "⚡ Auto-Generate SEO"}</span>
              </button>
            </div>

            {seoGeneratedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Luxury Google SEO Metadata generated successfully!</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                SEO Meta Title (60-70 characters recommended)
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Buy Handcrafted 18K Gold Vermeil Earrings | BHAI UK"
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2 text-xs text-neutral-900 font-semibold outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                SEO Meta Description (140-160 characters recommended)
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Discover handcrafted jewellery at BHAI. Certified 100% recycled metals with luxury gift packaging..."
                className="w-full bg-white border border-neutral-300 rounded-none p-3 text-xs text-neutral-900 outline-none focus:border-black font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider text-[11px]">
                Target Search Keywords / Tags
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="gold earrings, 18k vermeil, hoops uk, fine jewellery london"
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2 text-xs text-neutral-900 font-mono outline-none focus:border-black"
              />
            </div>

            {/* Google SERP Snippet Box */}
            {(seoTitle || name) && (
              <div className="p-4 bg-neutral-50 border border-neutral-300 rounded-none space-y-1 mt-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block mb-1">
                  Google Search Snippet Preview
                </span>
                <p className="text-[11px] text-neutral-600 font-mono truncate">
                  https://bhaijewellery.com/collections/{category}/{slug || "product-slug"}
                </p>
                <p className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                  {seoTitle || `${name} | BHAI Luxury Jewellery UK`}
                </p>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                  {seoDescription || description || "Handcrafted fine jewellery from BHAI."}
                </p>
              </div>
            )}

          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onNavigateToProducts}
              className="px-6 py-3 border border-neutral-300 text-neutral-800 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors rounded-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingPrimary || isUploadingHover}
              className="px-8 py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer rounded-none disabled:opacity-50 shadow-md"
            >
              <PackagePlus className="w-4 h-4" />
              <span>{isSubmitting ? "Saving to Supabase..." : `Publish to /collections/${category}`}</span>
            </button>
          </div>

        </form>

        {/* RIGHT COLUMN: Real-Time Live Storefront Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          
          <div className="bg-white p-5 border border-neutral-200 rounded-none">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-950 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Live Card Preview</span>
              </span>
              <span className="text-[10px] uppercase font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                /collections/{category}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mb-4">
              This is exactly how this piece will render on the <strong>/collections/{category}</strong> page:
            </p>

            {/* Missoma-Style Product Card Preview */}
            <div className="border border-neutral-200 p-4 bg-[#FAF7F2]/40 rounded-none group cursor-pointer">
              
              {/* Product Image Stage */}
              <div className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden border border-neutral-200 mb-4">
                {primaryImage ? (
                  <Image
                    src={primaryImage}
                    alt={name || "Product preview"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}

                {/* Badge */}
                {badge && (
                  <span className="absolute top-3 left-3 bg-[#FAF7F2] text-[#997b24] text-[9.5px] font-extrabold uppercase tracking-widest px-2.5 py-1 border border-[#d4af37]/40 shadow-xs">
                    {badge}
                  </span>
                )}

                {/* Stock Tag */}
                <span
                  className={`absolute top-3 right-3 text-[9px] font-bold uppercase px-2 py-0.5 border ${
                    inStock
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-red-50 text-red-800 border-red-300"
                  }`}
                >
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{ fontFamily: "var(--font-neue-haas)" }}
                className="font-bold text-xs uppercase tracking-wider text-neutral-950 truncate mb-1"
              >
                {name || "Untitled Fine Jewellery Piece"}
              </h3>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex text-[#d4af37] text-[10px]">
                  {"★★★★★"}
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">(5.0)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-sm font-extrabold text-neutral-950 font-mono">
                  £{price ? parseFloat(price).toFixed(2) : "0.00"}
                </span>
                {originalPrice && (
                  <span className="text-xs text-neutral-400 line-through font-mono">
                    £{parseFloat(originalPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Metal Swatches */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-200">
                {selectedMetals.map((mName) => {
                  const mObj = AVAILABLE_METALS.find((x) => x.name === mName);
                  if (!mObj) return null;

                  return (
                    <span
                      key={mName}
                      title={mName}
                      className="w-3.5 h-3.5 rounded-full border border-black/30 inline-block"
                      style={{
                        background:
                          mObj.type === "mixed"
                            ? "linear-gradient(135deg, #E5C158 50%, #D1D5DB 50%)"
                            : mObj.colorHex,
                      }}
                    />
                  );
                })}
              </div>

            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-[#FAF7F2] p-5 border border-neutral-200 rounded-none text-xs text-neutral-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-950 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Direct Database Routing</span>
            </div>
            <p className="leading-relaxed font-light">
              Published pieces are saved in Supabase under category <strong>{category}</strong> and will instantly appear under <strong className="font-mono">/collections/{category}</strong> for customers to browse and checkout.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
