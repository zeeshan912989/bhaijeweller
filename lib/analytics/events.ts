/**
 * Bhai Luxury Jewellery - Client Analytics & Discovery Event Tracker
 * Non-blocking, beacon-powered engagement tracking for Popularity & Recommendation engine.
 */

export type ProductEventType =
  | "PRODUCT_VIEW"
  | "IMAGE_ZOOM"
  | "ADD_TO_WISHLIST"
  | "REMOVE_WISHLIST"
  | "ADD_TO_CART"
  | "CHECKOUT_STARTED"
  | "PURCHASE_COMPLETED"
  | "PRODUCT_SHARED";

interface TrackEventPayload {
  productId?: string;
  productSlug: string;
  eventType: ProductEventType;
  userId?: string;
}

// In-memory debounce set to prevent duplicate event spam in the same session
const sessionDebounceSet = new Set<string>();

/**
 * Get or create a persistent anonymous session ID
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server-session";

  const STORAGE_KEY = "bhai_analytics_session_id_v1";
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = `bhai_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    try {
      localStorage.setItem(STORAGE_KEY, sessionId);
    } catch {
      // LocalStorage might be restricted
    }
  }

  return sessionId;
}

/**
 * Dispatch an analytics interaction event to the API route asynchronously
 */
export function trackProductEvent(payload: TrackEventPayload): void {
  if (typeof window === "undefined" || !payload.productSlug) return;

  const sessionId = getOrCreateSessionId();
  const debounceKey = `${sessionId}_${payload.productSlug}_${payload.eventType}`;

  // Throttle duplicate views & zooms within the same page load/session (15 min cooldown for identical event)
  if (payload.eventType === "PRODUCT_VIEW" || payload.eventType === "IMAGE_ZOOM") {
    if (sessionDebounceSet.has(debounceKey)) {
      return;
    }
    sessionDebounceSet.add(debounceKey);
    // Allow re-tracking after 15 minutes
    setTimeout(() => sessionDebounceSet.delete(debounceKey), 15 * 60 * 1000);
  }

  const body = JSON.stringify({
    productId: payload.productId,
    productSlug: payload.productSlug,
    eventType: payload.eventType,
    sessionId,
    userId: payload.userId,
    timestamp: new Date().toISOString(),
  });

  const endpoint = "/api/analytics/events";

  // Use sendBeacon for ultra-fast zero-latency delivery during navigation
  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (sent) return;
    } catch {
      // Fallback to fetch
    }
  }

  // Fallback to non-blocking fetch with keepalive
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Silently ignore analytics network failures
  });
}

/**
 * Helper shortcuts for common jewellery interactions
 */
export const Analytics = {
  viewProduct: (productSlug: string, productId?: string) =>
    trackProductEvent({ productSlug, productId, eventType: "PRODUCT_VIEW" }),

  zoomImage: (productSlug: string, productId?: string) =>
    trackProductEvent({ productSlug, productId, eventType: "IMAGE_ZOOM" }),

  addToWishlist: (productSlug: string, productId?: string) =>
    trackProductEvent({ productSlug, productId, eventType: "ADD_TO_WISHLIST" }),

  removeFromWishlist: (productSlug: string, productId?: string) =>
    trackProductEvent({ productSlug, productId, eventType: "REMOVE_WISHLIST" }),

  addToCart: (productSlug: string, productId?: string) =>
    trackProductEvent({ productSlug, productId, eventType: "ADD_TO_CART" }),

  startCheckout: (productSlug: string, productId?: string) =>
    trackProductEvent({ productSlug, productId, eventType: "CHECKOUT_STARTED" }),

  completePurchase: (productSlug: string, productId?: string) =>
    trackProductEvent({ productSlug, productId, eventType: "PURCHASE_COMPLETED" }),

  shareProduct: (productSlug: string, productId?: string) =>
    trackProductEvent({ productSlug, productId, eventType: "PRODUCT_SHARED" }),
};
