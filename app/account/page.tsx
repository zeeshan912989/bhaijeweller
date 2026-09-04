import React from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Package, 
  Clock, 
  ChevronRight,
  Award,
  Truck
} from "lucide-react";
import { 
  getUserProfile, 
  getUserOrders, 
  getUserAddresses 
} from "@/lib/auth/auth-service";

export default async function AccountDashboardPage() {
  const [profile, orders, addresses] = await Promise.all([
    getUserProfile(),
    getUserOrders(),
    getUserAddresses(),
  ]);

  const recentOrders = orders.slice(0, 3);
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })
    : "2026";

  return (
    <div className="space-y-6">
      
      {/* 1. WELCOME BANNER */}
      <div className="p-6 sm:p-8 bg-white border border-neutral-200 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FAF7F2] text-[#997b24] text-[10px] font-extrabold uppercase tracking-widest border border-[#d4af37]/30">
            <Sparkles className="w-3 h-3" />
            <span>Bhai Concierge Portal</span>
          </div>

          <h1
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.16em] text-neutral-950"
          >
            Welcome, {profile?.fullName || "Valued Client"}
          </h1>

          <p className="text-xs text-neutral-500 font-light max-w-xl leading-relaxed">
            Member since {memberSince} • Your personal sanctuary for handcrafted fine jewellery orders, bespoke requests, and private atelier privileges.
          </p>
        </div>
      </div>

      {/* 2. QUICK STATS SUMMARY TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 bg-white border border-neutral-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Total Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-neutral-900" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-950">{orders.length}</p>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#997b24] hover:underline pt-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 bg-white border border-neutral-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Saved Addresses
            </span>
            <MapPin className="w-4 h-4 text-neutral-900" />
          </div>
          <p className="text-2xl font-bold font-mono text-neutral-950">{addresses.length}</p>
          <Link
            href="/account/addresses"
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#997b24] hover:underline pt-1"
          >
            <span>Manage Address Book</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-5 bg-white border border-neutral-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              VIP Tier
            </span>
            <Award className="w-4 h-4 text-[#d4af37]" />
          </div>
          <p className="text-2xl font-bold uppercase tracking-wider text-neutral-950">Gold</p>
          <p className="text-[11px] text-emerald-700 font-medium pt-1">
            Free UK Next-Day Delivery Active
          </p>
        </div>

      </div>

      {/* 3. RECENT ORDERS SECTION */}
      <div className="p-6 bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <h2
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-sm sm:text-base font-bold uppercase tracking-[0.16em] text-neutral-950 flex items-center gap-2"
          >
            <Package className="w-4 h-4 text-[#997b24]" />
            <span>Recent Orders</span>
          </h2>

          <Link
            href="/account/orders"
            className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 hover:text-black hover:underline"
          >
            View All ({orders.length})
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <ShoppingBag className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.25]" />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                No Orders Placed Yet
              </p>
              <p className="text-xs text-neutral-500 font-light">
                Discover our curated collection of handcrafted solid gold and diamond jewellery.
              </p>
            </div>
            <Link
              href="/collections/earrings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-all shadow-xs"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-neutral-950">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                        order.fulfillmentStatus === "Fulfilled"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {order.fulfillmentStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-light">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    • {order.items.length} {order.items.length === 1 ? "piece" : "pieces"}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-mono font-bold text-xs text-neutral-950">
                    £{order.total.toFixed(2)}
                  </span>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="px-3.5 py-1.5 border border-neutral-300 hover:border-black text-neutral-800 hover:text-black text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. QUICK ACTIONS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <Link
          href="/account/profile"
          className="p-5 bg-white border border-neutral-200 hover:border-neutral-400 shadow-xs flex items-center justify-between group transition-all"
        >
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 group-hover:text-[#997b24] transition-colors">
              Personal Profile
            </h3>
            <p className="text-[11px] text-neutral-500 font-light mt-0.5">
              Update your name, contact phone, and atelier preferences.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/account/settings"
          className="p-5 bg-white border border-neutral-200 hover:border-neutral-400 shadow-xs flex items-center justify-between group transition-all"
        >
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 group-hover:text-[#997b24] transition-colors">
              Security & Password
            </h3>
            <p className="text-[11px] text-neutral-500 font-light mt-0.5">
              Update your password, view session safety, and preferences.
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </Link>

      </div>

    </div>
  );
}
