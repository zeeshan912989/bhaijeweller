"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminLogin from "@/components/admin/AdminLogin";
import DashboardView from "@/components/admin/DashboardView";
import AddProductView from "@/components/admin/AddProductView";
import ProductsView from "@/components/admin/ProductsView";
import VideoManagerView from "@/components/admin/VideoManagerView";
import OrdersView, { OrderRecord } from "@/components/admin/OrdersView";
import CustomersView from "@/components/admin/CustomersView";
import CouponsView from "@/components/admin/CouponsView";
import LayoutCustomizerView from "@/components/admin/LayoutCustomizerView";
import SettingsView from "@/components/admin/SettingsView";
import { ALL_PRODUCTS, Product } from "@/data/products";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Live data states
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // 1. Check 24-Hour Active Session on Mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bhai_admin_session_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.authenticated && parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setIsAuthenticated(true);
          return;
        }
      }
    } catch (e) {
      console.error("Session verification error", e);
    }
    setIsAuthenticated(false);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("bhai_admin_session_v1");
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
  };

  // 2. Fetch live data from Supabase
  const loadDataFromSupabase = useCallback(async () => {
    try {
      // Products
      const { data: pData, error: pError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!pError && pData) {
        const mapped: Product[] = pData.map((row) => ({
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
        setProducts(mapped);
      }

      // Orders
      const { data: oData, error: oError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!oError && oData) {
        const mappedOrders: OrderRecord[] = oData.map((row) => ({
          id: row.order_number || row.id,
          customerName: row.customer_name,
          customerEmail: row.customer_email,
          address: row.shipping_address,
          date: new Date(row.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          items: row.items || [],
          subtotal: Number(row.subtotal),
          shipping: Number(row.shipping || 0),
          total: Number(row.total),
          paymentStatus: row.payment_status || "Paid",
          fulfillmentStatus: row.fulfillment_status || "Processing",
        }));
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error("Supabase live sync error:", err);
    }
  }, []);

  // Real-time Polling & Initial Load
  useEffect(() => {
    if (!isAuthenticated) return;
    loadDataFromSupabase();

    // Auto sync every 10 seconds for live updates
    const interval = setInterval(() => {
      loadDataFromSupabase();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, loadDataFromSupabase]);

  const handleAddProduct = async (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    try {
      await supabase.from("products").insert([
        {
          slug: newProduct.slug,
          name: newProduct.name,
          category: newProduct.category,
          price: newProduct.price,
          original_price: newProduct.originalPrice || null,
          badge: newProduct.badge || null,
          primary_image: newProduct.images.primary,
          hover_image: newProduct.images.hover || null,
          metals: newProduct.metals,
          in_stock: newProduct.inStock,
        },
      ]);
      loadDataFromSupabase();
    } catch (err) {
      console.error("Error inserting to Supabase:", err);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    try {
      await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          slug: updatedProduct.slug,
          category: updatedProduct.category,
          price: updatedProduct.price,
          original_price: updatedProduct.originalPrice || null,
          badge: updatedProduct.badge || null,
          primary_image: updatedProduct.images.primary,
          hover_image: updatedProduct.images.hover || null,
          in_stock: updatedProduct.inStock,
        })
        .eq("slug", updatedProduct.slug);
      loadDataFromSupabase();
    } catch (err) {
      console.error("Error updating in Supabase:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const toDelete = products.find((p) => p.id === id);
    setProducts(products.filter((p) => p.id !== id));
    if (toDelete) {
      try {
        await supabase.from("products").delete().eq("slug", toDelete.slug);
        loadDataFromSupabase();
      } catch (err) {
        console.error("Error deleting from Supabase:", err);
      }
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: "Fulfilled" | "Processing" | "Unfulfilled"
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o))
    );

    try {
      await supabase
        .from("orders")
        .update({ fulfillment_status: newStatus })
        .eq("order_number", orderId);
      loadDataFromSupabase();
    } catch (err) {
      console.error("Error updating order status in Supabase:", err);
    }
  };

  // Loading initial authentication state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="text-center space-y-3">
          <span
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-2xl font-bold tracking-[0.25em] text-white block animate-pulse"
          >
            BHAI
          </span>
          <p className="text-[11px] font-mono text-[#d4af37] uppercase tracking-widest">
            Verifying TLS Vault Session...
          </p>
        </div>
      </div>
    );
  }

  // If Not Authenticated -> Show Multi-Layer Login Screen
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // If Authenticated -> Render Full Protected Admin Panel
  return (
    <div className="min-h-screen bg-[#F8F7F4] text-neutral-900 flex font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* 1. Desktop & Mobile Sidebar Navigation with Real-Time Counters */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        productCount={products.length}
        orderCount={orders.length}
        onLogout={handleLogout}
      />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 2. Main Content Stage with Dynamic Offset */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        
        {/* Top Header */}
        <AdminHeader
          activeTab={activeTab}
          onOpenAddModal={() => setActiveTab("add-product")}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onLogout={handleLogout}
        />

        {/* Tab Views Body */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1600px] w-full mx-auto">
          
          {activeTab === "dashboard" && (
            <DashboardView
              products={products}
              onNavigateToProducts={() => setActiveTab("products")}
              onNavigateToOrders={() => setActiveTab("orders")}
            />
          )}

          {activeTab === "add-product" && (
            <AddProductView
              onAddProduct={handleAddProduct}
              onNavigateToProducts={() => setActiveTab("products")}
            />
          )}

          {activeTab === "videos" && (
            <VideoManagerView
              products={products}
              onNavigateToAddProduct={() => setActiveTab("add-product")}
            />
          )}

          {activeTab === "layout" && <LayoutCustomizerView />}

          {activeTab === "products" && (
            <ProductsView
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
              searchQuery={searchQuery}
              onNavigateToAddProduct={() => setActiveTab("add-product")}
            />
          )}

          {activeTab === "orders" && (
            <OrdersView
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === "customers" && <CustomersView />}

          {activeTab === "coupons" && <CouponsView />}

          {activeTab === "analytics" && (
            <DashboardView
              products={products}
              onNavigateToProducts={() => setActiveTab("products")}
              onNavigateToOrders={() => setActiveTab("orders")}
            />
          )}

          {activeTab === "settings" && <SettingsView />}

        </main>
      </div>

    </div>
  );
}
