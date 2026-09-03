"use client";

import React from "react";
import { 
  Search, 
  Bell, 
  Plus, 
  Menu,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenAddModal: () => void;
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout?: () => void;
}

export default function AdminHeader({
  activeTab,
  onOpenAddModal,
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
  onLogout,
}: AdminHeaderProps) {
  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case "dashboard": return "Dashboard & Performance";
      case "add-product": return "Add New Fine Jewellery Piece";
      case "products": return "Jewellery Products Management";
      case "videos": return "Shoppable Reels & Video Manager";
      case "orders": return "Customer Orders & Shipments";
      case "layout": return "Site Banners & Layout Customizer";
      case "customers": return "Client Directory & VIPs";
      case "coupons": return "Promo Codes & Campaigns";
      case "analytics": return "Store Analytics & Conversion";
      case "settings": return "Store & System Settings";
      default: return "Admin Portal";
    }
  };

  return (
    <header className="h-16 lg:h-[72px] bg-white border-b border-neutral-200 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 rounded-none shadow-none">
      
      {/* Left: Mobile Menu Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors rounded-none"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1
            style={{ fontFamily: "var(--font-neue-haas)" }}
            className="text-base sm:text-lg font-bold text-neutral-950 uppercase tracking-wider"
          >
            {getTabTitle(activeTab)}
          </h1>
          <p className="text-[11px] text-neutral-500 hidden sm:flex items-center gap-1.5 font-normal">
            <span className="w-2 h-2 bg-emerald-600 inline-block" />
            <span className="font-medium text-emerald-800">TLS 256-Bit Secure</span>
            <span>• 24h Session Active</span>
          </p>
        </div>
      </div>

      {/* Right: Search + Action Button + Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        
        {/* Global Filter/Search input */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search inventory, orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 text-xs pl-8 pr-3 py-2 outline-none focus:ring-1 focus:ring-neutral-900 border border-neutral-300 rounded-none"
          />
        </div>

        {/* Quick Add Product Button */}
        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Product</span>
        </button>

        {/* Admin Avatar & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-950 text-white text-xs font-bold flex items-center justify-center border border-neutral-800 rounded-none">
              BJ
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-neutral-950 uppercase leading-none">BHAI Admin</p>
              <p className="text-[10px] text-neutral-500 mt-0.5 font-mono">bhaijeweller@gmail.com</p>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-none transition-colors cursor-pointer"
              title="End Admin Session (Log Out)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
