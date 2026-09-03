"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_PRODUCTS, Product } from "@/data/products";
import { supabase } from "@/lib/supabaseClient";
import { 
  SlidersHorizontal, 
  ChevronDown, 
  Plus, 
  Minus, 
  Star, 
  Heart, 
  Check, 
  X,
  ArrowUpDown
} from "lucide-react";

interface CollectionConfig {
  title: string;
  categoryKey: string;
  seoTitle: string;
  seoIntro: string;
  giftTitle: string;
  giftText: string;
  trendingTitle: string;
  trendingText: string;
  faqs: Array<{ question: string; answer: string }>;
}

const COLLECTIONS_DATA: Record<string, CollectionConfig> = {
  earrings: {
    title: "Earrings",
    categoryKey: "earrings",
    seoTitle: "Discover BHAI’s Gold and Silver Earrings",
    seoIntro:
      "Stack up BHAI's collection of gold and silver earrings, each piece made by hand from 100% certified recycled gold and silver. BHAI was started with a passion to offer high-quality, affordable, and fashion-forward jewellery.\n\nFrom iconic designs you won't find anywhere else to trending pieces, our earrings are perfect for mixing, matching, and layering. Express yourself with charm hoops, oversized studs, or classic huggies.",
    giftTitle: "When to Gift Earrings",
    giftText:
      "BHAI earrings make the perfect gift for any occasion, whether you're celebrating a birthday, anniversary, or want to surprise someone special. From timeless studs to bold statement hoops, there's a pair of earrings for every personality and style. Plus, did we mention they're beautifully packaged? Give them the gift of BHAI.",
    trendingTitle: "Trending Earring Styles",
    trendingText:
      "The earrings you're loving, incoming. Stay on trend with this season's staples: Statement hoops are a must-have, offering a bold look that complements any outfit. For those who love to layer, make ear cuffs and studs your go-to for the ultimate ear stack with a mix of textures and metals.\n\nPearl earrings are also making a comeback, giving a twist on a timeless classic. Explore our collection to find your perfect pair.",
    faqs: [
      {
        question: "What Materials Are BHAI Earrings Made From?",
        answer: "Our earrings are crafted from 100% certified recycled 18ct gold vermeil, 14ct solid gold, and 925 sterling silver, complemented by conflict-free diamonds and sustainably sourced freshwater pearls.",
      },
      {
        question: "Are BHAI Earrings Hypoallergenic?",
        answer: "Yes, all our jewellery is 100% nickel-free, lead-free, and hypoallergenic, making them safe and comfortable for sensitive skin and fresh piercings.",
      },
      {
        question: "How Should I Care For My BHAI Earrings?",
        answer: "To keep your earrings shining, avoid direct contact with perfumes, lotions, and chlorine. Gently wipe with a soft microfibre cloth after wearing and store in your BHAI jewellery pouch.",
      },
      {
        question: "Can I Mix And Match BHAI Earrings?",
        answer: "Absolutely! We love mixed-metal stacks. Pair gold huggies with silver studs and ear cuffs to create your own signature ear party.",
      },
      {
        question: "Do You Offer Earrings For Non-Pierced Ears?",
        answer: "Yes, we offer a dedicated range of adjustable slip-on Ear Cuffs that require zero piercings and stay comfortably secure all day.",
      },
      {
        question: "Are BHAI Earrings Available In Both Gold And Silver?",
        answer: "Most of our iconic styles are available in both 18ct Gold Vermeil and Recycled Sterling Silver finishes.",
      },
      {
        question: "Can I Return Or Exchange Earrings If They Don't Suit Me?",
        answer: "We offer hassle-free 60-day returns and exchanges on all unworn items returned in original protective packaging.",
      },
      {
        question: "Do BHAI Earrings Come With A Warranty?",
        answer: "Every piece of BHAI jewellery comes with our comprehensive 2-Year Quality Warranty covering manufacturing faults.",
      },
    ],
  },
  necklaces: {
    title: "Necklaces",
    categoryKey: "necklaces",
    seoTitle: "Discover BHAI’s Gold and Silver Necklaces",
    seoIntro:
      "Layer up BHAI's iconic collection of chains, pendant necklaces, and handcrafted T-Bars. Made from 100% certified recycled precious metals for timeless everyday styling.",
    giftTitle: "When to Gift Necklaces",
    giftText:
      "A necklace makes an unforgettable celebration gift. From personalised initial pendants to engraved Roman coins, find a piece they will treasure forever.",
    trendingTitle: "Trending Necklace Styles",
    trendingText:
      "Chunky curb chains, sculptural T-Bar toggles, and layered snake chains remain the defining silhouettes of the season.",
    faqs: [
      {
        question: "What Materials Are BHAI Necklaces Made From?",
        answer: "Crafted in heavy 18ct gold vermeil (5x thicker than standard plating) and 925 sterling silver.",
      },
      {
        question: "How Do I Choose The Right Chain Length?",
        answer: "Our necklaces feature extendable closure loops (usually 45cm with 5cm extension) allowing versatile layering at multiple lengths.",
      },
      {
        question: "Can I Layer Gold And Silver Chains Together?",
        answer: "Yes, mixed-metal layering is one of our signature aesthetics. Combine silver snake chains with gold coin pendants.",
      },
      {
        question: "Do BHAI Necklaces Come With A Warranty?",
        answer: "All necklaces include our 2-Year Quality Guarantee and complimentary gift box packaging.",
      },
    ],
  },
  bracelets: {
    title: "Bracelets & Bangles",
    categoryKey: "bracelets",
    seoTitle: "Discover BHAI’s Solid Gold & Silver Bracelets",
    seoIntro:
      "From architectural cuffs to delicate chain links, explore wristwear designed to be stacked, gifted, and worn every day.",
    giftTitle: "When to Gift Bracelets",
    giftText:
      "Bracelets are versatile and easy to fit, making them a foolproof luxury gift for birthdays, graduations, and anniversaries.",
    trendingTitle: "Trending Wristwear Styles",
    trendingText:
      "Twisted dome cuffs, chunky paperclip chains, and diamond tennis bangles lead the modern wrist stack.",
    faqs: [
      {
        question: "Are BHAI Cuffs Adjustable?",
        answer: "Our open cuffs can be gently squeezed or widened to achieve your perfect wrist fit.",
      },
      {
        question: "Are The Bracelets Waterproof?",
        answer: "While 18K vermeil is water-resistant, we recommend removing them before swimming or showering to preserve the radiant shine.",
      },
    ],
  },
  rings: {
    title: "Rings",
    categoryKey: "rings",
    seoTitle: "Discover BHAI’s Gold and Silver Stacking Rings",
    seoIntro:
      "Statement dome signets, pavé eternity bands, and claw solitaire rings designed for endless stacking combinations.",
    giftTitle: "When to Gift Rings",
    giftText:
      "Celebrate milestone moments or treat yourself to a solid gold ring that becomes an everyday heirloom.",
    trendingTitle: "Trending Ring Styles",
    trendingText:
      "Chunky twisted dome rings and mixed-metal stackable bands are the season's most-wanted staples.",
    faqs: [
      {
        question: "How Do I Find My Ring Size?",
        answer: "We offer standard UK ring sizes (J to R). Check our printable ring size guide or visit any BHAI boutique.",
      },
      {
        question: "Can BHAI Rings Be Resized?",
        answer: "Selected plain band rings can be resized. Contact our concierge team for custom sizing assistance.",
      },
    ],
  },
  "best-sellers": {
    title: "Best Sellers",
    categoryKey: "all",
    seoTitle: "Discover BHAI’s Most Coveted Jewellery Icons",
    seoIntro:
      "Explore the viral and timeless icons loved by over 500,000 customers across the globe. Handcrafted in solid recycled precious metals.",
    giftTitle: "Gifting Our Best Sellers",
    giftText:
      "When in doubt, choose a bestseller. These proven favorites are guaranteed to delight anyone on your gift list.",
    trendingTitle: "Iconic Designs",
    trendingText:
      "Our Roman Coin pendants, T-Bar huggies, and chunky twisted cuffs continue to top the wishlist season after season.",
    faqs: [
      {
        question: "Why Are These Pieces Best Sellers?",
        answer: "These styles combine everyday durability, timeless versatile silhouettes, and 5-star customer ratings.",
      },
    ],
  },
  gifts: {
    title: "Gifts",
    categoryKey: "all",
    seoTitle: "The BHAI Fine Jewellery Gift Collection",
    seoIntro:
      "Curated luxury jewellery sets, engraved keepsakes, and timeless gifts delivered in our signature gold-embossed keepsake boxes.",
    giftTitle: "Gift Packaging & Personalised Notes",
    giftText:
      "Every gift order includes complimentary luxury packaging and an optional handwritten gold foil gift card.",
    trendingTitle: "Top Gift Ideas",
    trendingText:
      "Matching necklace and earring sets, birthstone charms, and initial pendants make thoughtful, unforgettable presents.",
    faqs: [
      {
        question: "Can I Include A Personalised Gift Message?",
        answer: "Yes, you can write a complimentary custom gift note at checkout, which is printed on luxury gold-embossed cardstock.",
      },
    ],
  },
};

export default function CollectionPLP() {
  const params = useParams();
  const slug = (params?.slug as string) || "earrings";
  
  const config = COLLECTIONS_DATA[slug] || {
    title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
    categoryKey: slug,
    seoTitle: `Discover BHAI’s ${slug.replace(/-/g, " ")}`,
    seoIntro: "Handcrafted in certified recycled 18K gold vermeil and sterling silver.",
    giftTitle: `When to Gift ${slug}`,
    giftText: "Perfect for celebrating birthdays, anniversaries, and personal milestones.",
    trendingTitle: "Trending Styles",
    trendingText: "Explore our latest seasonal arrivals and timeless staples.",
    faqs: COLLECTIONS_DATA.earrings.faqs,
  };

  // State
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    Metal: true,
    Type: true,
    Style: false,
    Gemstone: false,
    "Hoops Size": false,
    Discount: false,
    Price: false,
  });

  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({});
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleAccordion = (name: string) => {
    setOpenAccordions((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [liveProducts, setLiveProducts] = useState<Product[]>(ALL_PRODUCTS);

  // Fetch live products for this collection from Supabase
  useEffect(() => {
    async function loadCollectionProducts() {
      try {
        let query = supabase.from("products").select("*").order("created_at", { ascending: false });

        if (config.categoryKey !== "all" && config.categoryKey !== "best-sellers" && config.categoryKey !== "gifts") {
          query = query.eq("category", config.categoryKey);
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          const mapped: Product[] = data.map((row) => ({
            id: row.id,
            slug: row.slug,
            name: row.name,
            category: row.category,
            price: Number(row.price),
            originalPrice: row.original_price ? Number(row.original_price) : undefined,
            badge: row.badge || undefined,
            images: {
              primary: row.primary_image,
              hover: row.hover_image || undefined,
            },
            metals: row.metals || [
              { name: "18K Gold Vermeil", type: "gold", colorHex: "#E5C158" },
              { name: "Recycled Sterling Silver", type: "silver", colorHex: "#D1D5DB" }
            ],
            inStock: Boolean(row.in_stock),
          }));
          setLiveProducts(mapped);
        } else if (!error && data && data.length === 0) {
          setLiveProducts([]);
        }
      } catch (err) {
        console.error("Supabase collection fetch error:", err);
      }
    }

    loadCollectionProducts();
  }, [config.categoryKey]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let list = liveProducts;

    if (config.categoryKey !== "all" && config.categoryKey !== "best-sellers" && config.categoryKey !== "gifts") {
      list = list.filter((p) => p.category.toLowerCase() === config.categoryKey.toLowerCase());
    }

    if (selectedMetal) {
      list = list.filter((p) => p.metals.some((m) => m.type.toLowerCase().includes(selectedMetal.toLowerCase())));
    }

    if (selectedBadge) {
      list = list.filter((p) => p.badge?.toLowerCase() === selectedBadge.toLowerCase());
    }

    return [...list].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [liveProducts, config.categoryKey, selectedMetal, selectedBadge, sortBy]);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between selection:bg-[#d4af37]/25">
      {/* 1. SOLID WHITE LUXURY HEADER */}
      <Navbar />

      {/* 2. MAIN PLP CONTENT */}
      <main className="flex-1 pt-32 sm:pt-36 lg:pt-44 pb-24">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-14">

          {/* TOP CONTROLS BAR (Matching Missoma Screenshot 1) */}
          <div className="flex items-center justify-between py-3 border-b border-neutral-200 mb-6 text-xs sm:text-[13px] font-medium text-neutral-900">
            {/* Left: Hide Filters Button + Items Count */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 hover:opacity-75 transition-opacity cursor-pointer font-semibold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
              </button>
              <span className="text-neutral-500 font-normal">
                {filteredProducts.length} items
              </span>
            </div>

            {/* Right: Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="flex items-center gap-1.5 cursor-pointer font-semibold">
                <span>Sort</span>
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs sm:text-[13px] font-medium text-neutral-900 outline-none cursor-pointer pr-2"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* ACTIVE FILTER TAGS (If any) */}
          {(selectedMetal || selectedBadge) && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
              <span className="text-neutral-400 font-medium">Applied:</span>
              {selectedMetal && (
                <button
                  onClick={() => setSelectedMetal(null)}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center gap-1.5 transition-colors"
                >
                  <span className="capitalize">{selectedMetal}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedBadge && (
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center gap-1.5 transition-colors"
                >
                  <span>{selectedBadge}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedMetal(null);
                  setSelectedBadge(null);
                }}
                className="text-neutral-500 hover:text-black underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* CATALOG BODY: SIDEBAR + PRODUCT GRID */}
          <div className="grid grid-cols-12 gap-8 items-start">

            {/* LEFT ACCORDION FILTERS SIDEBAR (Matching Screenshot 1) */}
            {showFilters && (
              <aside className="col-span-12 lg:col-span-3 xl:col-span-2 space-y-1 divide-y divide-neutral-200/80 pr-2">
                
                {/* 1. Metal Filter Accordion */}
                <div className="pt-3 pb-3">
                  <button
                    onClick={() => toggleAccordion("Metal")}
                    className="w-full flex items-center justify-between text-left text-[13.5px] font-bold tracking-wide text-neutral-950 py-1"
                  >
                    <span>Metal</span>
                    {openAccordions["Metal"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordions["Metal"] && (
                    <div className="mt-3 space-y-2 text-xs text-neutral-700 pl-0.5">
                      {["18ct Gold Plated", "Silver Plated", "Solid Gold", "Mixed Metals"].map((metal) => {
                        const metalVal = metal.toLowerCase().includes("gold") ? "gold" : metal.toLowerCase().includes("silver") ? "silver" : "mixed";
                        const isChecked = selectedMetal === metalVal;

                        return (
                          <label key={metal} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => setSelectedMetal(isChecked ? null : metalVal)}
                              className="w-3.5 h-3.5 accent-black rounded-none cursor-pointer"
                            />
                            <span>{metal}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Type Filter Accordion */}
                <div className="pt-3 pb-3">
                  <button
                    onClick={() => toggleAccordion("Type")}
                    className="w-full flex items-center justify-between text-left text-[13.5px] font-bold tracking-wide text-neutral-950 py-1"
                  >
                    <span>Type</span>
                    {openAccordions["Type"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordions["Type"] && (
                    <div className="mt-3 space-y-2 text-xs text-neutral-700 pl-0.5">
                      {["Hoops", "Huggies", "Studs", "Drop & Dangle", "Ear Cuffs"].map((t) => (
                        <label key={t} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                          <input type="checkbox" className="w-3.5 h-3.5 accent-black rounded-none cursor-pointer" />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Style Filter Accordion */}
                <div className="pt-3 pb-3">
                  <button
                    onClick={() => toggleAccordion("Style")}
                    className="w-full flex items-center justify-between text-left text-[13.5px] font-bold tracking-wide text-neutral-950 py-1"
                  >
                    <span>Style</span>
                    {openAccordions["Style"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordions["Style"] && (
                    <div className="mt-3 space-y-2 text-xs text-neutral-700 pl-0.5">
                      {["Chunky", "Statement", "Everyday Staple", "Pavé", "Minimal"].map((s) => (
                        <label key={s} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                          <input 
                            type="checkbox" 
                            checked={selectedBadge === s}
                            onChange={() => setSelectedBadge(selectedBadge === s ? null : s)}
                            className="w-3.5 h-3.5 accent-black rounded-none cursor-pointer" 
                          />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Gemstone Filter Accordion */}
                <div className="pt-3 pb-3">
                  <button
                    onClick={() => toggleAccordion("Gemstone")}
                    className="w-full flex items-center justify-between text-left text-[13.5px] font-bold tracking-wide text-neutral-950 py-1"
                  >
                    <span>Gemstone</span>
                    {openAccordions["Gemstone"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordions["Gemstone"] && (
                    <div className="mt-3 space-y-2 text-xs text-neutral-700 pl-0.5">
                      {["Freshwater Pearl", "Cubic Zirconia", "Lapis", "Malachite", "Black Onyx"].map((g) => (
                        <label key={g} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                          <input type="checkbox" className="w-3.5 h-3.5 accent-black rounded-none cursor-pointer" />
                          <span>{g}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 5. Hoops Size Filter */}
                <div className="pt-3 pb-3">
                  <button
                    onClick={() => toggleAccordion("Hoops Size")}
                    className="w-full flex items-center justify-between text-left text-[13.5px] font-bold tracking-wide text-neutral-950 py-1"
                  >
                    <span>Hoops Size</span>
                    {openAccordions["Hoops Size"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordions["Hoops Size"] && (
                    <div className="mt-3 space-y-2 text-xs text-neutral-700 pl-0.5">
                      {["Mini (under 12mm)", "Small (12-18mm)", "Medium (19-28mm)", "Large (over 28mm)"].map((sz) => (
                        <label key={sz} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                          <input type="checkbox" className="w-3.5 h-3.5 accent-black rounded-none cursor-pointer" />
                          <span>{sz}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. Discount Filter */}
                <div className="pt-3 pb-3">
                  <button
                    onClick={() => toggleAccordion("Discount")}
                    className="w-full flex items-center justify-between text-left text-[13.5px] font-bold tracking-wide text-neutral-950 py-1"
                  >
                    <span>Discount</span>
                    {openAccordions["Discount"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordions["Discount"] && (
                    <div className="mt-3 space-y-2 text-xs text-neutral-700 pl-0.5">
                      {["Regular Price", "Special Offers"].map((d) => (
                        <label key={d} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                          <input type="checkbox" className="w-3.5 h-3.5 accent-black rounded-none cursor-pointer" />
                          <span>{d}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* 7. Price Filter */}
                <div className="pt-3 pb-3">
                  <button
                    onClick={() => toggleAccordion("Price")}
                    className="w-full flex items-center justify-between text-left text-[13.5px] font-bold tracking-wide text-neutral-950 py-1"
                  >
                    <span>Price</span>
                    {openAccordions["Price"] ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                  {openAccordions["Price"] && (
                    <div className="mt-3 space-y-2 text-xs text-neutral-700 pl-0.5">
                      {["Under £80", "£80 - £120", "£120 - £180", "Over £180"].map((pr) => (
                        <label key={pr} className="flex items-center gap-2.5 cursor-pointer hover:text-black">
                          <input type="checkbox" className="w-3.5 h-3.5 accent-black rounded-none cursor-pointer" />
                          <span>{pr}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

              </aside>
            )}

            {/* RIGHT PRODUCT GRID (Matching Missoma Screenshot 1) */}
            <section className={showFilters ? "col-span-12 lg:col-span-9 xl:col-span-10" : "col-span-12"}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                {filteredProducts.map((product) => {
                  const isWishlisted = Boolean(wishlist[product.id]);

                  return (
                    <div key={product.id} className="group flex flex-col relative">
                      {/* Product Image Stage */}
                      <div className="relative w-full aspect-square bg-[#FAF9F7] mb-3 overflow-hidden">
                        {/* Primary Image */}
                        <Image
                          src={product.images.primary}
                          alt={product.name}
                          fill
                          className={`object-cover object-center transition-opacity duration-500 ${
                            product.images.hover ? "group-hover:opacity-0" : ""
                          }`}
                        />
                        {/* Hover Image */}
                        {product.images.hover && (
                          <Image
                            src={product.images.hover}
                            alt={`${product.name} on model`}
                            fill
                            className="object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          />
                        )}

                        {/* Top-Left Badge (e.g. Best Seller, New In) */}
                        {product.badge && (
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <span className="text-[10px] sm:text-[11px] font-normal text-neutral-800 bg-white/95 px-2.5 py-0.5 shadow-xs">
                              {product.badge}
                            </span>
                          </div>
                        )}

                        {/* Top-Right Wishlist Heart */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-2.5 right-2.5 z-10 p-1.5 text-neutral-600 hover:text-black transition-colors"
                          aria-label="Add to wishlist"
                        >
                          <Heart
                            className={`w-4 h-4 ${isWishlisted ? "fill-red-600 stroke-red-600" : "stroke-[1.6]"}`}
                          />
                        </button>
                      </div>

                      {/* 5-Star Rating (Matching Screenshot 1) */}
                      <div className="flex items-center gap-0.5 text-neutral-900 mb-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-black stroke-black" />
                        ))}
                      </div>

                      {/* Product Title */}
                      <h3 className="text-xs sm:text-[13px] font-bold text-neutral-950 leading-snug hover:underline underline-offset-2">
                        <Link href={`/products/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h3>

                      {/* Metal Description Line (e.g., "18ct Gold Plated, Silver Plated") */}
                      <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
                        {product.metals.map((m) => m.name).join(", ")}
                      </p>

                      {/* Price (e.g., "£98.00") */}
                      <p className="text-xs sm:text-[13px] font-semibold text-neutral-900 mt-1">
                        £{product.price.toFixed(2)}
                      </p>

                      {/* Dual-Tone / Solid Metal Swatch Circles (Matching Screenshot 1) */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {product.metals.map((m, idx) => (
                          <span
                            key={idx}
                            title={m.name}
                            className="w-3.5 h-3.5 rounded-full border border-neutral-300 relative overflow-hidden flex-shrink-0"
                            style={{
                              backgroundColor: m.colorHex,
                              backgroundImage: m.secondaryColorHex
                                ? `linear-gradient(90deg, ${m.colorHex} 50%, ${m.secondaryColorHex} 50%)`
                                : undefined,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* 3. SEO & EDITORIAL STORY SECTION (Matching Missoma Screenshot 2) */}
          <section className="max-w-3xl mx-auto mt-28 sm:mt-36 text-center space-y-12">
            
            {/* Header / Intro */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 mb-4 tracking-tight">
                {config.seoTitle}
              </h2>
              <div className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed font-light space-y-3">
                <p>{config.seoIntro}</p>
              </div>
            </div>

            {/* When to Gift Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 mb-3 tracking-tight">
                {config.giftTitle}
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed font-light">
                {config.giftText}
              </p>
            </div>

            {/* Trending Styles Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-950 mb-3 tracking-tight">
                {config.trendingTitle}
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-700 leading-relaxed font-light">
                {config.trendingText}
              </p>
            </div>

          </section>

          {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION (Matching Missoma Screenshot 2) */}
          <section className="max-w-3xl mx-auto mt-20 sm:mt-24 pt-12 border-t border-neutral-200">
            <div className="text-center mb-8">
              <span className="text-[10.5px] font-extrabold tracking-[0.2em] uppercase text-neutral-400 block mb-1.5">
                {config.title.toUpperCase()}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {config.faqs.map((faq, index) => {
                const isOpen = Boolean(openFaqs[index]);

                return (
                  <div key={index} className="py-4">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left group cursor-pointer"
                    >
                      <span className="text-xs sm:text-[13.5px] font-bold text-neutral-950 group-hover:underline underline-offset-2">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-600 transition-transform duration-200 flex-shrink-0 ml-4 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="text-xs sm:text-[13px] text-neutral-600 mt-2.5 leading-relaxed pr-8 animate-in fade-in duration-150">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      {/* 5. GLOBAL LUXURY FOOTER */}
      <Footer />
    </div>
  );
}
