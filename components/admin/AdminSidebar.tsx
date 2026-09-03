"use client";

import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  TrendingUp, 
  Settings, 
  ExternalLink,
  LayoutTemplate,
  PackagePlus,
  Film,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

export type AdminTab = "dashboard" | "add-product" | "products" | "orders" | "videos" | "layout" | "customers" | "coupons" | "analytics" | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  productCount: number;
  orderCount: number;
  onLogout?: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  productCount,
  orderCount,
  onLogout,
}: AdminSidebarProps) {
  const NAV_LINKS = [
    { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "add-product" as AdminTab, label: "Add Product", icon: PackagePlus },
    { id: "products" as AdminTab, label: "All Products", icon: Package, count: productCount },
    { id: "videos" as AdminTab, label: "Reels & Videos", icon: Film },
    { id: "orders" as AdminTab, label: "Orders", icon: ShoppingBag, count: orderCount },
    { id: "layout" as AdminTab, label: "Banners & Layout", icon: LayoutTemplate },
    { id: "customers" as AdminTab, label: "Customers", icon: Users },
    { id: "coupons" as AdminTab, label: "Discounts & Promo", icon: Tag },
    { id: "analytics" as AdminTab, label: "Analytics", icon: TrendingUp },
    { id: "settings" as AdminTab, label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-neutral-950 text-white border-r border-neutral-800 flex flex-col justify-between transition-all duration-300 rounded-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 lg:h-[72px] px-5 flex items-center justify-between border-b border-neutral-800">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <span
                style={{ fontFamily: "var(--font-cinzel), serif" }}
                className="text-xl font-bold tracking-[0.2em] text-white"
              >
                BHAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-neutral-900 text-[#d4af37] px-2 py-0.5 rounded-none border border-neutral-700">
                Admin
              </span>
            </div>
          ) : (
            <span
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-lg font-bold tracking-widest text-[#d4af37] mx-auto"
            >
              B
            </span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors hidden lg:block cursor-pointer rounded-none"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="p-2 space-y-1">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer rounded-none border-l-2 ${
                  isActive
                    ? "bg-[#d4af37] text-neutral-950 border-[#d4af37] shadow-none"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900 border-transparent"
                } ${collapsed ? "justify-center px-2 border-l-0" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-neutral-950" : "text-neutral-400"}`} />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.count !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-none border ${
                      isActive ? "bg-black text-[#d4af37] border-black" : "bg-neutral-900 text-neutral-400 border-neutral-800"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Store Link + Logout */}
      <div className="p-3 border-t border-neutral-800 space-y-1">
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-none text-xs font-bold tracking-wider uppercase text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors ${
            collapsed ? "justify-center px-2" : ""
          }`}
          title="View Live Store"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0 text-[#d4af37]" />
          {!collapsed && <span>View Store</span>}
        </Link>

        {onLogout && (
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-none text-xs font-bold tracking-wider uppercase text-neutral-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 text-red-500" />
            {!collapsed && <span>Log Out</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
