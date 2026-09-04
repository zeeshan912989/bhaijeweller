"use client";

import React, { useState } from "react";
import { UserAddress } from "@/lib/auth/auth-service";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { Plus, MapPin, Sparkles } from "lucide-react";

interface AddressManagerProps {
  initialAddresses: UserAddress[];
}

export default function AddressManager({ initialAddresses }: AddressManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (addr: UserAddress) => {
    setEditingAddress(addr);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Add Button */}
      <div className="p-6 bg-white border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            style={{ fontFamily: "var(--font-cinzel), serif" }}
            className="text-base font-bold uppercase tracking-[0.16em] text-neutral-950"
          >
            Saved Delivery Addresses
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Manage your personal and gift shipping destinations across the UK and internationally.
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {/* Address Form (Modal / Inline) */}
      {isFormOpen && (
        <AddressForm
          initialAddress={editingAddress}
          onClose={handleCloseForm}
        />
      )}

      {/* Address Grid */}
      {initialAddresses.length === 0 && !isFormOpen ? (
        <div className="p-12 bg-white border border-neutral-200 text-center space-y-3 shadow-xs">
          <MapPin className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.25]" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              No Saved Addresses
            </h3>
            <p className="text-xs text-neutral-500 font-light">
              Add a delivery address to speed up your luxury checkout process.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialAddresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

    </div>
  );
}
