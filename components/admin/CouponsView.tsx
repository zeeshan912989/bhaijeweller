"use client";

import React, { useState } from "react";
import { Plus, X, Trash2, Tag } from "lucide-react";

interface CouponRecord {
  id: string;
  code: string;
  discount: string;
  type: "Percentage" | "Fixed Amount";
  uses: number;
  status: "Active" | "Expired";
  expiry: string;
}

export default function CouponsView() {
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("10");

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    const created: CouponRecord = {
      id: `CP-${Date.now()}`,
      code: newCode.toUpperCase().trim(),
      discount: `${newDiscount}% OFF`,
      type: "Percentage",
      uses: 0,
      status: "Active",
      expiry: "31 Dec 2026",
    };

    setCoupons([created, ...coupons]);
    setNewCode("");
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Bar (Square) */}
      <div className="bg-white p-4 border border-neutral-200 rounded-none flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950">
            Active Discount Codes
          </h2>
          <p className="text-[11px] text-neutral-500 mt-0.5">Create vouchers to reward store visitors</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black rounded-none text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Code</span>
        </button>
      </div>

      {/* Coupons Grid (Square) */}
      {coupons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((cp) => (
            <div
              key={cp.id}
              className="bg-white p-5 border border-neutral-200 rounded-none flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-800">{cp.discount}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-none">
                    {cp.status}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-none border border-dashed border-[#d4af37]/80 text-center mb-4">
                  <span className="font-mono font-bold text-sm sm:text-base text-neutral-950 tracking-widest">
                    {cp.code}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-neutral-500">
                  <p>Redeemed: <strong className="text-neutral-900">{cp.uses} times</strong></p>
                  <p>Valid Through: <strong className="text-neutral-900">{cp.expiry}</strong></p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(cp.id)}
                className="mt-4 pt-3 border-t border-neutral-100 text-neutral-400 hover:text-red-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-16 border border-neutral-200 rounded-none text-center space-y-2">
          <Tag className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.5]" />
          <p className="font-bold text-xs uppercase tracking-wider text-neutral-700">No Promo Codes Created</p>
          <p className="text-[11px] text-neutral-400">Click &ldquo;New Code&rdquo; above to generate your first promotional voucher.</p>
        </div>
      )}

      {/* Create Coupon Modal (Square) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-none max-w-md w-full p-6 sm:p-8 border border-neutral-300 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-950">Create Promo Code</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black transition-colors rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                  Discount Code Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BHAI10"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 uppercase font-mono font-bold outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                  Percentage Discount (%) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  required
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-bold outline-none focus:border-black"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-black font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black rounded-none font-bold uppercase tracking-wider transition-all"
                >
                  Create Code
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
