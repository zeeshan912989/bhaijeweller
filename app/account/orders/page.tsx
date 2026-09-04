import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getUserOrders } from "@/lib/auth/auth-service";
import { ShoppingBag, Package, ChevronRight, ArrowRight, Truck } from "lucide-react";

export const metadata = {
  title: "Order History | BHAI Fine Jewellery",
};

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 bg-white border border-neutral-200 shadow-xs">
        <h1
          style={{ fontFamily: "var(--font-cinzel), serif" }}
          className="text-base font-bold uppercase tracking-[0.16em] text-neutral-950"
        >
          My Orders ({orders.length})
        </h1>
        <p className="text-xs text-neutral-500 font-light mt-0.5">
          View and track your fine jewellery purchases and delivery status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 bg-white border border-neutral-200 text-center space-y-3 shadow-xs">
          <ShoppingBag className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.25]" />
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              No Orders Found
            </h2>
            <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
              You haven&apos;t placed any orders yet. Discover our latest arrivals in solid gold and diamonds.
            </p>
          </div>
          <Link
            href="/collections/earrings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-all shadow-xs mt-2"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs transition-all space-y-4"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs sm:text-sm text-neutral-950">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 border ${
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
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                      Total Amount
                    </p>
                    <p className="font-mono font-bold text-sm text-neutral-950">
                      £{order.total.toFixed(2)}
                    </p>
                  </div>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-950 hover:text-white text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex flex-wrap items-center gap-3">
                {order.items.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="relative w-14 h-14 bg-[#FAF7F2] border border-neutral-200 overflow-hidden flex-shrink-0"
                    title={item.name}
                  >
                    <Image
                      src={item.image || "/ear.jpeg"}
                      alt={item.name || "Piece"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}

                {order.items.length > 4 && (
                  <div className="w-14 h-14 bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xs font-bold font-mono text-neutral-600">
                    +{order.items.length - 4}
                  </div>
                )}

                <div className="text-xs text-neutral-600 pl-1">
                  <p className="font-medium text-neutral-900">
                    {order.items.length} {order.items.length === 1 ? "Piece" : "Pieces"}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-light">
                    {order.items.map((it) => it.name).join(", ").slice(0, 60)}
                    {order.items.map((it) => it.name).join(", ").length > 60 ? "..." : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
