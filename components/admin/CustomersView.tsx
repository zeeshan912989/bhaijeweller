"use client";

import React, { useState } from "react";
import { Search, Crown, Users } from "lucide-react";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  location: string;
  totalOrders: number;
  totalSpend: number;
  tier: "Gold VIP" | "Silver Tier" | "Member";
  lastOrderDate: string;
}

export default function CustomersView() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Bar (Square) */}
      <div className="bg-white p-4 border border-neutral-200 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search VIP clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-xs pl-8 pr-3 py-2 outline-none focus:border-black border border-neutral-300 rounded-none"
          />
        </div>

        <span className="text-xs text-neutral-500 font-medium">
          Total Registered VIPs: <strong>{customers.length}</strong>
        </span>
      </div>

      {/* Customers Table (Square) */}
      <div className="bg-white border border-neutral-200 rounded-none overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 font-bold uppercase tracking-widest">
                  <th className="py-3.5 px-4 font-semibold">Client</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Orders</th>
                  <th className="py-3.5 px-4 font-semibold">Lifetime Spend</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#FAF7F2] border border-neutral-300 text-neutral-900 font-bold flex items-center justify-center text-xs rounded-none">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-xs sm:text-[13px]">{c.name}</p>
                          <p className="text-[11px] text-neutral-400 font-mono">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-600">{c.location}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none flex items-center gap-1 w-max border ${
                        c.tier === "Gold VIP"
                          ? "bg-[#FAF7F2] text-[#997b24] border-[#d4af37]/50"
                          : c.tier === "Silver Tier"
                          ? "bg-slate-50 text-slate-800 border-slate-300"
                          : "bg-neutral-100 text-neutral-800 border-neutral-200"
                      }`}>
                        <Crown className="w-3 h-3" />
                        <span>{c.tier}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-800">{c.totalOrders} orders</td>
                    <td className="py-3.5 px-4 font-bold text-neutral-950">£{c.totalSpend.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-right text-neutral-500 uppercase text-[10.5px]">{c.lastOrderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-neutral-500 space-y-2">
            <Users className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.5]" />
            <p className="font-bold text-xs uppercase tracking-wider text-neutral-700">No Customers Registered Yet</p>
            <p className="text-[11px] text-neutral-400">Client profiles will automatically populate upon store checkout and account signup.</p>
          </div>
        )}
      </div>

    </div>
  );
}
