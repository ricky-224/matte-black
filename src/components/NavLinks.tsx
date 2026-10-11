"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const NAV_ITEMS = [
  { label: "Shop All", href: "/shop" },
  { label: "Clothing", href: "/shop/category/clothing" },
  { label: "Accessories", href: "/shop/category/accessories" },
  { label: "Gadgets", href: "/shop/category/gadgets" },
] as const;

function forceReflow(el: HTMLElement) {
  return el.offsetWidth;
}

function computeActiveIndex(pathname: string) {
  for (let i = NAV_ITEMS.length - 1; i > 0; i--) {
    if (pathname.startsWith(NAV_ITEMS[i].href)) return i;
  }
  return pathname.startsWith("/shop") ? 0 : -1;
}

export function NavLinks({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const activeIndex = computeActiveIndex(pathname);

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [rect, setRect] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    function measure() {
      const el = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
      setRect(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  useLayoutEffect(() => {
    const el = underlineRef.current;
    if (!el) return;

    if (!rect) {
      el.style.transition = "opacity 200ms ease-out";
      el.style.opacity = "0";
      return;
    }

    // Snap to the new position/width at zero scale first (no transition),
    // then animate the scale up — this is what makes it "grow from the
    // middle outward" rather than slide over from the old spot.
    el.style.transition = "none";
    el.style.left = `${rect.left}px`;
    el.style.width = `${rect.width}px`;
    el.style.opacity = "1";
    el.style.transform = "scaleX(0)";
    forceReflow(el);
    el.style.transition = "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = "scaleX(1)";
  }, [rect]);

  return (
    <nav className={`relative flex items-center gap-8 font-body text-sm tracking-wide ${className}`}>
      <span
        ref={underlineRef}
        aria-hidden
        className="pointer-events-none absolute bottom-[-10px] h-[2px] origin-center rounded-full bg-surface-foreground opacity-0"
      />
      {NAV_ITEMS.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          className={`transition-colors duration-300 ${
            i === activeIndex
              ? "text-surface-foreground font-medium"
              : "text-surface-foreground/75 hover:text-surface-foreground"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
