"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Sparkles, 
  Layers, 
  Camera, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Upload, 
  X, 
  ExternalLink,
  ChevronRight,
  Eye,
  Tag,
  ShoppingBag,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Product } from "@/data/products";
import { ProductSetItem, SeeItIRLItem, DEFAULT_PRODUCT_SETS, DEFAULT_SEE_IT_IRL_ITEMS } from "@/data/productSets";
import { supabase } from "@/lib/supabaseClient";

interface SetsAndIRLViewProps {
  products: Product[];
}

export default function SetsAndIRLView({ products }: SetsAndIRLViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"sets" | "irl">("sets");
  const [productSets, setProductSets] = useState<ProductSetItem[]>(DEFAULT_PRODUCT_SETS);
  const [irlItems, setIrlItems] = useState<SeeItIRLItem[]>(DEFAULT_SEE_IT_IRL_ITEMS);
  const [loading, setLoading] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Set Modal State
  const [isSetModalOpen, setIsSetModalOpen] = useState(false);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [setTargetSlug, setSetTargetSlug] = useState("all");
  const [setTitle, setSetTitle] = useState("");
  const [setBadge, setSetBadge] = useState("SAVE Rs.14,678.00 AS A SET");
  const [setDesc, setSetDesc] = useState("Save 15% with our jewellery sets.");
  const [setImage, setSetImage] = useState("/ear.jpeg");
  const [setPrice, setSetPrice] = useState("195");
  const [setOrigPrice, setSetOrigPrice] = useState("230");
  const [moreStyles, setMoreStyles] = useState<{ name: string; image: string; price: number; slug: string }[]>([]);

  // IRL Modal State
  const [isIrlModalOpen, setIsIrlModalOpen] = useState(false);
  const [editingIrlId, setEditingIrlId] = useState<string | null>(null);
  const [irlImage, setIrlImage] = useState("");
  const [irlHandle, setIrlHandle] = useState("@");
  const [irlCaption, setIrlCaption] = useState("");
  const [irlProductSlug, setIrlProductSlug] = useState("all");
  const [isUploading, setIsUploading] = useState(false);

  // 1. Initial Load from Supabase + Local Storage Backup
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load Sets
        const { data: sData } = await supabase.from("product_sets").select("*").order("created_at", { ascending: false });
        if (sData && sData.length > 0) {
          setProductSets(sData.map((row) => ({
            id: row.id,
            targetProductSlug: row.target_product_slug || "all",
            setTitle: row.set_title,
            setSlug: row.set_slug,
            badgeText: row.badge_text,
            discountDescription: row.discount_description,
            bundleImage: row.bundle_image,
            bundlePrice: Number(row.bundle_price),
            originalTotalPrice: row.original_total_price ? Number(row.original_total_price) : undefined,
            includedItems: Array.isArray(row.included_items) ? row.included_items : [],
            moreStyles: Array.isArray(row.more_styles) ? row.more_styles : [],
          })));
        } else {
          const localSets = localStorage.getItem("bhai_product_sets_v1");
          if (localSets) setProductSets(JSON.parse(localSets));
        }

        // Load IRL
        const { data: irlData } = await supabase.from("see_it_irl").select("*").order("display_order", { ascending: true });
        if (irlData && irlData.length > 0) {
          setIrlItems(irlData.map((row) => ({
            id: row.id,
            imageUrl: row.image_url,
            customerHandle: row.customer_handle,
            caption: row.caption || "",
            productSlug: row.product_slug || "all",
            productName: row.product_name || "",
            productPrice: row.product_price ? Number(row.product_price) : undefined,
            displayOrder: row.display_order || 0,
          })));
        } else {
          const localIRL = localStorage.getItem("bhai_see_it_irl_v1");
          if (localIRL) setIrlItems(JSON.parse(localIRL));
        }
      } catch (err) {
        console.warn("Notice: Loaded offline defaults for Sets & IRL:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Broadcast updates to open product tabs
  const broadcastSync = () => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("bhai_store_updates");
      channel.postMessage({ type: "SYNC_SETS_AND_IRL", timestamp: Date.now() });
    }
  };

  // 2. Persist Sets
  const persistSets = async (items: ProductSetItem[]) => {
    setProductSets(items);
    try {
      localStorage.setItem("bhai_product_sets_v1", JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
    broadcastSync();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // 3. Persist IRL items
  const persistIRL = async (items: SeeItIRLItem[]) => {
    setIrlItems(items);
    try {
      localStorage.setItem("bhai_see_it_irl_v1", JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
    broadcastSync();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Handle Set Save
  const handleSaveSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setTitle.trim() || !setImage.trim()) return;

    const newSet: ProductSetItem = {
      id: editingSetId || `set-${Date.now()}`,
      targetProductSlug: setTargetSlug,
      setTitle: setTitle.trim(),
      setSlug: setTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      badgeText: setBadge.trim() || "SAVE AS A SET",
      discountDescription: setDesc.trim() || "Save 15% with our jewellery sets.",
      bundleImage: setImage.trim(),
      bundlePrice: parseFloat(setPrice) || 0,
      originalTotalPrice: parseFloat(setOrigPrice) || undefined,
      includedItems: [setTitle],
      moreStyles: moreStyles.length > 0 ? moreStyles : [
        {
          name: products[0]?.name || "Classic Huggies",
          image: products[0]?.images.primary || "/ear.jpeg",
          price: products[0]?.price || 98,
          slug: products[0]?.slug || "earrings",
        }
      ],
    };

    let updated: ProductSetItem[];
    if (editingSetId) {
      updated = productSets.map((s) => (s.id === editingSetId ? newSet : s));
    } else {
      updated = [newSet, ...productSets];
    }

    try {
      await supabase.from("product_sets").upsert({
        id: newSet.id,
        target_product_slug: newSet.targetProductSlug,
        set_title: newSet.setTitle,
        set_slug: newSet.setSlug,
        badge_text: newSet.badgeText,
        discount_description: newSet.discountDescription,
        bundle_image: newSet.bundleImage,
        bundle_price: newSet.bundlePrice,
        original_total_price: newSet.originalTotalPrice,
        included_items: newSet.includedItems,
        more_styles: newSet.moreStyles,
      });
    } catch (dbErr) {
      console.warn("Supabase upsert notice:", dbErr);
    }

    await persistSets(updated);
    setIsSetModalOpen(false);
    resetSetForm();
  };

  const resetSetForm = () => {
    setEditingSetId(null);
    setSetTargetSlug("all");
    setSetTitle("");
    setSetBadge("SAVE Rs.14,678.00 AS A SET");
    setSetDesc("Save 15% with our jewellery sets.");
    setSetImage("/ear.jpeg");
    setSetPrice("195");
    setSetOrigPrice("230");
    setMoreStyles([]);
  };

  const openEditSet = (item: ProductSetItem) => {
    setEditingSetId(item.id);
    setSetTargetSlug(item.targetProductSlug);
    setSetTitle(item.setTitle);
    setSetBadge(item.badgeText);
    setSetDesc(item.discountDescription);
    setSetImage(item.bundleImage);
    setSetPrice(item.bundlePrice.toString());
    setSetOrigPrice(item.originalTotalPrice ? item.originalTotalPrice.toString() : "");
    setMoreStyles(item.moreStyles || []);
    setIsSetModalOpen(true);
  };

  const handleDeleteSet = async (id: string) => {
    if (!confirm("Are you sure you want to remove this jewellery set?")) return;
    const filtered = productSets.filter((s) => s.id !== id);
    try {
      await supabase.from("product_sets").delete().eq("id", id);
    } catch (e) {
      console.warn(e);
    }
    await persistSets(filtered);
  };

  // Handle IRL Photo Save
  const handleSaveIRL = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!irlImage.trim()) return;

    const selectedProd = products.find((p) => p.slug === irlProductSlug);

    const newIrl: SeeItIRLItem = {
      id: editingIrlId || `irl-${Date.now()}`,
      imageUrl: irlImage.trim(),
      customerHandle: irlHandle.trim().startsWith("@") ? irlHandle.trim() : `@${irlHandle.trim()}`,
      caption: irlCaption.trim(),
      productSlug: irlProductSlug,
      productName: selectedProd?.name || "Fine Jewellery Piece",
      productPrice: selectedProd?.price,
      displayOrder: irlItems.length + 1,
    };

    let updated: SeeItIRLItem[];
    if (editingIrlId) {
      updated = irlItems.map((item) => (item.id === editingIrlId ? newIrl : item));
    } else {
      updated = [...irlItems, newIrl];
    }

    try {
      await supabase.from("see_it_irl").upsert({
        id: newIrl.id,
        image_url: newIrl.imageUrl,
        customer_handle: newIrl.customerHandle,
        caption: newIrl.caption,
        product_slug: newIrl.productSlug,
        product_name: newIrl.productName,
        product_price: newIrl.productPrice,
        display_order: newIrl.displayOrder,
      });
    } catch (dbErr) {
      console.warn("Supabase upsert IRL notice:", dbErr);
    }

    await persistIRL(updated);
    setIsIrlModalOpen(false);
    resetIrlForm();
  };

  const resetIrlForm = () => {
    setEditingIrlId(null);
    setIrlImage("");
    setIrlHandle("@");
    setIrlCaption("");
    setIrlProductSlug("all");
  };

  const openEditIRL = (item: SeeItIRLItem) => {
    setEditingIrlId(item.id);
    setIrlImage(item.imageUrl);
    setIrlHandle(item.customerHandle);
    setIrlCaption(item.caption || "");
    setIrlProductSlug(item.productSlug || "all");
    setIsIrlModalOpen(true);
  };

  const handleDeleteIRL = async (id: string) => {
    if (!confirm("Are you sure you want to remove this IRL community photo?")) return;
    const filtered = irlItems.filter((i) => i.id !== id);
    try {
      await supabase.from("see_it_irl").delete().eq("id", id);
    } catch (e) {
      console.warn(e);
    }
    await persistIRL(filtered);
  };

  // Image File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "set" | "irl") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (target === "set") setSetImage(dataUrl);
      if (target === "irl") setIrlImage(dataUrl);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-8 z-50 bg-neutral-950 text-white px-5 py-3.5 border border-[#d4af37]/40 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-[#d4af37]" />
          <p className="text-xs font-bold uppercase tracking-wider">Changes Saved & Live on Website</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-950 text-white p-6 sm:p-8 border border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 border border-[#d4af37]/20">
              Missoma Editorial Studio
            </span>
          </div>
          <h1 
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-2xl sm:text-3xl font-bold tracking-wider"
          >
            Sets & See It IRL Studio
          </h1>
          <p className="text-xs text-neutral-400 max-w-xl mt-1 leading-relaxed">
            Manage product bundle pairs (&quot;Save As A Set&quot; &amp; &quot;More Styles&quot;) and the real-life &quot;See It IRL&quot; customer photo gallery for your product pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === "sets" ? (
            <button
              onClick={() => {
                resetSetForm();
                setIsSetModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#b5952f] text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Set</span>
            </button>
          ) : (
            <button
              onClick={() => {
                resetIrlForm();
                setIsIrlModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#b5952f] text-black text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Upload IRL Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex border-b border-neutral-200 gap-8">
        <button
          onClick={() => setActiveSubTab("sets")}
          className={`pb-3.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer border-b-2 -mb-[2px] ${
            activeSubTab === "sets"
              ? "border-neutral-950 text-neutral-950"
              : "border-transparent text-neutral-400 hover:text-neutral-700"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Jewellery Sets (&quot;Save As A Set&quot;) ({productSets.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("irl")}
          className={`pb-3.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer border-b-2 -mb-[2px] ${
            activeSubTab === "irl"
              ? "border-neutral-950 text-neutral-950"
              : "border-transparent text-neutral-400 hover:text-neutral-700"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>&quot;See It IRL&quot; Community Photos ({irlItems.length})</span>
        </button>
      </div>

      {/* SUB-PANEL 1: JEWELLERY SETS MANAGER */}
      {activeSubTab === "sets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productSets.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Live Card Preview */}
                <div className="p-5 border-b border-neutral-100 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                    <span className="bg-neutral-100 px-2 py-0.5 rounded-sm">
                      Target: {item.targetProductSlug === "all" ? "All Products" : item.targetProductSlug}
                    </span>
                    <span className="text-[#997b24] font-bold">Bundle Active</span>
                  </div>

                  {/* Visual Widget Miniature */}
                  <div className="bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl p-3.5 flex items-center gap-3.5">
                    <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0">
                      <Image src={item.bundleImage} alt={item.setTitle} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-extrabold uppercase tracking-wide text-neutral-950 truncate">
                        {item.badgeText}
                      </p>
                      <p className="text-xs font-serif italic text-neutral-800 underline truncate mt-0.5">
                        {item.setTitle}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-0.5 truncate">
                        {item.discountDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-bold text-neutral-900 font-mono">£{item.bundlePrice}</span>
                    {item.originalTotalPrice && (
                      <span className="text-neutral-400 line-through font-mono">£{item.originalTotalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 bg-neutral-50 flex items-center justify-between">
                  <button
                    onClick={() => openEditSet(item)}
                    className="px-3 py-1.5 text-xs font-bold text-neutral-700 hover:text-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Set</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSet(item.id)}
                    className="px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-PANEL 2: SEE IT IRL COMMUNITY PHOTOS */}
      {activeSubTab === "irl" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {irlItems.map((item) => (
              <div 
                key={item.id}
                className="group relative aspect-[3/4] bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 shadow-xs"
              >
                <Image src={item.imageUrl} alt={item.customerHandle} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Overlay Badge */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3.5 text-white">
                  <p className="text-xs font-bold font-mono text-[#d4af37]">{item.customerHandle}</p>
                  {item.caption && (
                    <p className="text-[10.5px] text-white/90 line-clamp-1 mt-0.5">{item.caption}</p>
                  )}
                  <span className="text-[9px] uppercase tracking-widest text-neutral-300 font-mono mt-1 block">
                    Product: {item.productSlug}
                  </span>
                </div>

                {/* Hover Quick Actions */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditIRL(item)}
                    className="w-7 h-7 bg-white/90 hover:bg-white text-black rounded-full flex items-center justify-center shadow-md cursor-pointer"
                    title="Edit Photo"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteIRL(item.id)}
                    className="w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD/EDIT JEWELLERY SET */}
      {isSetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl border border-neutral-300 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
                {editingSetId ? "Edit Jewellery Set" : "Create Jewellery Set & Bundle"}
              </h2>
              <button onClick={() => setIsSetModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSet} className="space-y-4 pt-4">
              
              {/* Target Product */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Target Product (Where to show this widget)
                </label>
                <select
                  value={setTargetSlug}
                  onChange={(e) => setSetTargetSlug(e.target.value)}
                  className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none"
                >
                  <option value="all">🌟 All Products (Storewide Default)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name} ({p.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Set Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Set Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Mixed Metal Starter Set"
                  value={setTitle}
                  onChange={(e) => setSetTitle(e.target.value)}
                  className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none"
                />
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Headline Badge *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE Rs.14,678.00 AS A SET or SAVE 15% AS A SET"
                  value={setBadge}
                  onChange={(e) => setSetBadge(e.target.value)}
                  className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none"
                />
              </div>

              {/* Discount Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Save 15% with our jewellery sets."
                  value={setDesc}
                  onChange={(e) => setSetDesc(e.target.value)}
                  className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none"
                />
              </div>

              {/* Bundle Image Upload / URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Bundle Cutout Photo *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    placeholder="https://... or /ear.jpeg"
                    value={setImage}
                    onChange={(e) => setSetImage(e.target.value)}
                    className="flex-1 bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none"
                  />
                  <label className="px-4 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-black flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "set")}
                    />
                  </label>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Set Price (£) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="195"
                    value={setPrice}
                    onChange={(e) => setSetPrice(e.target.value)}
                    className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Original Price (£) (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="230"
                    value={setOrigPrice}
                    onChange={(e) => setSetOrigPrice(e.target.value)}
                    className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none font-mono"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsSetModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  {editingSetId ? "Update Set" : "Publish Set"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT IRL COMMUNITY PHOTO */}
      {isIrlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg border border-neutral-300 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-950">
                {editingIrlId ? "Edit IRL Photo" : "Upload & Tag 'See It IRL' Photo"}
              </h2>
              <button onClick={() => setIsIrlModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIRL} className="space-y-4 pt-4">
              
              {/* Photo Upload / URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Customer / On-Model Photo *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/... or data:image"
                    value={irlImage}
                    onChange={(e) => setIrlImage(e.target.value)}
                    className="flex-1 bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none"
                  />
                  <label className="px-4 py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-black flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "irl")}
                    />
                  </label>
                </div>
              </div>

              {/* Customer Handle */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Customer Handle / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. @rebecca_london or @charlotte_v"
                  value={irlHandle}
                  onChange={(e) => setIrlHandle(e.target.value)}
                  className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none font-mono"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Styling Notes / Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mixed metals styled with a clean tailored blazer"
                  value={irlCaption}
                  onChange={(e) => setIrlCaption(e.target.value)}
                  className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none"
                />
              </div>

              {/* Tagged Product */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Tagged Product
                </label>
                <select
                  value={irlProductSlug}
                  onChange={(e) => setIrlProductSlug(e.target.value)}
                  className="w-full bg-white border border-neutral-300 p-2.5 text-xs focus:border-black outline-none"
                >
                  <option value="all">🌟 All Products (Show across all PDPs)</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsIrlModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                >
                  {editingIrlId ? "Update Photo" : "Add Photo"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
