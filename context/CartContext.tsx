"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Cart, CartItem, CartTotals, AddToCartInput } from "@/lib/cart/types";

interface CartContextType {
  cart: Cart | null;
  items: CartItem[];
  totals: CartTotals;
  itemCount: number;
  isCartOpen: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  addedNotification: { name: string; image?: string; price: number } | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearError: () => void;
  addToCart: (
    productId: string,
    variantId?: string,
    quantity?: number,
    optimisticMeta?: { name: string; price: number; image: string; category?: string }
  ) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const defaultTotals: CartTotals = {
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  shipping: 0,
  freeShippingThreshold: 100,
  amountNeededForFreeShipping: 100,
  isFreeShipping: false,
  estimatedTax: 0,
  total: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedNotification, setAddedNotification] = useState<{
    name: string;
    image?: string;
    price: number;
  } | null>(null);

  const prevCartRef = useRef<Cart | null>(null);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const clearError = useCallback(() => setError(null), []);

  // Fetch cart from server
  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.cart) {
          setCart(data.cart);
          prevCartRef.current = data.cart;
        }
      }
    } catch (err) {
      console.warn("Error refreshing cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize cart on mount
  useEffect(() => {
    refreshCart();

    // Listen for cross-tab or external cart update triggers
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === "bhai_cart_sync_event") {
        refreshCart();
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, [refreshCart]);

  // Broadcast sync event to other tabs
  const broadcastSync = () => {
    try {
      localStorage.setItem("bhai_cart_sync_event", Date.now().toString());
    } catch {
      // Ignore in private mode
    }
  };

  // Add To Cart with Optimistic Feedback
  const addToCart = async (
    productId: string,
    variantId: string = "Default",
    quantity: number = 1,
    optimisticMeta?: { name: string; price: number; image: string; category?: string }
  ): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    prevCartRef.current = cart;

    // Optimistic UI Update if metadata is available
    if (optimisticMeta && cart) {
      const existingIdx = cart.items.findIndex(
        (it) => it.productId === productId && it.variantId === variantId
      );

      let newItems: CartItem[] = [...cart.items];
      if (existingIdx >= 0) {
        const existing = newItems[existingIdx];
        const newQty = Math.min(20, existing.quantity + quantity);
        newItems[existingIdx] = {
          ...existing,
          quantity: newQty,
          lineTotal: Number((existing.product.price * newQty).toFixed(2)),
        };
      } else {
        newItems.push({
          id: `opt_${Date.now()}`,
          cartId: cart.id,
          productId,
          variantId,
          quantity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          product: {
            id: productId,
            slug: productId,
            name: optimisticMeta.name,
            category: optimisticMeta.category || "Jewellery",
            price: optimisticMeta.price,
            image: optimisticMeta.image,
            inStock: true,
          },
          lineTotal: Number((optimisticMeta.price * quantity).toFixed(2)),
        });
      }

      const optimisticSubtotal = newItems.reduce((s, it) => s + it.lineTotal, 0);
      const isFreeShipping = optimisticSubtotal >= 100;
      const shipping = isFreeShipping ? 0 : 4.99;

      setCart({
        ...cart,
        items: newItems,
        totals: {
          ...cart.totals,
          itemCount: newItems.reduce((s, it) => s + it.quantity, 0),
          subtotal: Number(optimisticSubtotal.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          amountNeededForFreeShipping: Math.max(0, 100 - optimisticSubtotal),
          isFreeShipping,
          total: Number((optimisticSubtotal + shipping).toFixed(2)),
        },
      });
    }

    // Show right-side slider drawer immediately
    openCart();

    if (optimisticMeta) {
      setAddedNotification({
        name: optimisticMeta.name,
        image: optimisticMeta.image,
        price: optimisticMeta.price,
      });
      setTimeout(() => setAddedNotification(null), 3500);
    }

    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.cart) {
        setCart(data.cart);
        prevCartRef.current = data.cart;
        broadcastSync();
        return true;
      } else {
        // Rollback optimistic state
        setCart(prevCartRef.current);
        setError(data.error || "Unable to add piece to shopping bag.");
        return false;
      }
    } catch (err: any) {
      setCart(prevCartRef.current);
      setError("Network error. Please try again.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Update Quantity with Optimistic UI
  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
    if (quantity < 1 || quantity > 20) return false;
    setIsUpdating(true);
    setError(null);
    prevCartRef.current = cart;

    // Optimistic Update
    if (cart) {
      const newItems = cart.items.map((it) =>
        it.id === itemId
          ? {
              ...it,
              quantity,
              lineTotal: Number((it.product.price * quantity).toFixed(2)),
            }
          : it
      );

      const optimisticSubtotal = newItems.reduce((s, it) => s + it.lineTotal, 0);
      const isFreeShipping = optimisticSubtotal >= 100;
      const shipping = isFreeShipping ? 0 : 4.99;

      setCart({
        ...cart,
        items: newItems,
        totals: {
          ...cart.totals,
          itemCount: newItems.reduce((s, it) => s + it.quantity, 0),
          subtotal: Number(optimisticSubtotal.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          amountNeededForFreeShipping: Math.max(0, 100 - optimisticSubtotal),
          isFreeShipping,
          total: Number((optimisticSubtotal + shipping).toFixed(2)),
        },
      });
    }

    try {
      const res = await fetch("/api/cart/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.cart) {
        setCart(data.cart);
        prevCartRef.current = data.cart;
        broadcastSync();
        return true;
      } else {
        setCart(prevCartRef.current);
        setError(data.error || "Unable to update quantity.");
        return false;
      }
    } catch {
      setCart(prevCartRef.current);
      setError("Network error. Please check your connection.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Remove Item with Optimistic UI
  const removeItem = async (itemId: string): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    prevCartRef.current = cart;

    if (cart) {
      const newItems = cart.items.filter((it) => it.id !== itemId);
      const optimisticSubtotal = newItems.reduce((s, it) => s + it.lineTotal, 0);
      const isFreeShipping = optimisticSubtotal >= 100 || newItems.length === 0;
      const shipping = newItems.length === 0 ? 0 : isFreeShipping ? 0 : 4.99;

      setCart({
        ...cart,
        items: newItems,
        totals: {
          ...cart.totals,
          itemCount: newItems.reduce((s, it) => s + it.quantity, 0),
          subtotal: Number(optimisticSubtotal.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          amountNeededForFreeShipping: Math.max(0, 100 - optimisticSubtotal),
          isFreeShipping,
          total: Number((optimisticSubtotal + shipping).toFixed(2)),
        },
      });
    }

    try {
      const res = await fetch("/api/cart/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.cart) {
        setCart(data.cart);
        prevCartRef.current = data.cart;
        broadcastSync();
        return true;
      } else {
        setCart(prevCartRef.current);
        setError(data.error || "Unable to remove piece.");
        return false;
      }
    } catch {
      setCart(prevCartRef.current);
      setError("Network error.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Clear Cart
  const clearCart = async (): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    prevCartRef.current = cart;

    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success && data.cart) {
        setCart(data.cart);
        prevCartRef.current = data.cart;
        broadcastSync();
        return true;
      } else {
        setCart(prevCartRef.current);
        setError(data.error || "Unable to clear cart.");
        return false;
      }
    } catch {
      setCart(prevCartRef.current);
      setError("Network error.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart?.items || [],
        totals: cart?.totals || defaultTotals,
        itemCount: cart?.totals.itemCount || 0,
        isCartOpen,
        isLoading,
        isUpdating,
        error,
        addedNotification,
        openCart,
        closeCart,
        toggleCart,
        clearError,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
