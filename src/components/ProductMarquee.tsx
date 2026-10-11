"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";

const AUTO_SPEED = 40; // px/second
const DRAG_CLICK_THRESHOLD = 6; // px of movement before a pointerdown counts as a drag
const COAST_EASE = 3; // higher = snaps back to auto speed faster after a flick

export function ProductMarquee({ products }: { products: Product[] }) {
  const loop = [...products, ...products];
  const trackRef = useRef<HTMLDivElement>(null);

  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const directionRef = useRef<1 | -1>(-1);
  const velocityRef = useRef(-AUTO_SPEED);
  const coastingRef = useRef(false);

  const draggingRef = useRef(false);
  const didDragRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);

  const rafRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    if (trackRef.current) {
      halfWidthRef.current = trackRef.current.scrollWidth / 2;
    }
  }, []);

  const applyTransform = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
    }
  }, []);

  const wrap = useCallback(() => {
    const half = halfWidthRef.current;
    if (half <= 0) return;
    // Modulo rather than a single add/subtract: a throttled/backgrounded tab
    // can produce a huge dt in one frame, and a single correction isn't
    // enough to bring an overshoot of that size back into range.
    offsetRef.current = offsetRef.current % half;
    if (offsetRef.current > 0) offsetRef.current -= half;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    function frame(t: number) {
      if (lastFrameTimeRef.current == null) lastFrameTimeRef.current = t;
      // Clamp: a backgrounded/throttled tab can report a huge gap between
      // frames, which would otherwise fling the track far off-screen.
      const dt = Math.min((t - lastFrameTimeRef.current) / 1000, 0.1);
      lastFrameTimeRef.current = t;

      if (!draggingRef.current && !media.matches) {
        const target = directionRef.current * AUTO_SPEED;
        if (coastingRef.current) {
          velocityRef.current += (target - velocityRef.current) * Math.min(1, dt * COAST_EASE);
          if (Math.abs(velocityRef.current - target) < 1) {
            velocityRef.current = target;
            coastingRef.current = false;
          }
        } else {
          velocityRef.current = target;
        }
        offsetRef.current += velocityRef.current * dt;
        wrap();
        applyTransform();
      }
      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [wrap, applyTransform]);

  function onPointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    didDragRef.current = false;
    coastingRef.current = false;
    pointerIdRef.current = e.pointerId;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    // Pointer capture is deferred until we know this is a real drag (see
    // onPointerMove) — capturing eagerly on every press risks swallowing the
    // native click on a plain tap.
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (!didDragRef.current && Math.abs(dx) > DRAG_CLICK_THRESHOLD) {
      didDragRef.current = true;
      if (pointerIdRef.current != null) {
        trackRef.current?.setPointerCapture?.(pointerIdRef.current);
      }
    }

    offsetRef.current = dragStartOffsetRef.current + dx;
    wrap();
    applyTransform();

    const now = performance.now();
    const dt = (now - lastPointerTimeRef.current) / 1000;
    if (dt > 0.001) {
      velocityRef.current = (e.clientX - lastPointerXRef.current) / dt;
    }
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;
  }

  function endDrag() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (Math.abs(velocityRef.current) > 5) {
      directionRef.current = velocityRef.current > 0 ? 1 : -1;
    }
    coastingRef.current = true;
  }

  function onClickCapture(e: React.MouseEvent) {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <section className="py-24 border-t border-hairline overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-12">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-surface-foreground/70 mb-3">
          The Collection
        </p>
        <p className="font-heading text-3xl md:text-4xl">Every piece, in motion</p>
      </div>

      <div
        ref={trackRef}
        className="marquee-track flex gap-6 px-6 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {loop.map((product, i) => (
          <Link
            key={`${product.slug}-${i}`}
            href={`/shop/${product.slug}`}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="group block w-56 md:w-64 shrink-0"
          >
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-hairline mb-3"
              style={{ background: product.swatch }}
            >
              <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
              <p className="absolute top-3 left-3 font-body text-[10px] tracking-[0.2em] uppercase text-white/60">
                {product.category}
              </p>
            </div>
            <p className="font-heading text-sm group-hover:opacity-60 transition-opacity duration-200">
              {product.name}
            </p>
            <p className="font-body text-sm text-surface-foreground/60">${product.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
