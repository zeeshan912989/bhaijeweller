"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
  Check
} from "lucide-react";
import { Product } from "@/data/products";
import { uploadProductImage } from "@/lib/storageHelper";

interface ProductsViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  searchQuery: string;
  onNavigateToAddProduct?: () => void;
}

export default function ProductsView({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  isAddModalOpen,
  setIsAddModalOpen,
  searchQuery,
  onNavigateToAddProduct,
}: ProductsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("earrings");
  const [formPrice, setFormPrice] = useState("");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formBadge, setFormBadge] = useState("Bestseller");
  const [formPrimaryImage, setFormPrimaryImage] = useState("/ear.jpeg");
  const [formHoverImage, setFormHoverImage] = useState("/ear ring.jpeg");
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([]);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [formInStock, setFormInStock] = useState(true);

  // Upload States
  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [isUploadingHover, setIsUploadingHover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const primaryFileInputRef = React.useRef<HTMLInputElement>(null);
  const hoverFileInputRef = React.useRef<HTMLInputElement>(null);
  const galleryFileInputRef = React.useRef<HTMLInputElement>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = searchQuery.trim() === "" || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCat = selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : "");
    setFormBadge(p.badge || "");
    setFormPrimaryImage(p.images.primary);
    setFormHoverImage(p.images.hover || "");
    setFormGalleryImages(p.images.gallery || []);
    setFormInStock(p.inStock);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
    setFormName("");
    setFormPrice("");
    setFormOriginalPrice("");
    setFormGalleryImages([]);
    setGalleryUrlInput("");
  };

  const handlePrimaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPrimary(true);
    try {
      const url = await uploadProductImage(file, "primary");
      setFormPrimaryImage(url);
    } catch (err) {
      console.error("Primary upload failed:", err);
    } finally {
      setIsUploadingPrimary(false);
    }
  };

  const handleHoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHover(true);
    try {
      const url = await uploadProductImage(file, "hover");
      setFormHoverImage(url);
    } catch (err) {
      console.error("Hover upload failed:", err);
    } finally {
      setIsUploadingHover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file, "gallery");
        if (url) newUrls.push(url);
      }
      setFormGalleryImages((prev) => [...prev, ...newUrls]);
    } catch (err) {
      console.error("Gallery upload failed:", err);
    } finally {
      setIsUploadingGallery(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setFormGalleryImages((prev) => [...prev, galleryUrlInput.trim()]);
    setGalleryUrlInput("");
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const priceNum = parseFloat(formPrice);
    const origPriceNum = formOriginalPrice ? parseFloat(formOriginalPrice) : undefined;
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formName,
        slug,
        category: formCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        badge: formBadge || undefined,
        images: {
          primary: formPrimaryImage,
          hover: formHoverImage || undefined,
          gallery: formGalleryImages,
        },
        inStock: formInStock,
      };
      onUpdateProduct(updated);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formName,
        slug,
        category: formCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        badge: formBadge || undefined,
        images: {
          primary: formPrimaryImage,
          hover: formHoverImage || undefined,
          gallery: formGalleryImages,
        },
        metals: [
          { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
          { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" },
        ],
        inStock: formInStock,
      };
      onAddProduct(newProd);
    }

    handleCloseModal();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Action & Category Filter Bar (Square) */}
      <div className="bg-white p-4 border border-neutral-200 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Category Square Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {["all", "earrings", "necklaces", "bracelets", "rings"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
                selectedCategory === cat
                  ? "bg-neutral-950 text-white border-neutral-950"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-200"
              }`}
            >
              {cat === "all" ? "All Products" : cat}
            </button>
          ))}
        </div>

        {/* Counter & Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-neutral-500 font-medium">
            <strong>{filteredProducts.length}</strong> items
          </span>
          <button
            onClick={() => {
              if (onNavigateToAddProduct) {
                onNavigateToAddProduct();
              } else {
                setEditingProduct(null);
                setFormName("");
                setFormPrice("");
                setFormOriginalPrice("");
                setIsAddModalOpen(true);
              }
            }}
            className="px-4 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Piece</span>
          </button>
        </div>

      </div>

      {/* Products Table Card (Square) */}
      <div className="bg-white border border-neutral-200 rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-bold uppercase tracking-widest">
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price (£)</th>
                <th className="py-3.5 px-4 font-semibold">Badge</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors group">
                  
                  {/* Product Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-none overflow-hidden bg-[#FAF7F2] border border-neutral-200 flex-shrink-0">
                        <Image
                          src={product.images.primary}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-neutral-950 text-xs sm:text-[13px] group-hover:text-[#b8860b] transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[10.5px] text-neutral-400 font-mono mt-0.5">
                          /products/{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 border border-neutral-200 text-[10.5px] font-bold text-neutral-800 uppercase tracking-wider rounded-none">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold text-neutral-950">
                    <span>£{product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-[10.5px] text-neutral-400 line-through ml-1.5 font-normal">
                        £{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Badge */}
                  <td className="py-3 px-4">
                    {product.badge ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#FAF7F2] text-[#997b24] border border-[#d4af37]/40 rounded-none">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>

                  {/* Stock Toggle (Square) */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onUpdateProduct({ ...product, inStock: !product.inStock })}
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-none border ${
                        product.inStock
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-red-50 text-red-800 border-red-300"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 border border-transparent hover:border-neutral-200 rounded-none transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-none transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal (Square) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-none max-w-xl w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <div>
                <h3
                  style={{ fontFamily: "var(--font-neue-haas)" }}
                  className="text-base font-bold text-neutral-950 uppercase tracking-wider"
                >
                  {editingProduct ? "Edit Jewellery Piece" : "Add New Jewellery Piece"}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">Publish fine jewellery directly to the live BHAI store</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 text-neutral-400 hover:text-black transition-colors rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baroque Pearl Drop Earrings"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-black font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2.5 text-xs text-neutral-900 outline-none focus:border-black capitalize font-medium"
                  >
                    <option value="earrings">Earrings</option>
                    <option value="necklaces">Necklaces</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="rings">Rings</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                    Badge Pill
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2.5 text-xs text-neutral-900 outline-none focus:border-black font-medium"
                  >
                    <option value="">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Statement">Statement</option>
                    <option value="New In">New In</option>
                    <option value="Everyday Staple">Everyday Staple</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                    Price (£ GBP) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="98.00"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-black font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="120.00"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:border-black font-medium"
                  />
                </div>
              </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={primaryFileInputRef}
              onChange={handlePrimaryUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={hoverFileInputRef}
              onChange={handleHoverUpload}
              accept="image/*"
              className="hidden"
            />
            <input
              type="file"
              ref={galleryFileInputRef}
              onChange={handleGalleryUpload}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* 1. Primary Photo */}
            <div className="space-y-1.5 p-3 bg-[#FAF7F2]/60 border border-neutral-300">
              <label className="block font-bold text-neutral-800 text-[11px] uppercase tracking-wider">
                Primary Product Photo *
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 relative bg-white border border-neutral-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {formPrimaryImage ? (
                    <Image src={formPrimaryImage} alt="Primary preview" fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-neutral-300" />
                  )}
                  {isUploadingPrimary && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isUploadingPrimary}
                      onClick={() => primaryFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer rounded-none disabled:opacity-50"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{isUploadingPrimary ? "Uploading..." : "Upload Photo"}</span>
                    </button>
                    {formPrimaryImage && (
                      <button
                        type="button"
                        onClick={() => setFormPrimaryImage("")}
                        className="px-2.5 py-1.5 border border-neutral-300 text-neutral-700 text-[11px] font-bold uppercase hover:bg-neutral-100"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Image URL or upload from computer"
                    value={formPrimaryImage}
                    onChange={(e) => setFormPrimaryImage(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-2.5 py-1 text-xs text-neutral-900 outline-none focus:border-black font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Hover Photo */}
            <div className="space-y-1.5 p-3 bg-[#FAF7F2]/60 border border-neutral-300">
              <label className="block font-bold text-neutral-800 text-[11px] uppercase tracking-wider">
                Hover / On-Model Photo (Optional)
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 relative bg-white border border-neutral-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {formHoverImage ? (
                    <Image src={formHoverImage} alt="Hover preview" fill className="object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-neutral-300" />
                  )}
                  {isUploadingHover && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isUploadingHover}
                      onClick={() => hoverFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer rounded-none disabled:opacity-50"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{isUploadingHover ? "Uploading..." : "Upload Photo"}</span>
                    </button>
                    {formHoverImage && (
                      <button
                        type="button"
                        onClick={() => setFormHoverImage("")}
                        className="px-2.5 py-1.5 border border-neutral-300 text-neutral-700 text-[11px] font-bold uppercase hover:bg-neutral-100"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL or upload from computer"
                    value={formHoverImage}
                    onChange={(e) => setFormHoverImage(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-2.5 py-1 text-xs text-neutral-900 outline-none focus:border-black font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. Multiple Gallery Photos (Upload as many photos as you want!) */}
            <div className="space-y-2 p-3 bg-white border border-neutral-300">
              <div className="flex items-center justify-between gap-2">
                <label className="block font-bold text-neutral-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <span>Additional Gallery Photos (Multiple)</span>
                  <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 font-mono">
                    {formGalleryImages.length} Added
                  </span>
                </label>
                <button
                  type="button"
                  disabled={isUploadingGallery}
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer rounded-none disabled:opacity-50"
                >
                  <Upload className="w-3 h-3" />
                  <span>{isUploadingGallery ? "Uploading..." : "Upload Multiple Photos"}</span>
                </button>
              </div>

              {/* Add URL */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or paste an image URL to add to gallery..."
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGalleryUrl();
                    }
                  }}
                  className="flex-1 bg-white border border-neutral-300 rounded-none px-2.5 py-1 text-xs text-neutral-900 font-mono outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  disabled={!galleryUrlInput.trim()}
                  className="px-3 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold transition-colors disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Gallery Thumbnails Grid */}
              {formGalleryImages.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1 max-h-48 overflow-y-auto">
                  {formGalleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="group relative aspect-square bg-[#FAF7F2] border border-neutral-300 overflow-hidden">
                      <Image src={imgUrl} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                      <span className="absolute top-0.5 left-0.5 bg-black/70 text-white text-[8px] font-mono px-1">
                        #{idx + 1}
                      </span>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1 text-white">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="w-4 h-4 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => setFormPrimaryImage(imgUrl)}
                            className="w-full bg-white/90 text-black text-[8px] font-bold uppercase py-0.2"
                          >
                            Primary
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormHoverImage(imgUrl)}
                            className="w-full bg-neutral-800 text-white text-[8px] font-bold uppercase py-0.2"
                          >
                            Hover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-neutral-400 text-center py-2">
                  No additional gallery photos added yet. Click &quot;Upload Multiple Photos&quot; above.
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                <input
                  type="checkbox"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="w-4 h-4 accent-black rounded-none cursor-pointer"
                />
                <span>Mark In Stock for Immediate Dispatch</span>
              </label>
            </div>

              <div className="pt-6 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-none border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-none bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  {editingProduct ? "Save Changes" : "Publish Piece"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
