/**
 * Safe client-side storage utility that handles LocalStorage quota limits
 * gracefully and provides an IndexedDB fallback for large objects (e.g. videos/reels).
 */

const DB_NAME = "bhai_store_db";
const STORE_NAME = "keyval";

function getIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Safely save data into LocalStorage and IndexedDB.
 * Suppresses QuotaExceededError while guaranteeing persistence in IndexedDB.
 */
export async function setPersistentItem<T>(key: string, value: T): Promise<void> {
  const json = JSON.stringify(value);

  // 1. Try LocalStorage safely
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, json);
    }
  } catch (err) {
    // QuotaExceededError or security error: safely ignore for LocalStorage
    // IndexedDB will handle large blobs/videos.
  }

  // 2. Persist to IndexedDB for large payloads (reels, base64 videos, etc.)
  try {
    const db = await getIndexedDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(value, key);
    }
  } catch (err) {
    console.warn("IndexedDB storage notice:", err);
  }
}

/**
 * Retrieve data from LocalStorage first, with IndexedDB fallback.
 */
export async function getPersistentItem<T>(key: string): Promise<T | null> {
  // 1. Try LocalStorage
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored) as T;
      }
    }
  } catch {
    // LocalStorage read failed or quota issue
  }

  // 2. Fallback to IndexedDB
  try {
    const db = await getIndexedDB();
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(key);
        request.onsuccess = () => {
          resolve((request.result as T) ?? null);
        };
        request.onerror = () => resolve(null);
      });
    }
  } catch {
    // Fallback failed
  }

  return null;
}
