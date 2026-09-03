"use client";

import React from "react";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Product } from "@/data/products";

interface DashboardViewProps {
  products: Product[];
  onNavigateToProducts: () => void;
  onNavigateToOrders: () => void;
}

export default function DashboardView({
  products,
  onNavigateToProducts,
  onNavigateToOrders,
}: DashboardViewProps) {
  const KPIS = [
    {
      title: "Total Revenue",
      value: "£0.00",
      change: "Live",
      isPositive: true,
      timeframe: "from verified checkouts",
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-800 border-emerald-300",
    },
    {
      title: "Total Orders",
      value: "0",
      change: "0 pending",
      isPositive: true,
      timeframe: "lifetime store orders",
      icon: ShoppingBag,
      color: "bg-amber-50 text-amber-800 border-amber-300",
    },
    {
      title: "Average Order Value",
      value: "£0.00",
      change: "—",
      isPositive: true,
      timeframe: "per completed transaction",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-800 border-blue-300",
    },
    {
      title: "Active Catalogue",
      value: `${products.length} Styles`,
      change: products.length > 0 ? "100% In Stock" : "Ready to Add",
      isPositive: true,
      timeframe: "published in database",
      icon: Package,
      color: "bg-purple-50 text-purple-800 border-purple-300",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Top KPI Summary Cards (Square) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {KPIS.map((kpi, idx) => {
          const Icon = kpi.icon;

          return (
            <div
              key={idx}
              className="bg-white p-5 border border-neutral-200 shadow-none hover:border-black transition-colors rounded-none"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                  {kpi.title}
                </span>
                <div className={`p-2 border rounded-none ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <p 
                  style={{ fontFamily: "var(--font-neue-haas)" }}
                  className="text-2xl font-bold text-neutral-950 tracking-tight"
                >
                  {kpi.value}
                </p>
                <span className="text-xs font-bold text-neutral-700 uppercase">
                  {kpi.change}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 uppercase tracking-wider">{kpi.timeframe}</p>
            </div>
          );
        })}
      </div>

      {/* 2. Visual Revenue Chart & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Revenue Performance Card (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 border border-neutral-200 rounded-none">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950">
                Live Sales & Revenue Performance
              </h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">Real-time database transaction tracking</p>
            </div>
            <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 border border-neutral-300 rounded-none uppercase tracking-wider">
              Live Gateway
            </span>
          </div>

          <div className="h-44 flex items-center justify-center border-b border-neutral-200 text-center">
            <p className="text-xs text-neutral-400 font-medium">Sales charts will plot automatically as orders are placed.</p>
          </div>

          <div className="flex items-center justify-between mt-4 text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
            <span>Net Revenue: £0.00</span>
            <span className="text-neutral-950">Active Catalogue: {products.length} Products</span>
          </div>
        </div>

        {/* Store Inventory Status (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#FAF7F2] p-5 border border-neutral-200 rounded-none">
            <div className="flex items-center gap-2 text-neutral-950 mb-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                Store Ready
              </h3>
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed font-light">
              Database is clean and connected to Supabase. Click <strong>Products</strong> to add your official inventory.
            </p>
          </div>

          <div className="bg-white p-5 border border-neutral-200 rounded-none">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-950 mb-3">
              Stock & Inventory
            </h3>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-100 rounded-none">
                <span className="text-neutral-700">Total Styles Listed</span>
                <span className="font-bold text-neutral-900">{products.length}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-none">
                <span>In Stock & Ready to Ship</span>
                <span className="font-bold">{products.length > 0 ? "100%" : "0"}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Recent Orders Card */}
      <div className="bg-white p-6 border border-neutral-200 rounded-none">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950">
              Recent Customer Orders
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">Live transactions processed through store checkout</p>
          </div>
          <button
            onClick={onNavigateToOrders}
            className="text-xs font-bold uppercase tracking-wider text-neutral-950 hover:text-[#d4af37] flex items-center gap-1 cursor-pointer"
          >
            <span>Orders Tab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="py-12 text-center text-neutral-400 text-xs font-medium">
          No transactions yet. Real orders placed by customers will be displayed here in real-time.
        </div>
      </div>

    </div>
  );
}
