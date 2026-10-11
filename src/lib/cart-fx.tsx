"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCart } from "@/lib/cart-context";

const FLIGHT_DURATION = 850;

type FlyPayload = {
  slug: string;
  size?: string;
  quantity: number;
  fromEl: HTMLElement;
};

type CartFxContextValue = {
  cartIconRef: React.RefObject<HTMLAnchorElement | null>;
  flyToCart: (payload: FlyPayload) => void;
  pulseSignal: number;
};

const CartFxContext = createContext<CartFxContextValue | null>(null);

type Blob = {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

let nextBlobId = 0;

export function CartFxProvider({ children }: { children: React.ReactNode }) {
  const cartIconRef = useRef<HTMLAnchorElement | null>(null);
  const { addItem } = useCart();
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [pulseSignal, setPulseSignal] = useState(0);

  const flyToCart = useCallback(
    ({ slug, size, quantity, fromEl }: FlyPayload) => {
      const cartEl = cartIconRef.current;
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!cartEl || reduced) {
        addItem(slug, size, quantity);
        setPulseSignal((k) => k + 1);
        return;
      }

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = cartEl.getBoundingClientRect();
      const id = ++nextBlobId;

      setBlobs((prev) => [
        ...prev,
        {
          id,
          startX: fromRect.left + fromRect.width / 2,
          startY: fromRect.top + fromRect.height / 2,
          endX: toRect.left + toRect.width / 2,
          endY: toRect.top + toRect.height / 2,
        },
      ]);

      window.setTimeout(() => {
        addItem(slug, size, quantity);
        setPulseSignal((k) => k + 1);
        setBlobs((prev) => prev.filter((b) => b.id !== id));
      }, FLIGHT_DURATION + 60);
    },
    [addItem]
  );

  return (
    <CartFxContext.Provider value={{ cartIconRef, flyToCart, pulseSignal }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[200]">
        {blobs.map((b) => (
          <FlyingBlob key={b.id} {...b} />
        ))}
      </div>
    </CartFxContext.Provider>
  );
}

function FlyingBlob({ startX, startY, endX, endY }: Blob) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dx = endX - startX;
    const dy = endY - startY;
    const arc = -Math.max(120, Math.abs(dx) * 0.5);

    el.animate(
      [
        { transform: "translate(-50%, -50%) translate(0px, 0px) scale(1)", opacity: 1 },
        {
          transform: `translate(-50%, -50%) translate(${dx * 0.55}px, ${dy * 0.55 + arc}px) scale(0.85)`,
          opacity: 1,
          offset: 0.6,
        },
        {
          transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(0.2)`,
          opacity: 0.5,
        },
      ],
      { duration: FLIGHT_DURATION, easing: "cubic-bezier(0.3, 0, 0.2, 1)", fill: "forwards" }
    );
  }, [startX, startY, endX, endY]);

  return (
    <div
      ref={ref}
      className="absolute h-8 w-8 rounded-full bg-surface-foreground shadow-lg"
      style={{ left: startX, top: startY }}
    />
  );
}

export function useCartFx() {
  const ctx = useContext(CartFxContext);
  if (!ctx) throw new Error("useCartFx must be used within CartFxProvider");
  return ctx;
}
