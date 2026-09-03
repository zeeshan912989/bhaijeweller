"use client";

import React, { useState } from "react";
import { X, ShoppingBag } from "lucide-react";

export interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  address: string;
  date: string;
  items: Array<{ name: string; quantity: number; price: number; metal: string }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  fulfillmentStatus: "Fulfilled" | "Processing" | "Unfulfilled";
}

interface OrdersViewProps {
  orders: OrderRecord[];
  onUpdateStatus?: (orderId: string, newStatus: "Fulfilled" | "Processing" | "Unfulfilled") => void;
}

export default function OrdersView({ orders, onUpdateStatus }: OrdersViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus === "all") return true;
    return ord.fulfillmentStatus.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleStatusChange = (orderId: string, newStatus: "Fulfilled" | "Processing" | "Unfulfilled") => {
    if (onUpdateStatus) {
      onUpdateStatus(orderId, newStatus);
    }
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, fulfillmentStatus: newStatus } : null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Filter Bar (Square) */}
      <div className="bg-white p-4 border border-neutral-200 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {["all", "processing", "fulfilled", "unfulfilled"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
                filterStatus === st
                  ? "bg-neutral-950 text-white border-neutral-950"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-200"
              }`}
            >
              {st === "all" ? "All Orders" : st}
            </button>
          ))}
        </div>

        <span className="text-xs text-neutral-500 font-medium">
          <strong>{filteredOrders.length}</strong> orders listed
        </span>
      </div>

      {/* Orders Table Card (Square) */}
      <div className="bg-white border border-neutral-200 rounded-none overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-bold uppercase tracking-widest">
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Payment</th>
                  <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
                  <th className="py-3.5 px-4 font-semibold">Total</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-neutral-950">{ord.id}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-neutral-900">{ord.customerName}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600 font-medium">{ord.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-none">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none border ${
                        ord.fulfillmentStatus === "Fulfilled"
                          ? "bg-blue-50 text-blue-800 border-blue-300"
                          : ord.fulfillmentStatus === "Processing"
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-neutral-100 text-neutral-800 border-neutral-200"
                      }`}>
                        {ord.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-neutral-950">£{ord.total.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-950 text-neutral-900 hover:text-white rounded-none text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-neutral-200"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-neutral-500 space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.5]" />
            <p className="font-bold text-xs uppercase tracking-wider text-neutral-700">No Orders Received Yet</p>
            <p className="text-[11px] text-neutral-400">Customer transactions will appear here in real-time when placed.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal (Square) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-none max-w-xl w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#997b24] bg-[#FAF7F2] px-2 py-0.5 rounded-none border border-[#d4af37]/40">
                  Verified Order
                </span>
                <h3
                  style={{ fontFamily: "var(--font-neue-haas)" }}
                  className="text-base font-bold text-neutral-950 uppercase tracking-wider mt-1.5"
                >
                  Order {selectedOrder.id}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-neutral-400 hover:text-black transition-colors rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              
              <div className="bg-neutral-50 p-4 border border-neutral-200 rounded-none">
                <h4 className="font-bold text-neutral-900 uppercase tracking-widest mb-2">
                  Shipping & Client Information
                </h4>
                <p className="font-bold text-neutral-950 text-sm">{selectedOrder.customerName}</p>
                <p className="text-neutral-600 mt-0.5">{selectedOrder.customerEmail}</p>
                <p className="text-neutral-700 mt-2 font-medium">{selectedOrder.address}</p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 uppercase tracking-widest mb-3">
                  Purchased Items
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-neutral-200 rounded-none">
                      <div>
                        <p className="font-bold text-neutral-900 text-xs">{it.name}</p>
                        <p className="text-[11px] text-neutral-500">{it.metal} • Qty: {it.quantity}</p>
                      </div>
                      <span className="font-bold text-neutral-950">£{(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-none space-y-1.5">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>£{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tracked UK Delivery</span>
                  <span>{selectedOrder.shipping === 0 ? "FREE" : `£${selectedOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-950 text-sm pt-2 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span>£{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="block font-bold text-neutral-800 mb-2 uppercase tracking-wider">
                  Update Fulfillment Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Processing", "Fulfilled", "Unfulfilled"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-none border ${
                        selectedOrder.fulfillmentStatus === st
                          ? "bg-neutral-950 text-white border-neutral-950"
                          : "bg-white text-neutral-700 hover:bg-neutral-100 border-neutral-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
