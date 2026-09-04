import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { ALL_PRODUCTS, Product } from "@/data/products";
import {
  Cart,
  CartItem,
  CartItemProduct,
  CartTotals,
  AddToCartInput,
  UpdateCartItemInput,
} from "./types";
import crypto from "crypto";

// Fallback in-memory store for environments without active Supabase cart tables
interface StoredCart {
  id: string;
  userId?: string | null;
  sessionId?: string | null;
  status: "active" | "merged" | "abandoned" | "converted";
  items: Array<{
    id: string;
    productId: string;
    variantId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

const memoryCarts = new Map<string, StoredCart>();

const FREE_SHIPPING_THRESHOLD = 100.0;
const STANDARD_SHIPPING_FEE = 4.99;

/**
 * Server-side authoritative product resolver.
 * Always fetches live verified product data from Supabase DB or static fallback.
 * CLIENT-SUPPLIED PRICES OR NAMES ARE NEVER TRUSTED.
 */
export async function getVerifiedProduct(productIdOrSlug: string): Promise<CartItemProduct | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .or(`id.eq.${productIdOrSlug},slug.eq.${productIdOrSlug}`)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        category: data.category || "Jewellery",
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        image: data.primary_image || "/ear.jpeg",
        inStock: data.in_stock !== false,
      };
    }
  } catch {
    // Continue to fallback
  }

  // Fallback to local catalog
  const staticProduct = ALL_PRODUCTS.find(
    (p) => p.id === productIdOrSlug || p.slug === productIdOrSlug
  );

  if (staticProduct) {
    return {
      id: staticProduct.id,
      slug: staticProduct.slug,
      name: staticProduct.name,
      category: staticProduct.category,
      price: Number(staticProduct.price),
      originalPrice: staticProduct.originalPrice ? Number(staticProduct.originalPrice) : undefined,
      image: staticProduct.images.primary || "/ear.jpeg",
      inStock: staticProduct.inStock !== false,
    };
  }

  return null;
}

/**
 * Calculates server-authoritative totals for a list of items
 */
export function calculateTotals(items: CartItem[], discount: number = 0, discountCode?: string): CartTotals {
  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.lineTotal, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || itemCount === 0;
  const shipping = itemCount === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal - discount + shipping);

  return {
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    discountCode,
    shipping: Number(shipping.toFixed(2)),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountNeededForFreeShipping: Number(amountNeededForFreeShipping.toFixed(2)),
    isFreeShipping,
    estimatedTax: 0.0, // Included in UK VAT
    total: Number(total.toFixed(2)),
  };
}

/**
 * Resolves or creates a cart record for a given user or guest session
 */
export async function getOrCreateCart(
  userId?: string | null,
  sessionId?: string | null
): Promise<{ cart: Cart; isNew: boolean }> {
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  // 1. Try Supabase DB lookup
  try {
    let query = supabaseAdmin.from("carts").select("*, cart_items(*)").eq("status", "active");

    if (userId) {
      query = query.eq("user_id", userId);
    } else if (sessionId) {
      query = query.eq("session_id", sessionId);
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(1).single();

    if (!error && data) {
      const populatedItems: CartItem[] = [];
      const dbItems = data.cart_items || [];

      for (const item of dbItems) {
        const product = await getVerifiedProduct(item.product_id);
        if (product && product.inStock) {
          const lineTotal = Number((product.price * item.quantity).toFixed(2));
          populatedItems.push({
            id: item.id,
            cartId: data.id,
            productId: item.product_id,
            variantId: item.variant_id || "Default",
            quantity: item.quantity,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            product,
            lineTotal,
          });
        }
      }

      const totals = calculateTotals(populatedItems);

      return {
        cart: {
          id: data.id,
          userId: data.user_id,
          sessionId: data.session_id,
          status: data.status,
          items: populatedItems,
          totals,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          expiresAt: data.expires_at,
        },
        isNew: false,
      };
    }
  } catch {
    // Proceed to memory fallback
  }

  // 2. Check in-memory store
  const key = userId ? `user:${userId}` : sessionId ? `session:${sessionId}` : null;
  if (key && memoryCarts.has(key)) {
    const memCart = memoryCarts.get(key)!;
    const populatedItems: CartItem[] = [];

    for (const item of memCart.items) {
      const product = await getVerifiedProduct(item.productId);
      if (product && product.inStock) {
        const lineTotal = Number((product.price * item.quantity).toFixed(2));
        populatedItems.push({
          id: item.id,
          cartId: memCart.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          product,
          lineTotal,
        });
      }
    }

    const totals = calculateTotals(populatedItems);

    return {
      cart: {
        id: memCart.id,
        userId: memCart.userId,
        sessionId: memCart.sessionId,
        status: memCart.status,
        items: populatedItems,
        totals,
        createdAt: memCart.createdAt,
        updatedAt: memCart.updatedAt,
        expiresAt: memCart.expiresAt,
      },
      isNew: false,
    };
  }

  // 3. Create new cart
  const newCartId = crypto.randomUUID();

  // Try creating in Supabase DB
  try {
    await supabaseAdmin.from("carts").insert({
      id: newCartId,
      user_id: userId || null,
      session_id: sessionId || null,
      status: "active",
      created_at: now,
      updated_at: now,
      expires_at: expiresAt,
    });
  } catch {
    // Memory store fallback
  }

  const newStoredCart: StoredCart = {
    id: newCartId,
    userId: userId || null,
    sessionId: sessionId || null,
    status: "active",
    items: [],
    createdAt: now,
    updatedAt: now,
    expiresAt,
  };

  if (key) {
    memoryCarts.set(key, newStoredCart);
  }

  return {
    cart: {
      id: newCartId,
      userId: userId || null,
      sessionId: sessionId || null,
      status: "active",
      items: [],
      totals: calculateTotals([]),
      createdAt: now,
      updatedAt: now,
      expiresAt,
    },
    isNew: true,
  };
}

/**
 * Adds an item to the cart with server-side validation
 */
export async function addItemToCart(
  cartId: string,
  input: AddToCartInput,
  userId?: string | null,
  sessionId?: string | null
): Promise<Cart> {
  const product = await getVerifiedProduct(input.productId);
  if (!product) {
    throw new Error("Product not found or is no longer available.");
  }

  if (!product.inStock) {
    throw new Error("This piece is currently out of stock.");
  }

  const variantId = input.variantId || "Default";
  const now = new Date().toISOString();

  // Try DB upsert
  let dbSuccess = false;
  try {
    // Check if item already exists in this cart
    const { data: existing } = await supabaseAdmin
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId)
      .eq("product_id", input.productId)
      .eq("variant_id", variantId)
      .maybeSingle();

    if (existing) {
      const newQty = Math.min(20, existing.quantity + input.quantity);
      await supabaseAdmin
        .from("cart_items")
        .update({ quantity: newQty, updated_at: now })
        .eq("id", existing.id);
    } else {
      await supabaseAdmin.from("cart_items").insert({
        id: crypto.randomUUID(),
        cart_id: cartId,
        product_id: input.productId,
        variant_id: variantId,
        quantity: Math.min(20, input.quantity),
        created_at: now,
        updated_at: now,
      });
    }
    dbSuccess = true;
  } catch {
    dbSuccess = false;
  }

  // Memory fallback synchronization
  const key = userId ? `user:${userId}` : sessionId ? `session:${sessionId}` : null;
  if (key) {
    let mem = memoryCarts.get(key);
    if (!mem) {
      mem = {
        id: cartId,
        userId: userId || null,
        sessionId: sessionId || null,
        status: "active",
        items: [],
        createdAt: now,
        updatedAt: now,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      memoryCarts.set(key, mem);
    }

    const existingIdx = mem.items.findIndex(
      (it) => it.productId === input.productId && it.variantId === variantId
    );

    if (existingIdx >= 0) {
      mem.items[existingIdx].quantity = Math.min(
        20,
        mem.items[existingIdx].quantity + input.quantity
      );
      mem.items[existingIdx].updatedAt = now;
    } else {
      mem.items.push({
        id: crypto.randomUUID(),
        productId: input.productId,
        variantId,
        quantity: Math.min(20, input.quantity),
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  const { cart } = await getOrCreateCart(userId, sessionId);
  return cart;
}

/**
 * Updates item quantity with validation
 */
export async function updateItemQuantity(
  cartId: string,
  input: UpdateCartItemInput,
  userId?: string | null,
  sessionId?: string | null
): Promise<Cart> {
  const validatedQty = Math.max(1, Math.min(20, input.quantity));
  const now = new Date().toISOString();

  // Try DB update
  try {
    await supabaseAdmin
      .from("cart_items")
      .update({ quantity: validatedQty, updated_at: now })
      .eq("id", input.itemId)
      .eq("cart_id", cartId);
  } catch {
    // Memory fallback
  }

  // Memory fallback
  const key = userId ? `user:${userId}` : sessionId ? `session:${sessionId}` : null;
  if (key && memoryCarts.has(key)) {
    const mem = memoryCarts.get(key)!;
    const item = mem.items.find((it) => it.id === input.itemId);
    if (item) {
      item.quantity = validatedQty;
      item.updatedAt = now;
    }
  }

  const { cart } = await getOrCreateCart(userId, sessionId);
  return cart;
}

/**
 * Removes an item from the cart
 */
export async function removeItemFromCart(
  cartId: string,
  itemId: string,
  userId?: string | null,
  sessionId?: string | null
): Promise<Cart> {
  // Try DB deletion
  try {
    await supabaseAdmin
      .from("cart_items")
      .delete()
      .eq("id", itemId)
      .eq("cart_id", cartId);
  } catch {
    // Memory fallback
  }

  // Memory fallback
  const key = userId ? `user:${userId}` : sessionId ? `session:${sessionId}` : null;
  if (key && memoryCarts.has(key)) {
    const mem = memoryCarts.get(key)!;
    mem.items = mem.items.filter((it) => it.id !== itemId);
  }

  const { cart } = await getOrCreateCart(userId, sessionId);
  return cart;
}

/**
 * Clears all items in the cart
 */
export async function clearCart(
  cartId: string,
  userId?: string | null,
  sessionId?: string | null
): Promise<Cart> {
  try {
    await supabaseAdmin.from("cart_items").delete().eq("cart_id", cartId);
  } catch {
    // Memory fallback
  }

  const key = userId ? `user:${userId}` : sessionId ? `session:${sessionId}` : null;
  if (key && memoryCarts.has(key)) {
    const mem = memoryCarts.get(key)!;
    mem.items = [];
  }

  const { cart } = await getOrCreateCart(userId, sessionId);
  return cart;
}

/**
 * Merges a guest session cart into an authenticated user cart
 */
export async function mergeGuestCart(
  guestSessionId: string,
  userId: string
): Promise<Cart> {
  const { cart: guestCart } = await getOrCreateCart(null, guestSessionId);
  const { cart: userCart } = await getOrCreateCart(userId, null);

  if (guestCart.items.length === 0) {
    return userCart;
  }

  // Merge each guest item into user cart
  for (const item of guestCart.items) {
    await addItemToCart(
      userCart.id,
      {
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
      },
      userId,
      null
    );
  }

  // Clear or mark guest cart as merged
  await clearCart(guestCart.id, null, guestSessionId);
  try {
    await supabaseAdmin
      .from("carts")
      .update({ status: "merged" })
      .eq("session_id", guestSessionId);
  } catch {
    // Continue
  }

  const { cart: finalCart } = await getOrCreateCart(userId, null);
  return finalCart;
}
