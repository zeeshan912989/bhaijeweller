"use client";

import React from "react";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import CartDrawer from "@/components/cart/CartDrawer";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </CurrencyProvider>
  );
}
