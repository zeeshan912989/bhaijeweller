import React from "react";
import AddressManager from "@/components/account/AddressManager";
import { getUserAddresses } from "@/lib/auth/auth-service";

export const metadata = {
  title: "Delivery Addresses | BHAI Fine Jewellery",
};

export default async function AddressesPage() {
  const addresses = await getUserAddresses();

  return (
    <div className="space-y-6">
      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
