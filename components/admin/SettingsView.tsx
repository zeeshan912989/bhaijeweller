"use client";

import React, { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";

export default function SettingsView() {
  const [storeName, setStoreName] = useState("BHAI Fine Jewellery");
  const [supportEmail, setSupportEmail] = useState("concierge@bhaijewellery.com");
  const [currency, setCurrency] = useState("GBP (£)");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("100.00");
  const [vatRate, setVatRate] = useState("20");
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
    }, 2800);
  };

  return (
    <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
      
      {savedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-none flex items-center gap-3 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>Store settings successfully saved and applied to live checkout!</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 border border-neutral-200 rounded-none">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 mb-1">
          Store Configuration & Commerce Rules
        </h2>
        <p className="text-[11px] text-neutral-500 mb-6">Manage currency, taxes, and shipping thresholds</p>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
              Online Boutique Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-semibold outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
              Customer Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-semibold outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                Store Base Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-semibold outline-none focus:border-black"
              >
                <option value="GBP (£)">UK Sterling (£ GBP)</option>
                <option value="EUR (€)">Euro (€ EUR)</option>
                <option value="USD ($)">US Dollar ($ USD)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5 uppercase tracking-wider">
                Free UK Shipping Threshold (£)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-none px-3.5 py-2.5 text-xs text-neutral-900 font-semibold outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black font-bold uppercase tracking-wider rounded-none text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
