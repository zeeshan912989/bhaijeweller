"use client";

import React, { useState, useTransition } from "react";
import { UserAddress } from "@/lib/auth/auth-service";
import { addAddressAction, updateAddressAction } from "@/lib/actions/account-actions";
import { X, Loader2, Save, MapPin } from "lucide-react";

interface AddressFormProps {
  initialAddress?: UserAddress | null;
  onClose: () => void;
}

export default function AddressForm({ initialAddress, onClose }: AddressFormProps) {
  const isEditing = Boolean(initialAddress);

  const [fullName, setFullName] = useState(initialAddress?.fullName || "");
  const [phone, setPhone] = useState(initialAddress?.phone || "");
  const [addressLine1, setAddressLine1] = useState(initialAddress?.addressLine1 || "");
  const [addressLine2, setAddressLine2] = useState(initialAddress?.addressLine2 || "");
  const [city, setCity] = useState(initialAddress?.city || "");
  const [state, setState] = useState(initialAddress?.state || "");
  const [postalCode, setPostalCode] = useState(initialAddress?.postalCode || "");
  const [country, setCountry] = useState(initialAddress?.country || "United Kingdom");
  const [isDefault, setIsDefault] = useState(initialAddress?.isDefault || false);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("fullName", fullName);
    formData.set("phone", phone);
    formData.set("addressLine1", addressLine1);
    if (addressLine2) formData.set("addressLine2", addressLine2);
    formData.set("city", city);
    formData.set("state", state);
    formData.set("postalCode", postalCode);
    formData.set("country", country);
    formData.set("isDefault", String(isDefault));

    startTransition(async () => {
      let res;
      if (isEditing && initialAddress) {
        res = await updateAddressAction(initialAddress.id, null, formData);
      } else {
        res = await addAddressAction(null, formData);
      }

      if (res.success) {
        onClose();
      } else {
        setError(res.error || "Failed to save address.");
      }
    });
  };

  return (
    <div className="p-6 bg-white border border-neutral-200 shadow-xl space-y-5 animate-in fade-in duration-200">
      
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <h3
          style={{ fontFamily: "var(--font-cinzel), serif" }}
          className="text-sm font-bold uppercase tracking-wider text-neutral-950 flex items-center gap-2"
        >
          <MapPin className="w-4 h-4 text-[#997b24]" />
          <span>{isEditing ? "Edit Delivery Address" : "Add New Delivery Address"}</span>
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-neutral-400 hover:text-black cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full bg-neutral-50 text-xs text-neutral-950 p-2.5 border border-neutral-300 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7123 456789"
              className="w-full bg-neutral-50 text-xs text-neutral-950 p-2.5 border border-neutral-300 outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Street Address Line 1 *
          </label>
          <input
            type="text"
            required
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            placeholder="12 Bond Street, Mayfair"
            className="w-full bg-neutral-50 text-xs text-neutral-950 p-2.5 border border-neutral-300 outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            placeholder="Apartment, Suite, Unit"
            className="w-full bg-neutral-50 text-xs text-neutral-950 p-2.5 border border-neutral-300 outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="London"
              className="w-full bg-neutral-50 text-xs text-neutral-950 p-2.5 border border-neutral-300 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              County / Region *
            </label>
            <input
              type="text"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Greater London"
              className="w-full bg-neutral-50 text-xs text-neutral-950 p-2.5 border border-neutral-300 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
              Postcode *
            </label>
            <input
              type="text"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="W1S 2TF"
              className="w-full bg-neutral-50 text-xs text-neutral-950 p-2.5 border border-neutral-300 outline-none focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10.5px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
            Country *
          </label>
          <input
            type="text"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-neutral-50 text-xs text-neutral-950 p-2.5 border border-neutral-300 outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isDefault"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="w-4 h-4 text-black border-neutral-300 rounded-none cursor-pointer"
          />
          <label htmlFor="isDefault" className="text-xs text-neutral-700 cursor-pointer select-none">
            Set as my primary delivery address
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isEditing ? "Update Address" : "Save Address"}</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
