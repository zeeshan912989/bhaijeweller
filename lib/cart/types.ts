import { z } from "zod";

// -------------------------------------------------------------
// Zod Schemas for Strict Input Validation & Zero Client Trust
// -------------------------------------------------------------

export const AddToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required").max(120),
  variantId: z.string().max(100).optional().default("Default"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(20, "Maximum 20 pieces per item allowed"),
});

export const UpdateCartItemSchema = z.object({
  itemId: z.string().min(1, "Item ID is required").max(120),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(20, "Maximum 20 pieces per item allowed"),
});

export const RemoveCartItemSchema = z.object({
  itemId: z.string().min(1, "Item ID is required").max(120),
});

export const MergeCartSchema = z.object({
  guestSessionId: z.string().min(1, "Guest session ID is required").max(120),
});

export const ApplyCouponSchema = z.object({
  code: z.string().trim().min(1).max(30).toUpperCase(),
});

// -------------------------------------------------------------
// TypeScript Domain Interfaces
// -------------------------------------------------------------

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof RemoveCartItemSchema>;
export type MergeCartInput = z.infer<typeof MergeCartSchema>;

export interface CartItemProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: CartItemProduct;
  lineTotal: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  isFreeShipping: boolean;
  estimatedTax: number;
  total: number;
}

export interface Cart {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  status: "active" | "merged" | "abandoned" | "converted";
  items: CartItem[];
  totals: CartTotals;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface CartApiResponse {
  success: boolean;
  cart: Cart;
  message?: string;
  error?: string;
}
