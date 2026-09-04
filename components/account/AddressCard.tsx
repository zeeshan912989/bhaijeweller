"use client";

import React, { useTransition } from "react";
import { MapPin, Phone, Trash2, CheckCircle2, Star, Loader2 } from "lucide-react";
import { UserAddress } from "@/lib/auth/auth-service";
import { deleteAddressAction, setDefaultAddressAction } from "@/lib/actions/account-actions";

interface AddressCardProps {
  address: UserAddress;
  onEdit?: (address: UserAddress) => void;
}

export default function AddressCard({ address, onEdit }: AddressCardProps) {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isSettingDefault, startDefaultTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this delivery address?")) {
      startDeleteTransition(async () => {
        await deleteAddressAction(address.id);
      });
    }
  };

  const handleSetDefault = () => {
    startDefaultTransition(async () => {
      await setDefaultAddressAction(address.id);
    });
  };

  return (
    <div
      className={`p-5 bg-white border transition-all flex flex-col justify-between ${
        address.isDefault
          ? "border-neutral-950 shadow-xs ring-1 ring-black/10"
          : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <div className="space-y-3">
        
        {/* Header: Name + Default Pill */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-950">
              {address.fullName}
            </h3>
            <p className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono mt-0.5">
              <Phone className="w-3 h-3 text-neutral-400" />
              <span>{address.phone}</span>
            </p>
          </div>

          {address.isDefault ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-neutral-950 text-white text-[9.5px] font-bold uppercase tracking-widest font-mono">
              <Star className="w-2.5 h-2.5 text-[#d4af37] fill-[#d4af37]" />
              Default
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSetDefault}
              disabled={isSettingDefault}
              className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 hover:text-black hover:underline cursor-pointer disabled:opacity-50"
            >
              {isSettingDefault ? "Updating..." : "Set as Default"}
            </button>
          )}
        </div>

        {/* Street Lines */}
        <div className="text-xs text-neutral-600 font-light leading-relaxed pt-1">
          <p>{address.addressLine1}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="font-medium text-neutral-900 mt-1">{address.country}</p>
        </div>

      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
        <button
          type="button"
          onClick={() => onEdit?.(address)}
          className="text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-[#997b24] transition-colors cursor-pointer"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          aria-label="Delete address"
          className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40"
          title="Delete address"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

    </div>
  );
}
