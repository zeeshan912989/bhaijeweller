import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/auth/auth-service";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Gift
} from "lucide-react";

export const metadata = {
  title: "Order Details | BHAI Fine Jewellery",
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      
      {/* Back Button & Header */}
      <div className="p-6 bg-white border border-neutral-200 shadow-xs space-y-4">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
          <div>
            <h1
              style={{ fontFamily: "var(--font-cinzel), serif" }}
              className="text-lg sm:text-xl font-bold uppercase tracking-[0.16em] text-neutral-950"
            >
              Order {order.orderNumber}
            </h1>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-3 py-1 border ${
                order.fulfillmentStatus === "Fulfilled"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {order.fulfillmentStatus}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-neutral-100 text-neutral-800 border border-neutral-200">
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-6 bg-white border border-neutral-200 shadow-xs space-y-4">
        <h2
          style={{ fontFamily: "var(--font-cinzel), serif" }}
          className="text-sm font-bold uppercase tracking-wider text-neutral-950 pb-2 border-b border-neutral-200"
        >
          Purchased Pieces ({order.items.length})
        </h2>

        <div className="divide-y divide-neutral-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-[#FAF7F2] border border-neutral-200 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image || "/ear.jpeg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-950">
                    {item.name}
                  </h3>
                  {item.metal && (
                    <p className="text-[11px] text-neutral-500 font-medium">
                      Metal: {item.metal}
                    </p>
                  )}
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">
                    Qty: {item.quantity} × £{item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <span className="font-mono font-bold text-sm text-neutral-950">
                £{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Delivery & Cost Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shipping Address & Method */}
        <div className="p-6 bg-white border border-neutral-200 shadow-xs space-y-4">
          <h2
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-sm font-bold uppercase tracking-wider text-neutral-950 pb-2 border-b border-neutral-200 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#997b24]" />
            <span>Delivery Destination</span>
          </h2>

          <div className="space-y-2 text-xs text-neutral-600 font-light leading-relaxed">
            <p className="font-bold text-neutral-900">{order.customerName}</p>
            <p>{order.shippingAddress}</p>
            <p className="text-neutral-400 font-mono">{order.customerEmail}</p>
          </div>

          <div className="p-3 bg-[#FAF7F2] border border-neutral-200 text-xs text-neutral-700 flex items-center gap-2 mt-4">
            <Gift className="w-4 h-4 text-[#997b24] flex-shrink-0" />
            <span>Signature Embossed Jewellery Box & Hallmark Certificate Included</span>
          </div>
        </div>

        {/* Cost Summary Breakdown */}
        <div className="p-6 bg-white border border-neutral-200 shadow-xs space-y-3">
          <h2
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-sm font-bold uppercase tracking-wider text-neutral-950 pb-2 border-b border-neutral-200"
          >
            Payment Summary
          </h2>

          <div className="space-y-2 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-neutral-950">
                £{order.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>UK Delivery</span>
              <span className="font-mono font-bold text-neutral-950">
                {order.shipping === 0 ? "FREE" : `£${order.shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm">
              <span className="font-bold uppercase tracking-wider text-neutral-950">
                Total Paid
              </span>
              <span className="font-mono font-extrabold text-neutral-950">
                £{order.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-Bit TLS Verified Transaction</span>
          </div>
        </div>

      </div>

    </div>
  );
}
