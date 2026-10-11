"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { getProduct } from "./products";

export type CartLine = {
  slug: string;
  size?: string;
  quantity: number;
};

const STORAGE_KEY = "matte-black-cart";
const EMPTY_LINES: CartLine[] = [];

function lineKey(slug: string, size?: string) {
  return `${slug}__${size ?? ""}`;
}

// Module-level store so cart state can be read via useSyncExternalStore —
// this keeps SSR/hydration output stable (server always sees EMPTY_LINES)
// while avoiding a setState-in-effect pattern for loading localStorage.
let lines: CartLine[] = EMPTY_LINES;
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) lines = JSON.parse(raw);
  } catch {
    // ignore corrupted storage
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // storage unavailable, cart just won't persist
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  hydrate();
  return lines;
}

function getServerSnapshot() {
  return EMPTY_LINES;
}

function mutate(updater: (prev: CartLine[]) => CartLine[]) {
  lines = updater(lines);
  persist();
  emit();
}

function addItem(slug: string, size: string | undefined, quantity = 1) {
  mutate((prev) => {
    const key = lineKey(slug, size);
    const existing = prev.find((l) => lineKey(l.slug, l.size) === key);
    if (existing) {
      return prev.map((l) =>
        lineKey(l.slug, l.size) === key ? { ...l, quantity: l.quantity + quantity } : l
      );
    }
    return [...prev, { slug, size, quantity }];
  });
}

function removeItem(slug: string, size: string | undefined) {
  mutate((prev) => prev.filter((l) => lineKey(l.slug, l.size) !== lineKey(slug, size)));
}

function setQuantity(slug: string, size: string | undefined, quantity: number) {
  mutate((prev) => {
    if (quantity <= 0) return prev.filter((l) => lineKey(l.slug, l.size) !== lineKey(slug, size));
    return prev.map((l) =>
      lineKey(l.slug, l.size) === lineKey(slug, size) ? { ...l, quantity } : l
    );
  });
}

function clear() {
  mutate(() => []);
}

type CartContextValue = {
  lines: CartLine[];
  addItem: typeof addItem;
  removeItem: typeof removeItem;
  setQuantity: typeof setQuantity;
  clear: typeof clear;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const currentLines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const count = useMemo(
    () => currentLines.reduce((sum, l) => sum + l.quantity, 0),
    [currentLines]
  );

  const subtotal = useMemo(
    () =>
      currentLines.reduce((sum, l) => {
        const product = getProduct(l.slug);
        return sum + (product ? product.price * l.quantity : 0);
      }, 0),
    [currentLines]
  );

  const value = useMemo(
    () => ({ lines: currentLines, addItem, removeItem, setQuantity, clear, count, subtotal }),
    [currentLines, count, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
