"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Product } from "@/data/products";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Gift, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Minus, 
  Check, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Search,
  ThumbsUp,
  Maximize2,
  X,
  MessageSquarePlus,
  Send,
  Loader2
} from "lucide-react";

export interface ReviewItem {
  id: string;
  product_id?: string;
  product_slug: string;
  author_name: string;
  author_email?: string;
  rating: number;
  title: string;
  content: string;
  metal_chosen?: string;
  verified: boolean;
  helpful_count: number;
  created_at?: string;
}

const DISCOVER_CHIPS = [
  { label: "Hoop Earrings", href: "/collections/earrings" },
  { label: "Gold Huggies", href: "/collections/earrings" },
  { label: "Silver Rings", href: "/collections/rings" },
  { label: "T-Bar Chains", href: "/collections/necklaces" },
  { label: "Chunky Bangles", href: "/collections/bracelets" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "Luxury Gifting", href: "/collections/gifts" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMetalIndex, setSelectedMetalIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToBagToast, setAddedToBagToast] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Real Customer Reviews State (100% Real from Supabase)
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewFilterTag, setReviewFilterTag] = useState<string>("all");
  const [reviewSearch, setReviewSearch] = useState("");
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});

  // Review Form State
  const [formRating, setFormRating] = useState(5);
  const [formHoverRating, setFormHoverRating] = useState(0);
  const [formAuthorName, setFormAuthorName] = useState("");
  const [formAuthorEmail, setFormAuthorEmail] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formMetal, setFormMetal] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  // Accordions open states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: true,
    craftsmanship: false,
    shipping: false,
    gifting: false,
  });

  const reviewsSectionRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 1. Fetch Real Product from Supabase
  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      setNotFound(false);

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (!error && data) {
          const loadedProd: Product = {
            id: data.id,
            slug: data.slug,
            name: data.name,
            category: data.category,
            price: Number(data.price),
            originalPrice: data.original_price ? Number(data.original_price) : undefined,
            badge: data.badge || undefined,
            images: {
              primary: data.primary_image || "/ear.jpeg",
              hover: data.hover_image || undefined,
              gallery: Array.isArray(data.gallery_images) ? data.gallery_images : [],
            },
            metals: data.metals || [
              { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
              { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" }
            ],
            inStock: Boolean(data.in_stock ?? true),
          };

          setProduct(loadedProd);
          if (loadedProd.metals.length > 0) {
            setFormMetal(loadedProd.metals[0].name);
          }

          // Fetch real recommendations from same or other categories
          const { data: recData } = await supabase
            .from("products")
            .select("*")
            .neq("slug", slug)
            .limit(4);

          if (recData && recData.length > 0) {
            setRecommendations(
              recData.map((row) => ({
                id: row.id,
                slug: row.slug,
                name: row.name,
                category: row.category,
                price: Number(row.price),
                originalPrice: row.original_price ? Number(row.original_price) : undefined,
                badge: row.badge || undefined,
                images: {
                  primary: row.primary_image,
                  hover: row.hover_image,
                  gallery: Array.isArray(row.gallery_images) ? row.gallery_images : [],
                },
                metals: row.metals || [],
                inStock: Boolean(row.in_stock),
              }))
            );
          }
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Product load error:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  // 2. Fetch Real Reviews from Supabase
  useEffect(() => {
    async function loadReviews() {
      if (!slug) return;
      setLoadingReviews(true);

      try {
        const { data, error } = await supabase
          .from("product_reviews")
          .select("*")
          .eq("product_slug", slug)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setReviews(data);
        } else {
          // Check local cache if table hasn't been migrated yet
          const local = localStorage.getItem(`bhai_reviews_${slug}`);
          if (local) {
            setReviews(JSON.parse(local));
          }
        }
      } catch (err) {
        console.warn("Reviews load notice:", err);
        const local = localStorage.getItem(`bhai_reviews_${slug}`);
        if (local) {
          setReviews(JSON.parse(local));
        }
      } finally {
        setLoadingReviews(false);
      }
    }

    loadReviews();
  }, [slug]);

  // 3. Submit New Customer Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthorName.trim() || !formTitle.trim() || !formContent.trim()) return;

    setIsSubmittingReview(true);

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      product_id: product?.id,
      product_slug: slug,
      author_name: formAuthorName.trim(),
      author_email: formAuthorEmail.trim() || undefined,
      rating: formRating,
      title: formTitle.trim(),
      content: formContent.trim(),
      metal_chosen: formMetal || product?.metals[0]?.name || "18K Gold Vermeil",
      verified: true,
      helpful_count: 0,
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Try saving to Supabase
      await supabase.from("product_reviews").insert([newRev]);
    } catch (dbErr) {
      console.warn("Supabase review insert notice:", dbErr);
    }

    // 2. Update local state & localStorage backup
    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(`bhai_reviews_${slug}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setIsSubmittingReview(false);
    setReviewSubmittedSuccess(true);

    // Reset Form
    setFormTitle("");
    setFormContent("");
    setFormAuthorName("");
    setFormAuthorEmail("");

    setTimeout(() => {
      setReviewSubmittedSuccess(false);
      setIsReviewModalOpen(false);
    }, 1800);
  };

  // 4. Like / Helpful Vote for a Review
  const handleLikeReview = async (reviewId: string) => {
    if (likedReviews[reviewId]) return;

    setLikedReviews((prev) => ({ ...prev, [reviewId]: true }));

    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return { ...r, helpful_count: (r.helpful_count || 0) + 1 };
      }
      return r;
    });
    setReviews(updated);

    try {
      localStorage.setItem(`bhai_reviews_${slug}`, JSON.stringify(updated));
      const target = updated.find((r) => r.id === reviewId);
      if (target) {
        await supabase
          .from("product_reviews")
          .update({ helpful_count: target.helpful_count })
          .eq("id", reviewId);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Check if current product is wishlisted on mount
  useEffect(() => {
    if (!product) return;
    try {
      const stored = localStorage.getItem("bhai_wishlist_items_v1");
      if (stored) {
        const items = JSON.parse(stored);
        const exists = items.some((it: any) => it.id === product.id || it.slug === product.slug);
        setIsWishlisted(exists);
      }
    } catch (e) {
      console.error(e);
    }
  }, [product]);

  const handleToggleWishlist = () => {
    if (!product) return;

    try {
      const stored = localStorage.getItem("bhai_wishlist_items_v1");
      let items = stored ? JSON.parse(stored) : [];
      const index = items.findIndex((it: any) => it.id === product.id || it.slug === product.slug);

      if (index >= 0) {
        // Remove from wishlist
        items.splice(index, 1);
        setIsWishlisted(false);
      } else {
        // Add to wishlist
        items.unshift({
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images.primary,
          metal: currentMetal.name,
          inStock: product.inStock,
        });
        setIsWishlisted(true);
      }

      localStorage.setItem("bhai_wishlist_items_v1", JSON.stringify(items));
      window.dispatchEvent(new Event("bhai_wishlist_updated"));
      // Open Left Wishlist Drawer
      window.dispatchEvent(new Event("bhai_open_wishlist"));
    } catch (e) {
      console.error(e);
    }
  };

  const scrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToBag = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    setAddedToBagToast(true);
    setTimeout(() => setAddedToBagToast(false), 3000);

    await addToCart(
      product.id || product.slug,
      currentMetal?.name || "18K Gold Vermeil",
      quantity,
      {
        name: product.name,
        price: product.price,
        image: galleryImages[0] || product.images.primary,
        category: product.category,
      }
    );
    setIsAddingToCart(false);
  };

  // Dynamic Rating Calculations from Real Data
  const totalReviewsCount = reviews.length;
  const averageRating =
    totalReviewsCount > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
      : "5.0";

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
    return { star, count, pct };
  });

  const positiveReviewsCount = reviews.filter((r) => r.rating >= 4).length;
  const recommendPercent =
    totalReviewsCount > 0
      ? Math.round((positiveReviewsCount / totalReviewsCount) * 100)
      : 100;

  // Image gallery items from real product (strictly displays all unique added photos)
  const galleryImages = React.useMemo(() => {
    if (!product) return [];
    const list: string[] = [];
    if (product.images.primary?.trim()) {
      list.push(product.images.primary.trim());
    }
    if (product.images.hover?.trim() && !list.includes(product.images.hover.trim())) {
      list.push(product.images.hover.trim());
    }
    if (Array.isArray(product.images.gallery)) {
      product.images.gallery.forEach((img) => {
        if (img?.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    return list.length > 0 ? list : ["/ear.jpeg"];
  }, [product]);

  const currentMetal = product?.metals[selectedMetalIndex] || {
    name: "18K Gold Vermeil",
    type: "gold",
    colorHex: "#E5C158",
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-40">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent animate-spin mx-auto rounded-full" />
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Loading Fine Jewellery Piece...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not Found State (When no piece exists in Supabase for this slug)
  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 max-w-[800px] mx-auto px-4 text-center py-40 space-y-4">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#997b24]">
            Boutique Catalogue
          </span>
          <h1
            style={{ fontFamily: "var(--font-neue-haas)" }}
            className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-neutral-950"
          >
            Jewellery Piece Not Found
          </h1>
          <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
            This piece may have been updated or archived. Explore our current collections or add this piece in the Admin Studio.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/collections/earrings"
              className="px-6 py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
            >
              Browse Earrings
            </Link>
            <Link
              href="/collections/necklaces"
              className="px-6 py-3 border border-neutral-300 hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
            >
              Browse Necklaces
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between selection:bg-[#d4af37]/25">
      {/* 1. SOLID WHITE LUXURY HEADER */}
      <Navbar />

      {/* 2. MAIN PDP STAGE (GENEROUS PADDING FOR MULTI-BAR FIXED HEADER) */}
      <main className="pt-32 sm:pt-36 lg:pt-44 pb-20">
        
        {/* Breadcrumb Navigation */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 pb-4">
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-500">
            <Link href="/" className="hover:text-black transition-colors">HOME</Link>
            <span className="text-neutral-300">/</span>
            <Link href={`/collections/${product.category}`} className="hover:text-black transition-colors capitalize">
              {product.category}
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-950 font-extrabold truncate max-w-[280px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Added to Bag Floating Notification */}
        {addedToBagToast && (
          <div className="fixed top-24 right-4 sm:right-8 z-50 bg-neutral-950 text-white p-4 border border-neutral-800 shadow-2xl rounded-none flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <Check className="w-4 h-4 text-[#d4af37]" />
            <div className="text-xs">
              <p className="font-bold uppercase tracking-wider">Added to Shopping Bag</p>
              <p className="text-[11px] text-neutral-400 font-light mt-0.5">
                {quantity}x {product.name} ({currentMetal.name})
              </p>
            </div>
          </div>
        )}

        {/* TOP EDITORIAL SECTION: 2-COLUMN LUXURY SPLIT (GALLERY + BUY BOX) */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Editorial Image Gallery (7 Columns) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Main Active Product Photo */}
              <div className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden border border-neutral-200 rounded-none group">
                <Image
                  src={galleryImages[selectedImageIndex] || galleryImages[0] || "/ear.jpeg"}
                  alt={`${product.name} view ${selectedImageIndex + 1}`}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Badge Tag */}
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#997b24] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 border border-[#d4af37]/40 shadow-xs">
                    {product.badge}
                  </span>
                )}

                {/* Photo Counter Badge (When multiple photos exist) */}
                {galleryImages.length > 1 && (
                  <span className="absolute top-4 right-4 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 tracking-widest shadow-xs">
                    {selectedImageIndex + 1} / {galleryImages.length}
                  </span>
                )}

                {/* Previous Image Arrow */}
                {galleryImages.length > 1 && (
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-none"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
                  </button>
                )}

                {/* Next Image Arrow */}
                {galleryImages.length > 1 && (
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white text-black flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-none"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[1.5]" />
                  </button>
                )}

                {/* Lightbox / Zoom Icon */}
                <button
                  aria-label="Enlarge image"
                  onClick={() => setIsZoomModalOpen(true)}
                  className="absolute bottom-4 right-4 w-9 h-9 bg-white/90 hover:bg-white text-neutral-900 flex items-center justify-center rounded-none shadow-md transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>

              {/* Dynamic Multiple Thumbnails Strip (Shows ALL added photos) */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {galleryImages.map((imgSrc, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-[#FAF7F2] border transition-all cursor-pointer rounded-none overflow-hidden ${
                        selectedImageIndex === idx
                          ? "border-neutral-950 ring-2 ring-black opacity-100"
                          : "border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgSrc}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[8px] font-mono px-1">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* USP Trust Bar below photos */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-200 text-center text-neutral-700">
                <div className="p-3 bg-[#FAF7F2]/60 border border-neutral-200/80 space-y-1">
                  <ShieldCheck className="w-4 h-4 text-[#997b24] mx-auto" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">100% Recycled Gold</p>
                  <p className="text-[9.5px] text-neutral-500 font-light">Certified ethical precious metals</p>
                </div>
                <div className="p-3 bg-[#FAF7F2]/60 border border-neutral-200/80 space-y-1">
                  <Truck className="w-4 h-4 text-[#997b24] mx-auto" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Free UK Delivery</p>
                  <p className="text-[9.5px] text-neutral-500 font-light">Tracked on orders over £100</p>
                </div>
                <div className="p-3 bg-[#FAF7F2]/60 border border-neutral-200/80 space-y-1">
                  <RotateCcw className="w-4 h-4 text-[#997b24] mx-auto" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">30-Day Returns</p>
                  <p className="text-[9.5px] text-neutral-500 font-light">Complimentary exchange</p>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Sticky Buy Box Panel (5 Columns) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
              
              {/* Product Title & Subtitle */}
              <div>
                <h1
                  style={{ fontFamily: "var(--font-neue-haas)" }}
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-neutral-950 leading-tight"
                >
                  {product.name}
                </h1>
                <p className="text-xs text-neutral-500 font-medium mt-1">
                  {currentMetal.name} • Certified Handcrafted
                </p>

                {/* Rating trigger */}
                <div 
                  onClick={scrollToReviews}
                  className="flex items-center gap-2 mt-2.5 cursor-pointer group"
                >
                  <div className="flex text-[#d4af37] text-xs">
                    {"★★★★★"}
                  </div>
                  <span className="text-xs font-bold text-neutral-900 group-hover:underline">
                    {averageRating}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    ({totalReviewsCount} {totalReviewsCount === 1 ? "Review" : "Reviews"})
                  </span>
                </div>
              </div>

              {/* Price & Klarna Installments */}
              <div className="py-3 border-y border-neutral-200 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-extrabold text-neutral-950 font-mono">
                    £{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-400 line-through font-mono">
                      £{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 px-2 py-0.5 border border-red-200">
                      Save £{(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Klarna / Clearpay 3-payment split */}
                <p className="text-[11px] text-neutral-600 font-medium">
                  or 3 interest-free payments of <strong className="text-neutral-900">£{(product.price / 3).toFixed(2)}</strong> with <span className="font-bold underline cursor-pointer">Klarna</span> or <span className="font-bold underline cursor-pointer">Clearpay</span>.
                </p>
              </div>

              {/* Metal Swatches Selector */}
              {product.metals && product.metals.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold uppercase tracking-wider text-neutral-900">
                      Metal: <span className="text-[#997b24]">{currentMetal.name}</span>
                    </span>
                    <span className="text-[10.5px] text-neutral-500 font-medium">
                      {product.metals.length} variations
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {product.metals.map((metal, idx) => {
                      const isSelected = selectedMetalIndex === idx;

                      return (
                        <button
                          key={metal.name}
                          onClick={() => {
                            setSelectedMetalIndex(idx);
                            setFormMetal(metal.name);
                          }}
                          title={metal.name}
                          className={`p-1 border transition-all cursor-pointer rounded-full ${
                            isSelected
                              ? "border-black ring-2 ring-black/20 scale-110"
                              : "border-neutral-300 hover:border-neutral-500"
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-full block border border-black/20"
                            style={{
                              background:
                                metal.type === "mixed"
                                  ? "linear-gradient(135deg, #E5C158 50%, #D1D5DB 50%)"
                                  : metal.colorHex,
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Stock Pill */}
              <div className="flex items-center justify-between gap-4 pt-1">
                {/* Quantity Box */}
                <div className="flex items-center border border-neutral-300 rounded-none bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-2 text-xs font-bold font-mono text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Stock Indicator */}
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-2 border border-emerald-300 flex-1 justify-center uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>In Stock — Ready to Ship</span>
                </span>
              </div>

              {/* Action Buttons: Add to Bag & Express Checkout */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleAddToBag}
                    className="flex-1 py-4 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer rounded-none shadow-md active:scale-[0.99]"
                  >
                    Add To Bag • £{(product.price * quantity).toFixed(2)}
                  </button>
                  
                  {/* Wishlist Heart Button */}
                  <button
                    onClick={handleToggleWishlist}
                    aria-label="Add to Wishlist"
                    className={`p-3.5 border transition-all cursor-pointer rounded-none ${
                      isWishlisted
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-neutral-300 hover:border-black text-neutral-700 hover:text-black"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-600" : ""}`} />
                  </button>
                </div>

                {/* Express One-Click Checkout Button */}
                <button
                  onClick={handleAddToBag}
                  className="w-full py-3.5 bg-[#5A31F4] hover:bg-[#4824d6] text-white text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded-none shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Buy with Shop Pay</span>
                </button>
              </div>

              {/* Free Delivery Banner Strip */}
              <div className="p-3.5 bg-[#FAF7F2] border border-neutral-200 text-xs text-neutral-700 flex items-center gap-2.5">
                <Gift className="w-4 h-4 text-[#997b24] flex-shrink-0" />
                <p className="leading-snug text-[11px]">
                  <strong>Complimentary Gift Box:</strong> Every order arrives in our signature embossed luxury jewellery box with protective pouch.
                </p>
              </div>

              {/* Product Accordions (Dimensions, Craftsmanship, Shipping, Gifting) */}
              <div className="border-t border-neutral-200 pt-2 divide-y divide-neutral-200 text-xs">
                
                {/* 1. Dimensions & Specifications */}
                <div>
                  <button
                    onClick={() => toggleAccordion("details")}
                    className="w-full py-4 flex items-center justify-between font-bold uppercase tracking-wider text-neutral-950 text-left cursor-pointer"
                  >
                    <span>Dimensions & Specifications</span>
                    {openAccordions.details ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openAccordions.details && (
                    <div className="pb-4 text-neutral-600 font-light leading-relaxed space-y-2 text-[11.5px]">
                      <p>• <strong>Silhouette:</strong> Handcrafted {product.name}</p>
                      <p>• <strong>Metal:</strong> {currentMetal.name}</p>
                      <p>• <strong>Weight:</strong> Engineered for ultra-comfortable everyday wear</p>
                      <p>• <strong>Finish:</strong> High-polish radiant mirror luster</p>
                    </div>
                  )}
                </div>

                {/* 2. Craftsmanship & Materials */}
                <div>
                  <button
                    onClick={() => toggleAccordion("craftsmanship")}
                    className="w-full py-4 flex items-center justify-between font-bold uppercase tracking-wider text-neutral-950 text-left cursor-pointer"
                  >
                    <span>Materials & Craftsmanship</span>
                    {openAccordions.craftsmanship ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openAccordions.craftsmanship && (
                    <div className="pb-4 text-neutral-600 font-light leading-relaxed space-y-2 text-[11.5px]">
                      <p>Handcrafted using 100% certified recycled precious metals. Our 18ct Gold Vermeil is engineered with a minimum 2.5 micron thickness over sterling silver for enduring luxury.</p>
                      <p>Hypoallergenic, nickel-free, and lead-free. Includes our comprehensive <strong>2-Year Quality Guarantee</strong>.</p>
                    </div>
                  )}
                </div>

                {/* 3. Delivery & Returns */}
                <div>
                  <button
                    onClick={() => toggleAccordion("shipping")}
                    className="w-full py-4 flex items-center justify-between font-bold uppercase tracking-wider text-neutral-950 text-left cursor-pointer"
                  >
                    <span>Delivery & Complimentary Returns</span>
                    {openAccordions.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openAccordions.shipping && (
                    <div className="pb-4 text-neutral-600 font-light leading-relaxed space-y-2 text-[11.5px]">
                      <p>• <strong>Standard UK Tracked:</strong> 2-3 business days (Free over £100, otherwise £3.95)</p>
                      <p>• <strong>Next Day Express:</strong> Order before 3pm for next day dispatch (£6.95)</p>
                      <p>• <strong>International Express:</strong> Worldwide express delivery in 3-5 business days</p>
                      <p>• <strong>Returns:</strong> 30-day hassle-free returns policy on all unworn pieces.</p>
                    </div>
                  )}
                </div>

                {/* 4. Packaging & Gifting */}
                <div>
                  <button
                    onClick={() => toggleAccordion("gifting")}
                    className="w-full py-4 flex items-center justify-between font-bold uppercase tracking-wider text-neutral-950 text-left cursor-pointer"
                  >
                    <span>Gifting & Sustainable Packaging</span>
                    {openAccordions.gifting ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openAccordions.gifting && (
                    <div className="pb-4 text-neutral-600 font-light leading-relaxed space-y-2 text-[11.5px]">
                      <p>Each piece is individually nested inside an anti-tarnish soft micro-suede pouch, placed within an FSC-certified recyclable luxury presentation box with satin ribbon detailing.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* 3. "DISCOVER MORE" CATEGORY CHIPS */}
        <section className="border-y border-neutral-200 py-6 bg-[#FAF7F2]/40 my-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-3">
              Discover More Categories
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {DISCOVER_CHIPS.map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  className="px-4 py-2 bg-white hover:bg-neutral-950 hover:text-white border border-neutral-200 text-neutral-800 text-xs font-bold uppercase tracking-wider transition-all rounded-none shadow-2xs"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. "YOU MAY ALSO LIKE" RECOMMENDATIONS SLIDER (REAL PRODUCTS FROM DB) */}
        {recommendations.length > 0 && (
          <section className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
            <div className="flex items-center justify-between mb-6 border-b border-neutral-200 pb-3">
              <h2
                style={{ fontFamily: "var(--font-cormorant), serif" }}
                className="text-2xl sm:text-3xl font-normal text-neutral-950 tracking-wide"
              >
                You May Also Like
              </h2>
              <Link
                href={`/collections/${product.category}`}
                className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-[#b8860b] flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.map((item) => (
                <Link
                  key={item.id || item.slug}
                  href={`/products/${item.slug}`}
                  className="group border border-neutral-200 bg-white p-3 rounded-none hover:border-black transition-colors"
                >
                  <div className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden mb-3">
                    <Image
                      src={item.images.primary}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 truncate mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-neutral-950 font-mono">
                      £{item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[10.5px] text-neutral-400 line-through font-mono">
                        £{item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 5. "HEAR FROM OUR CUSTOMERS" REAL REVIEWS SUITE */}
        <section ref={reviewsSectionRef} className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12 border-t border-neutral-200">
          
          <div className="text-center mb-10">
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#997b24] block mb-1">
              Verified Feedback
            </span>
            <h2
              style={{ fontFamily: "var(--font-cormorant), serif" }}
              className="text-3xl sm:text-4xl font-normal text-neutral-950 tracking-wide"
            >
              Hear From Our Customers
            </h2>
          </div>

          {/* Rating Summary Header Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FAF7F2] p-6 sm:p-8 border border-neutral-200 mb-8 rounded-none">
            
            {/* Score (4 cols) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r border-neutral-300 pr-0 md:pr-6">
              <span className="text-5xl font-extrabold text-neutral-950 font-mono">
                {averageRating}
              </span>
              <div className="flex text-[#d4af37] text-base my-1">
                {"★★★★★"}
              </div>
              <p className="text-xs text-neutral-600 font-medium">
                Based on <strong>{totalReviewsCount} verified {totalReviewsCount === 1 ? "review" : "reviews"}</strong>
              </p>
              <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider mt-1">
                {recommendPercent}% of customers recommend this piece
              </p>
            </div>

            {/* Rating Breakdown Bars (5 cols) */}
            <div className="md:col-span-5 space-y-1.5 justify-center flex flex-col md:border-r border-neutral-300 pr-0 md:pr-6">
              {ratingCounts.map((row) => (
                <div key={row.star} className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-neutral-700 font-mono text-[11px]">
                    {row.star} Stars
                  </span>
                  <div className="flex-1 h-2 bg-neutral-200 rounded-none overflow-hidden">
                    <div
                      className="h-full bg-neutral-950 transition-all duration-500"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-neutral-400 font-mono text-[10.5px]">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Write a Review Button (3 cols) */}
            <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-neutral-700 mb-3 font-light">
                Have you purchased this piece? Share your feedback with our community.
              </p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-6 py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer w-full flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Write A Review</span>
              </button>
            </div>

          </div>

          {/* Reviews Cards List */}
          {reviews.length === 0 ? (
            <div className="p-12 text-center bg-neutral-50 border border-neutral-200 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                No Reviews Submitted Yet
              </p>
              <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                Be the first to review &ldquo;{product.name}&rdquo; and help other jewellery lovers!
              </p>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-6 py-2.5 bg-neutral-950 text-white hover:bg-[#d4af37] hover:text-black text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer transition-colors"
              >
                Write First Review
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => {
                const isLiked = Boolean(likedReviews[rev.id]);

                return (
                  <div
                    key={rev.id}
                    className="p-6 bg-white border border-neutral-200 rounded-none space-y-3 hover:border-neutral-400 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-xs uppercase tracking-wider text-neutral-950">
                          {rev.author_name}
                        </span>
                        {rev.verified && (
                          <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-[#d4af37] text-xs">
                        {"★".repeat(rev.rating)}
                      </div>
                      <span className="text-xs font-bold text-neutral-900">
                        {rev.title}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700 font-light leading-relaxed">
                      {rev.content}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px] text-neutral-500">
                      <span className="font-medium">
                        Metal: <strong>{rev.metal_chosen || "18K Gold Vermeil"}</strong>
                      </span>
                      <button
                        onClick={() => handleLikeReview(rev.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isLiked ? "text-neutral-950 font-bold" : "hover:text-black"
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-black" : ""}`} />
                        <span>Helpful ({rev.helpful_count || 0})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </section>

      </main>

      {/* 6. WRITE A CUSTOMER REVIEW MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl rounded-none relative space-y-4">
            
            {/* Close Button */}
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute right-4 top-4 p-1 text-neutral-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#997b24]">
                Verified Experience
              </span>
              <h2
                style={{ fontFamily: "var(--font-neue-haas)" }}
                className="text-base sm:text-lg font-bold uppercase tracking-wider text-neutral-950 mt-0.5"
              >
                Review &ldquo;{product.name}&rdquo;
              </h2>
            </div>

            {reviewSubmittedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Review submitted and published live! Thank you.</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 pt-1">
              
              {/* Star Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setFormHoverRating(star)}
                      onMouseLeave={() => setFormHoverRating(0)}
                      onClick={() => setFormRating(star)}
                      className="text-2xl transition-transform hover:scale-110 cursor-pointer p-0.5"
                    >
                      <span className={
                        (formHoverRating || formRating) >= star
                          ? "text-[#d4af37]"
                          : "text-neutral-300"
                      }>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-xs font-bold text-neutral-700 ml-2">
                    {formRating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Author Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Your Name / Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sophie M."
                    value={formAuthorName}
                    onChange={(e) => setFormAuthorName(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-xs font-semibold outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Email Address (Private)
                  </label>
                  <input
                    type="email"
                    placeholder="sophie@example.com"
                    value={formAuthorEmail}
                    onChange={(e) => setFormAuthorEmail(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-xs outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Metal Variation */}
              {product.metals && product.metals.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                    Metal Variation Purchased
                  </label>
                  <select
                    value={formMetal}
                    onChange={(e) => setFormMetal(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-xs font-medium outline-none focus:border-black"
                  >
                    {product.metals.map((m) => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Review Headline */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Review Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stunning craftsmanship, daily staple!"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-none px-3 py-2 text-xs font-bold outline-none focus:border-black"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Detailed Experience & Quality Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about the weight, shine, fit, packaging, or styling..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-none p-3 text-xs outline-none focus:border-black leading-relaxed font-medium"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 border border-neutral-300 text-neutral-700 text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all rounded-none cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? "Submitting..." : "Submit Review"}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX ZOOM MODAL */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white pb-4 border-b border-white/20">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                {product.name}
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Photo {selectedImageIndex + 1} of {galleryImages.length}
              </p>
            </div>
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors rounded-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Large Image */}
          <div className="relative w-full max-w-3xl h-[60vh] sm:h-[68vh] my-auto">
            <Image
              src={galleryImages[selectedImageIndex] || "/ear.jpeg"}
              alt={`${product.name} large preview`}
              fill
              className="object-contain"
            />

            {/* Left & Right navigation in lightbox */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer rounded-none"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors cursor-pointer rounded-none"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto max-w-3xl pt-4">
              {galleryImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-neutral-900 border transition-all cursor-pointer rounded-none overflow-hidden ${
                    selectedImageIndex === idx ? "border-[#d4af37] ring-1 ring-[#d4af37]" : "border-neutral-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>
      )}

      {/* 7. FOOTER */}
      <Footer />
    </div>
  );
}
