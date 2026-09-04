import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/actions/account-actions";

export interface UserProfile {
  id: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  email: string;
  createdAt: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
}

export interface UserOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: Array<{
    id?: string;
    productId?: string;
    slug?: string;
    name: string;
    price: number;
    quantity: number;
    metal?: string;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
}

/**
 * Fetches profile metadata for authenticated user
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    fullName: profile?.full_name || user.user_metadata?.full_name || "Valued Client",
    phone: profile?.phone || user.user_metadata?.phone || null,
    avatarUrl: profile?.avatar_url || null,
    email: user.email || "",
    createdAt: user.created_at || new Date().toISOString(),
  };
}

/**
 * Fetches all addresses for the authenticated user
 */
export async function getUserAddresses(): Promise<UserAddress[]> {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    phone: row.phone,
    addressLine1: row.address_line1,
    addressLine2: row.address_line2,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at,
  }));
}

/**
 * Fetches orders belonging strictly to the authenticated user
 */
export async function getUserOrders(): Promise<UserOrder[]> {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  const supabase = await createClient();

  // Match orders by user_id OR email
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .or(`user_id.eq.${user.id},customer_email.eq.${user.email}`)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    shippingAddress: row.shipping_address,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    paymentStatus: row.payment_status || "Paid",
    fulfillmentStatus: row.fulfillment_status || "Processing",
    createdAt: row.created_at,
  }));
}

/**
 * Fetches a single order with strict IDOR ownership verification
 */
export async function getOrderById(orderId: string): Promise<UserOrder | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .or(`id.eq.${orderId},order_number.eq.${orderId}`)
    .single();

  if (error || !data) return null;

  // STRICT IDOR DEFENSE: Verify order belongs to the authenticated user
  const isOwner =
    data.user_id === user.id ||
    (data.customer_email && user.email && data.customer_email.toLowerCase() === user.email.toLowerCase());

  if (!isOwner) {
    console.warn(`Security Warning: IDOR access attempt on order ${orderId} by user ${user.id}`);
    return null;
  }

  return {
    id: data.id,
    orderNumber: data.order_number,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    shippingAddress: data.shipping_address,
    items: Array.isArray(data.items) ? data.items : [],
    subtotal: Number(data.subtotal),
    shipping: Number(data.shipping),
    total: Number(data.total),
    paymentStatus: data.payment_status || "Paid",
    fulfillmentStatus: data.fulfillment_status || "Processing",
    createdAt: data.created_at,
  };
}
