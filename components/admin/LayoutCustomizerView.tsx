"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Layout, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Link as LinkIcon, 
  Type, 
  Image as ImageIcon 
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { uploadProductImage } from "@/lib/storageHelper";

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface NavbarLayoutConfig {
  logoType: "text" | "image";
  logoText: string;
  logoImageUrl: string;
  navFont: "cinzel" | "cormorant" | "playfair" | "inter";
  navItems: NavLinkItem[];
}

export interface SiteBannerConfig {
  topBannerText: string;
  topBannerEnabled: boolean;
  secondaryBannerText: string;
  secondaryBannerBg: string;
  secondaryBannerEnabled: boolean;
}

export interface SocialLinksConfig {
  instagram: string;
  facebook: string;
  tiktok: string;
  pinterest: string;
  youtube: string;
}

export interface HeroBannerConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  imageSrc: string;
}

export const DEFAULT_HERO_CONFIG: HeroBannerConfig = {
  title: "The Gold Chain & Link Edition",
  subtitle: "Heavyweight curb links and delicate chains crafted for bold layering.",
  ctaText: "Shop Gold Chains",
  ctaHref: "/collections/necklaces",
  imageSrc: "/hero_section.jpg",
};

export const PRESET_HERO_IMAGES = [
  { label: "Signature Gold Chain & Layering", src: "/hero_section.jpg" },
  { label: "T-Bar & Luxury Pendants", src: "/necklace.jpeg" },
  { label: "High-Fashion Ear Stacks & Cuffs", src: "/shop_img.jpeg" },
  { label: "Hoops & Diamond Studs", src: "/ear.jpeg" },
  { label: "Handcrafted Luxury Bangles", src: "/braclet.jpeg" },
  { label: "Royal Gemstone & Ruby Red", src: "/red.jpeg" },
  { label: "Moissanite & Diamond Rings", src: "/ring.jpeg" },
];

export const DEFAULT_NAVBAR_CONFIG: NavbarLayoutConfig = {
  logoType: "text",
  logoText: "BHAI",
  logoImageUrl: "",
  navFont: "cinzel",
  navItems: [
    { id: "1", label: "EARRINGS", href: "/collections/earrings", hasDropdown: true },
    { id: "2", label: "NECKLACES", href: "/collections/necklaces", hasDropdown: true },
    { id: "3", label: "BRACELETS", href: "/collections/bracelets", hasDropdown: true },
    { id: "4", label: "RINGS", href: "/collections/rings", hasDropdown: true },
    { id: "5", label: "BEST SELLERS", href: "/collections/best-sellers", hasDropdown: true },
    { id: "6", label: "GIFTS", href: "/collections/gifts", hasDropdown: true },
    { id: "7", label: "SHOP BY", href: "/collections/shop-by", hasDropdown: true },
  ],
};

export const DEFAULT_BANNER_CONFIG: SiteBannerConfig = {
  topBannerText: "SIGN UP FOR 10% OFF YOUR FIRST ORDER",
  topBannerEnabled: true,
  secondaryBannerText: "FREE UK DELIVERY ON ORDERS OVER £100",
  secondaryBannerBg: "#3D1E08",
  secondaryBannerEnabled: true,
};

export const DEFAULT_SOCIAL_LINKS: SocialLinksConfig = {
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  tiktok: "https://tiktok.com",
  pinterest: "https://pinterest.com",
  youtube: "https://youtube.com",
};

const FONT_OPTIONS = [
  { id: "cinzel", name: "Cinzel", family: "var(--font-cinzel), serif", description: "Royal Roman Luxury Serif (Default)" },
  { id: "cormorant", name: "Cormorant Garamond", family: "var(--font-cormorant), serif", description: "High-Fashion Editorial Aesthetic" },
  { id: "playfair", name: "Playfair Display", family: "var(--font-playfair), serif", description: "Classic British Elegance" },
  { id: "inter", name: "Inter Sans", family: "var(--font-inter), sans-serif", description: "Clean Modern Minimalist" },
];

export default function LayoutCustomizerView() {
  const [navbar, setNavbar] = useState<NavbarLayoutConfig>(DEFAULT_NAVBAR_CONFIG);
  const [hero, setHero] = useState<HeroBannerConfig>(DEFAULT_HERO_CONFIG);
  const [config, setConfig] = useState<SiteBannerConfig>(DEFAULT_BANNER_CONFIG);
  const [socials, setSocials] = useState<SocialLinksConfig>(DEFAULT_SOCIAL_LINKS);
  
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  // New Link Input State
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkHref, setNewLinkHref] = useState("");

  // Load existing config on mount
  useEffect(() => {
    try {
      const localNav = localStorage.getItem("bhai_navbar_config_v1");
      if (localNav) setNavbar(JSON.parse(localNav));

      const localHero = localStorage.getItem("bhai_hero_banner_v1");
      if (localHero) setHero(JSON.parse(localHero));

      const localBanners = localStorage.getItem("bhai_site_banners_v1");
      if (localBanners) setConfig(JSON.parse(localBanners));

      const localSocials = localStorage.getItem("bhai_social_links_v1");
      if (localSocials) setSocials(JSON.parse(localSocials));
    } catch (e) {
      console.error(e);
    }

    // Fetch from Supabase
    async function fetchFromSupabase() {
      try {
        const { data: nData } = await supabase.from("site_settings").select("*").eq("key", "navbar_config").single();
        if (nData && nData.value) setNavbar(nData.value);

        const { data: hData } = await supabase.from("site_settings").select("*").eq("key", "hero_banner").single();
        if (hData && hData.value) setHero(hData.value);

        const { data: bData } = await supabase.from("site_settings").select("*").eq("key", "header_banners").single();
        if (bData && bData.value) setConfig(bData.value);

        const { data: sData } = await supabase.from("site_settings").select("*").eq("key", "social_links").single();
        if (sData && sData.value) setSocials(sData.value);
      } catch (e) {
        // Fallback to local
      }
    }
    fetchFromSupabase();
  }, []);

  // Handle Hero Image Upload
  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHero(true);
    try {
      const uploadedUrl = await uploadProductImage(file, "hero");
      setHero((prev) => ({
        ...prev,
        imageSrc: uploadedUrl,
      }));
    } catch (err) {
      console.warn("Hero upload notice:", err);
    } finally {
      setIsUploadingHero(false);
    }
  };

  // Handle Logo Upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const uploadedUrl = await uploadProductImage(file, "branding");
      setNavbar((prev) => ({
        ...prev,
        logoImageUrl: uploadedUrl,
        logoType: "image",
      }));
    } catch (err) {
      console.warn("Logo upload notice:", err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  // Nav Item Management Helpers
  const handleAddNavLink = () => {
    if (!newLinkLabel.trim() || !newLinkHref.trim()) return;
    const newItem: NavLinkItem = {
      id: `nav-${Date.now()}`,
      label: newLinkLabel.trim().toUpperCase(),
      href: newLinkHref.trim(),
      hasDropdown: false,
    };
    setNavbar((prev) => ({
      ...prev,
      navItems: [...prev.navItems, newItem],
    }));
    setNewLinkLabel("");
    setNewLinkHref("");
  };

  const handleUpdateNavLink = (id: string, field: "label" | "href", val: string) => {
    setNavbar((prev) => ({
      ...prev,
      navItems: prev.navItems.map((item) =>
        item.id === id ? { ...item, [field]: field === "label" ? val.toUpperCase() : val } : item
      ),
    }));
  };

  const handleDeleteNavLink = (id: string) => {
    if (navbar.navItems.length <= 1) {
      alert("At least one navigation link is required.");
      return;
    }
    setNavbar((prev) => ({
      ...prev,
      navItems: prev.navItems.filter((item) => item.id !== id),
    }));
  };

  const handleMoveNavLink = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= navbar.navItems.length) return;
    const updated = [...navbar.navItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setNavbar((prev) => ({ ...prev, navItems: updated }));
  };

  // Save all settings & Broadcast in real-time
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      // 1. Local Storage persistence
      localStorage.setItem("bhai_navbar_config_v1", JSON.stringify(navbar));
      localStorage.setItem("bhai_hero_banner_v1", JSON.stringify(hero));
      localStorage.setItem("bhai_site_banners_v1", JSON.stringify(config));
      localStorage.setItem("bhai_social_links_v1", JSON.stringify(socials));

      // 2. BroadcastChannel instant zero-latency cross-tab update
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("bhai_realtime_layout");
        channel.postMessage({ 
          type: "LAYOUT_UPDATED", 
          navbar, 
          hero,
          payload: config, 
          socials 
        });
      }

      // 3. Storage event
      window.dispatchEvent(new Event("storage"));

      // 4. Supabase sync
      try {
        await supabase.from("site_settings").upsert([
          {
            key: "navbar_config",
            value: navbar,
            updated_at: new Date().toISOString(),
          },
          {
            key: "hero_banner",
            value: hero,
            updated_at: new Date().toISOString(),
          },
          {
            key: "header_banners",
            value: config,
            updated_at: new Date().toISOString(),
          },
          {
            key: "social_links",
            value: socials,
            updated_at: new Date().toISOString(),
          }
        ]);
      } catch (dbErr) {
        console.log("Supabase settings sync:", dbErr);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const PRESET_COLORS = [
    { label: "Luxury Espresso", hex: "#3D1E08" },
    { label: "Obsidian Black", hex: "#000000" },
    { label: "Imperial Gold", hex: "#8A6D1E" },
    { label: "Deep Crimson", hex: "#4A0E17" },
    { label: "Charcoal Slate", hex: "#1C1917" },
  ];

  const currentFontFamily = FONT_OPTIONS.find((f) => f.id === navbar.navFont)?.family || "var(--font-cinzel), serif";

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl pb-20">
      
      {/* Top Header */}
      <div className="bg-white p-5 border border-neutral-200 rounded-none flex items-center justify-between shadow-2xs">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950">
            Storefront Header, Navbar & Branding Customizer
          </h2>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Customize Brand Logo, Navbar Font, Nav Links, Banners, and Social Channels live
          </p>
        </div>
        <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3 py-1 border border-emerald-300 text-[10.5px] font-bold uppercase tracking-wider rounded-none">
          <span className="w-2 h-2 bg-emerald-600 animate-pulse" />
          <span>Real-Time Sync Active</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-none flex items-center gap-3 text-xs font-bold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>Navbar, Logo & Banners updated in real-time! Live storefront is now showing your customized design.</span>
        </div>
      )}

      {/* Live Interactive Preview Screen */}
      <div className="bg-white p-6 border border-neutral-200 rounded-none space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-950 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Live Interactive Preview</span>
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">Storefront Header Preview</span>
        </div>

        <div className="border border-neutral-300 overflow-hidden shadow-xs bg-white">
          
          {/* Top Banner Preview */}
          {config.topBannerEnabled && (
            <div className="bg-white text-neutral-950 border-b border-neutral-200 text-center py-2 px-4 text-xs font-bold tracking-[0.18em] uppercase">
              {config.topBannerText || "SIGN UP FOR 10% OFF YOUR FIRST ORDER"}
            </div>
          )}

          {/* Secondary Banner Preview */}
          {config.secondaryBannerEnabled && (
            <div
              style={{ backgroundColor: config.secondaryBannerBg }}
              className="text-white text-center py-2 px-4 text-xs font-extrabold tracking-[0.16em] uppercase"
            >
              {config.secondaryBannerText || "FREE UK DELIVERY ON ORDERS OVER £100"}
            </div>
          )}

          {/* Main Navbar Bar Preview */}
          <div className="bg-white text-neutral-900 px-6 py-4 flex items-center justify-between border-b border-neutral-200">
            {/* Logo Preview */}
            <div className="flex items-center">
              {navbar.logoType === "image" && navbar.logoImageUrl ? (
                <div className="relative h-8 w-28">
                  <Image 
                    src={navbar.logoImageUrl} 
                    alt="Logo preview" 
                    fill 
                    className="object-contain object-left" 
                  />
                </div>
              ) : (
                <span
                  style={{ fontFamily: currentFontFamily }}
                  className="text-2xl font-bold tracking-[0.2em] text-neutral-950 uppercase"
                >
                  {navbar.logoText || "BHAI"}
                </span>
              )}
            </div>

            {/* Nav Links Preview */}
            <div 
              style={{ fontFamily: currentFontFamily }}
              className="hidden md:flex items-center gap-4 text-xs font-bold tracking-[0.16em] uppercase text-neutral-800"
            >
              {navbar.navItems.slice(0, 5).map((item) => (
                <span key={item.id} className="hover:text-black cursor-pointer">
                  {item.label}
                </span>
              ))}
              {navbar.navItems.length > 5 && (
                <span className="text-neutral-400 text-[11px] font-sans">
                  +{navbar.navItems.length - 5} more
                </span>
              )}
            </div>

            {/* Dummy Right Utilities */}
            <div className="flex items-center gap-3 text-neutral-400 text-xs font-mono">
              <span>SEARCH</span>
              <span>•</span>
              <span>BAG (0)</span>
            </div>
          </div>

          {/* Hero Section Live Preview */}
          <div className="relative w-full h-56 sm:h-72 bg-[#0a0a0a] overflow-hidden flex items-end">
            <div className="absolute inset-0">
              <Image
                src={hero.imageSrc || "/hero_section.jpg"}
                alt={hero.title || "Hero Preview"}
                fill
                className="object-cover object-[center_25%] sm:object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            <div className="relative z-10 p-5 sm:p-7 max-w-lg text-left">
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest block mb-1">
                Active Hero Display
              </span>
              <h4 
                style={{ fontFamily: "var(--font-cormorant), var(--font-playfair), serif" }}
                className="text-lg sm:text-2xl font-medium text-white tracking-wide leading-tight drop-shadow"
              >
                {hero.title || "The Gold Chain & Link Edition"}
              </h4>
              <p className="mt-1 text-[11px] sm:text-xs text-neutral-200 line-clamp-2">
                {hero.subtitle || "Heavyweight curb links and delicate chains crafted for bold layering."}
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white border-b border-white pb-0.5">
                  <span>{hero.ctaText || "Shop Gold Chains"}</span>
                  <span className="text-[#d4af37]">→</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CUSTOMIZER FORM */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-8">
        
        {/* SECTION 1: Brand Logo & Typography */}
        <div className="space-y-5 pb-6 border-b border-neutral-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>1. Brand Logo &amp; Navbar Font</span>
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Customize the logo format and choose the luxury font family for your Navbar
            </p>
          </div>

          {/* Logo Mode Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* Logo Format Choice */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                Logo Style Format
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNavbar({ ...navbar, logoType: "text" })}
                  className={`flex-1 py-2.5 px-3 text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all cursor-pointer rounded-none ${
                    navbar.logoType === "text"
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Text Logo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNavbar({ ...navbar, logoType: "image" })}
                  className={`flex-1 py-2.5 px-3 text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all cursor-pointer rounded-none ${
                    navbar.logoType === "image"
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Image / Vector Logo</span>
                </button>
              </div>

              {/* Text Logo Input */}
              {navbar.logoType === "text" ? (
                <div>
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Brand Logo Text (e.g. BHAI, BHAI JEWELLERS)
                  </label>
                  <input
                    type="text"
                    required
                    value={navbar.logoText}
                    onChange={(e) => setNavbar({ ...navbar, logoText: e.target.value })}
                    placeholder="BHAI"
                    className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 font-bold uppercase tracking-widest outline-none focus:border-black rounded-none"
                  />
                </div>
              ) : (
                /* Image Logo Uploader */
                <div className="space-y-2">
                  <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-600">
                    Upload Logo (PNG, SVG, Transparent)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 bg-white border border-neutral-300 hover:border-black text-xs font-bold uppercase tracking-wider text-neutral-800 cursor-pointer flex items-center gap-2 rounded-none">
                      <Upload className="w-3.5 h-3.5 text-neutral-600" />
                      <span>{isUploadingLogo ? "Uploading..." : "Choose File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {navbar.logoImageUrl && (
                      <span className="text-[11px] text-emerald-700 font-mono font-bold truncate max-w-[180px]">
                        ✓ Logo Uploaded
                      </span>
                    )}
                  </div>
                  <input
                    type="url"
                    value={navbar.logoImageUrl}
                    onChange={(e) => setNavbar({ ...navbar, logoImageUrl: e.target.value })}
                    placeholder="Or paste direct logo URL (https://...)"
                    className="w-full bg-white border border-neutral-300 px-3 py-1.5 text-xs text-neutral-900 font-mono outline-none focus:border-black rounded-none"
                  />
                </div>
              )}
            </div>

            {/* Navbar Font Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                Navbar Typography Font Family
              </label>
              <div className="grid grid-cols-1 gap-2">
                {FONT_OPTIONS.map((font) => {
                  const isSelected = navbar.navFont === font.id;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setNavbar({ ...navbar, navFont: font.id as any })}
                      className={`p-2.5 text-left border transition-all cursor-pointer rounded-none flex items-center justify-between ${
                        isSelected
                          ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                          : "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <div>
                        <p style={{ fontFamily: font.family }} className="text-sm font-bold tracking-wider">
                          {font.name}
                        </p>
                        <p className={`text-[10px] ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                          {font.description}
                        </p>
                      </div>
                      {isSelected && <span className="text-xs text-[#d4af37] font-bold">✓ Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: Navbar Navigation Links Manager */}
        <div className="space-y-5 pb-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>2. Navbar Navigation Menu Links</span>
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Add, edit, reorder, or delete navigation links shown across the Navbar header
              </p>
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              {navbar.navItems.length} Link(s) Active
            </span>
          </div>

          {/* Current Links List */}
          <div className="space-y-2.5">
            {navbar.navItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2.5 bg-[#FAF8F5] border border-neutral-300/80 rounded-none shadow-2xs"
              >
                {/* Index Pill */}
                <span className="w-6 h-6 flex items-center justify-center bg-white border border-neutral-300 text-xs font-mono font-bold text-neutral-700 flex-shrink-0">
                  {idx + 1}
                </span>

                {/* Label Input */}
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleUpdateNavLink(item.id, "label", e.target.value)}
                  placeholder="LINK LABEL"
                  className="w-40 sm:w-48 bg-white border border-neutral-300 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-900 outline-none focus:border-black rounded-none"
                />

                {/* URL Path Input */}
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => handleUpdateNavLink(item.id, "href", e.target.value)}
                  placeholder="/collections/..."
                  className="flex-1 min-w-0 bg-white border border-neutral-300 px-3 py-1.5 text-xs font-mono text-neutral-900 outline-none focus:border-black rounded-none"
                />

                {/* Move Buttons */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveNavLink(idx, "up")}
                    disabled={idx === 0}
                    title="Move Up"
                    className="p-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveNavLink(idx, "down")}
                    disabled={idx === navbar.navItems.length - 1}
                    title="Move Down"
                    className="p-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteNavLink(item.id)}
                  title="Remove Link"
                  className="p-1.5 bg-white border border-red-300 text-red-600 hover:bg-red-50 cursor-pointer flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Link Box */}
          <div className="bg-neutral-50 p-4 border border-dashed border-neutral-300 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newLinkLabel}
              onChange={(e) => setNewLinkLabel(e.target.value)}
              placeholder="NEW LINK LABEL (e.g. DIAMONDS)"
              className="w-full sm:w-48 bg-white border border-neutral-300 px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-900 outline-none focus:border-black rounded-none"
            />
            <input
              type="text"
              value={newLinkHref}
              onChange={(e) => setNewLinkHref(e.target.value)}
              placeholder="/collections/diamonds"
              className="w-full sm:flex-1 bg-white border border-neutral-300 px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-black rounded-none"
            />
            <button
              type="button"
              onClick={handleAddNavLink}
              className="w-full sm:w-auto px-5 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-none"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>
        </div>

        {/* SECTION 3: Hero Section & Hero Image Customizer */}
        <div className="space-y-6 pb-6 border-b border-neutral-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>3. Homepage Hero Banner &amp; Image</span>
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Upload custom high-resolution hero background, choose from curated luxury presets, and edit headline text
            </p>
          </div>

          {/* Preset Images Grid */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800">
              Select Curated Luxury Visual Preset:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_HERO_IMAGES.map((preset) => {
                const isSelected = hero.imageSrc === preset.src;
                return (
                  <button
                    key={preset.src}
                    type="button"
                    onClick={() => setHero({ ...hero, imageSrc: preset.src })}
                    className={`relative aspect-[16/10] overflow-hidden border transition-all text-left group cursor-pointer ${
                      isSelected
                        ? "border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-md"
                        : "border-neutral-300 hover:border-neutral-500 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={preset.src}
                      alt={preset.label}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-2">
                      <span className="text-[10px] font-bold text-white leading-tight drop-shadow">
                        {preset.label}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-mono text-[#d4af37] font-bold mt-0.5">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Image Upload or Direct URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                Upload Custom Image from Device
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-neutral-600" />
                  <span>{isUploadingHero ? "Uploading to Cloud..." : "Choose Image File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isUploadingHero}
                    onChange={handleHeroUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[10px] text-neutral-500">
                Supports JPG, PNG, WEBP. Uploads directly to Supabase cloud storage.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                Or Direct Image URL / Path
              </label>
              <input
                type="text"
                value={hero.imageSrc}
                onChange={(e) => setHero({ ...hero, imageSrc: e.target.value })}
                placeholder="/hero_section.jpg or https://..."
                className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 font-mono outline-none focus:border-black rounded-none"
              />
            </div>
          </div>

          {/* Hero Headlines & CTA Button Inputs */}
          <div className="space-y-4 pt-2 border-t border-neutral-100">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                Hero Headline Title
              </label>
              <input
                type="text"
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                placeholder="The Gold Chain & Link Edition"
                className="w-full bg-white border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 font-bold tracking-wide outline-none focus:border-black rounded-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                Hero Subtitle / Tagline
              </label>
              <textarea
                rows={2}
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                placeholder="Heavyweight curb links and delicate chains crafted for bold layering."
                className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-black rounded-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={hero.ctaText}
                  onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                  placeholder="Shop Gold Chains"
                  className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 font-bold uppercase tracking-wider outline-none focus:border-black rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  CTA Button Link / URL
                </label>
                <input
                  type="text"
                  value={hero.ctaHref}
                  onChange={(e) => setHero({ ...hero, ctaHref: e.target.value })}
                  placeholder="/collections/necklaces"
                  className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 font-mono outline-none focus:border-black rounded-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Top Announcement & Delivery Banners */}
        <div className="space-y-5 pb-6 border-b border-neutral-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              4. Storefront Announcement Banners
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">Top promo message &amp; secondary delivery bar</p>
          </div>

          {/* Banner 1: Top White */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-neutral-800 text-[11px] uppercase tracking-wider">
                Top Announcement Bar
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800 text-xs">
                <input
                  type="checkbox"
                  checked={config.topBannerEnabled}
                  onChange={(e) => setConfig({ ...config, topBannerEnabled: e.target.checked })}
                  className="w-4 h-4 accent-black rounded-none cursor-pointer"
                />
                <span>Enable</span>
              </label>
            </div>
            <input
              type="text"
              value={config.topBannerText}
              onChange={(e) => setConfig({ ...config, topBannerText: e.target.value })}
              placeholder="SIGN UP FOR 10% OFF YOUR FIRST ORDER"
              className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 font-bold tracking-wider outline-none focus:border-black rounded-none"
            />
          </div>

          {/* Banner 2: Secondary Delivery */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-neutral-800 text-[11px] uppercase tracking-wider">
                Secondary Delivery Banner
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800 text-xs">
                <input
                  type="checkbox"
                  checked={config.secondaryBannerEnabled}
                  onChange={(e) => setConfig({ ...config, secondaryBannerEnabled: e.target.checked })}
                  className="w-4 h-4 accent-black rounded-none cursor-pointer"
                />
                <span>Enable</span>
              </label>
            </div>
            <input
              type="text"
              value={config.secondaryBannerText}
              onChange={(e) => setConfig({ ...config, secondaryBannerText: e.target.value })}
              placeholder="FREE UK DELIVERY ON ORDERS OVER £100"
              className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 font-bold tracking-wider outline-none focus:border-black rounded-none"
            />

            {/* Color selector */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {PRESET_COLORS.map((clr) => (
                <button
                  type="button"
                  key={clr.hex}
                  onClick={() => setConfig({ ...config, secondaryBannerBg: clr.hex })}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 border transition-all cursor-pointer rounded-none ${
                    config.secondaryBannerBg.toLowerCase() === clr.hex.toLowerCase()
                      ? "border-black bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100"
                  }`}
                >
                  <span className="w-3.5 h-3.5 border border-black/20" style={{ backgroundColor: clr.hex }} />
                  <span>{clr.label}</span>
                </button>
              ))}

              <div className="flex items-center gap-2 pl-2 border-l border-neutral-300">
                <span className="text-[11px] font-bold text-neutral-600">Custom Hex:</span>
                <input
                  type="text"
                  value={config.secondaryBannerBg}
                  onChange={(e) => setConfig({ ...config, secondaryBannerBg: e.target.value })}
                  className="w-24 bg-white border border-neutral-300 px-2 py-1 text-xs font-mono font-bold uppercase outline-none focus:border-black rounded-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Social Media Links (Footer) */}
        <div className="space-y-4 pb-6 border-b border-neutral-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              5. Social Media Channels &amp; Footer Links
            </h3>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Official profile links for footer vector icons (Instagram, Facebook, TikTok, Pinterest, YouTube)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-neutral-800 mb-1 uppercase tracking-wider">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={socials.instagram}
                onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                placeholder="https://instagram.com/bhaijewellers"
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2 text-xs text-neutral-900 font-mono outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-800 mb-1 uppercase tracking-wider">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={socials.facebook}
                onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                placeholder="https://facebook.com/bhaijewellers"
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2 text-xs text-neutral-900 font-mono outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-800 mb-1 uppercase tracking-wider">
                TikTok Channel URL
              </label>
              <input
                type="url"
                value={socials.tiktok}
                onChange={(e) => setSocials({ ...socials, tiktok: e.target.value })}
                placeholder="https://tiktok.com/@bhaijewellers"
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2 text-xs text-neutral-900 font-mono outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-800 mb-1 uppercase tracking-wider">
                Pinterest Page URL
              </label>
              <input
                type="url"
                value={socials.pinterest}
                onChange={(e) => setSocials({ ...socials, pinterest: e.target.value })}
                placeholder="https://pinterest.com/bhaijewellers"
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2 text-xs text-neutral-900 font-mono outline-none focus:border-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-neutral-800 mb-1 uppercase tracking-wider">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={socials.youtube}
                onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                placeholder="https://youtube.com/@bhaijewellers"
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2 text-xs text-neutral-900 font-mono outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Submit & Real-Time Publish Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-500 text-center sm:text-left">
            Clicking Publish will broadcast all Logo, Font, Nav Links, Banner &amp; Social updates instantly to all visitors.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all cursor-pointer rounded-none disabled:opacity-50 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Publishing..." : "Publish All Settings Live"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
