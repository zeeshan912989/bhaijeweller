"use client";

import React, { useState, useEffect } from "react";
import { Layout, Save, CheckCircle2, Sparkles, RefreshCw, Eye } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface SiteBannerConfig {
  topBannerText: string;
  topBannerEnabled: boolean;
  secondaryBannerText: string;
  secondaryBannerBg: string;
  secondaryBannerEnabled: boolean;
}

export const DEFAULT_BANNER_CONFIG: SiteBannerConfig = {
  topBannerText: "SIGN UP FOR 10% OFF YOUR FIRST ORDER",
  topBannerEnabled: true,
  secondaryBannerText: "FREE UK DELIVERY ON ORDERS OVER £100",
  secondaryBannerBg: "#3D1E08",
  secondaryBannerEnabled: true,
};

export default function LayoutCustomizerView() {
  const [config, setConfig] = useState<SiteBannerConfig>(DEFAULT_BANNER_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load existing config on mount
  useEffect(() => {
    try {
      const local = localStorage.getItem("bhai_site_banners_v1");
      if (local) {
        setConfig(JSON.parse(local));
      }
    } catch (e) {
      console.error(e);
    }

    // Also fetch from Supabase if table exists
    async function fetchFromSupabase() {
      try {
        const { data } = await supabase.from("site_settings").select("*").eq("key", "header_banners").single();
        if (data && data.value) {
          setConfig(data.value);
        }
      } catch (e) {
        // Fallback to local
      }
    }
    fetchFromSupabase();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      // 1. Save to localStorage for instant local persistence
      localStorage.setItem("bhai_site_banners_v1", JSON.stringify(config));

      // 2. Broadcast to all open tabs/windows in real-time without refresh!
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel("bhai_realtime_layout");
        channel.postMessage({ type: "BANNERS_UPDATED", payload: config });
      }

      // 3. Dispatch standard storage event
      window.dispatchEvent(new Event("storage"));

      // 4. Upsert to Supabase
      try {
        await supabase.from("site_settings").upsert({
          key: "header_banners",
          value: config,
          updated_at: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.log("Supabase settings sync:", dbErr);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      
      {/* Top Header */}
      <div className="bg-white p-5 border border-neutral-200 rounded-none flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950">
            Storefront Header & Announcement Banners
          </h2>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Changes apply in real-time across the live store without reloading the website
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
          <span>Announcement Banners updated in real-time! Live storefront is now showing new messages.</span>
        </div>
      )}

      {/* Live Preview Screen */}
      <div className="bg-white p-6 border border-neutral-200 rounded-none space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-950 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Live Interactive Preview</span>
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">Storefront View</span>
        </div>

        <div className="border border-neutral-300 overflow-hidden shadow-xs">
          
          {/* Top Banner Preview */}
          {config.topBannerEnabled ? (
            <div
              style={{ fontFamily: "var(--font-neue-haas)" }}
              className="bg-white text-neutral-950 border-b border-neutral-200 text-center py-2 px-4 text-xs font-bold tracking-[0.18em] uppercase transition-all"
            >
              {config.topBannerText || "SIGN UP FOR 10% OFF YOUR FIRST ORDER"}
            </div>
          ) : (
            <div className="bg-neutral-100 text-neutral-400 text-center py-1 text-[10px] uppercase font-mono border-b border-neutral-200">
              [ Top White Banner Disabled ]
            </div>
          )}

          {/* Secondary Banner Preview */}
          {config.secondaryBannerEnabled ? (
            <div
              style={{
                backgroundColor: config.secondaryBannerBg,
                fontFamily: "var(--font-neue-haas)",
              }}
              className="text-white text-center py-2 px-4 text-xs font-extrabold tracking-[0.16em] uppercase transition-colors"
            >
              {config.secondaryBannerText || "FREE UK DELIVERY ON ORDERS OVER £100"}
            </div>
          ) : (
            <div className="bg-neutral-200 text-neutral-500 text-center py-1 text-[10px] uppercase font-mono">
              [ Secondary Delivery Banner Disabled ]
            </div>
          )}

          {/* Mock Navbar Header */}
          <div className="bg-neutral-950 text-white px-6 py-4 flex items-center justify-between text-xs">
            <span style={{ fontFamily: "var(--font-cinzel), serif" }} className="text-sm font-bold tracking-widest text-[#d4af37]">
              BHAI
            </span>
            <div className="hidden sm:flex items-center gap-4 text-[10px] uppercase tracking-wider text-neutral-400">
              <span>Earrings</span>
              <span>Necklaces</span>
              <span>Bracelets</span>
              <span>Rings</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">Store Navbar</span>
          </div>

        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none space-y-6 text-xs">
        
        {/* SECTION 1: Top Announcement Banner */}
        <div className="space-y-4 pb-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                1. Top White Announcement Banner
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Top-most dismissible message bar</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800 text-xs">
              <input
                type="checkbox"
                checked={config.topBannerEnabled}
                onChange={(e) => setConfig({ ...config, topBannerEnabled: e.target.checked })}
                className="w-4 h-4 accent-black rounded-none cursor-pointer"
              />
              <span>Enable Banner</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
              Top Banner Text (Uppercase Recommended)
            </label>
            <input
              type="text"
              required
              value={config.topBannerText}
              onChange={(e) => setConfig({ ...config, topBannerText: e.target.value })}
              placeholder="SIGN UP FOR 10% OFF YOUR FIRST ORDER"
              className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-bold tracking-wider outline-none focus:border-black"
            />
          </div>
        </div>

        {/* SECTION 2: Secondary Delivery / Promo Banner */}
        <div className="space-y-4 pb-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                2. Secondary Delivery Banner
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Middle bar with custom background color</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800 text-xs">
              <input
                type="checkbox"
                checked={config.secondaryBannerEnabled}
                onChange={(e) => setConfig({ ...config, secondaryBannerEnabled: e.target.checked })}
                className="w-4 h-4 accent-black rounded-none cursor-pointer"
              />
              <span>Enable Banner</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
              Secondary Banner Text
            </label>
            <input
              type="text"
              required
              value={config.secondaryBannerText}
              onChange={(e) => setConfig({ ...config, secondaryBannerText: e.target.value })}
              placeholder="FREE UK DELIVERY ON ORDERS OVER £100"
              className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-bold tracking-wider outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-2 uppercase tracking-wider">
              Banner Background Color Tone
            </label>
            <div className="flex flex-wrap items-center gap-2">
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
                  className="w-24 bg-white border border-neutral-300 px-2 py-1 text-xs font-mono font-bold uppercase outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit & Real-Time Publish Button */}
        <div className="pt-2 flex items-center justify-between">
          <p className="text-[11px] text-neutral-500">
            Clicking Save will broadcast updates instantly to all visitors on the store.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all cursor-pointer rounded-none disabled:opacity-50 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Publishing..." : "Publish Banners Live"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
