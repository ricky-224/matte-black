"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useCartFx } from "@/lib/cart-fx";
import { useAccount } from "@/lib/account-context";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { NavLinks } from "@/components/NavLinks";

export function Nav() {
  const { count } = useCart();
  const { cartIconRef, pulseSignal } = useCartFx();
  const { user } = useAccount();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (pulseSignal === 0) return;
    const el = cartIconRef.current;
    if (!el) return;
    el.classList.add("animate-cart-pulse");
    const t = setTimeout(() => el.classList.remove("animate-cart-pulse"), 450);
    return () => clearTimeout(t);
  }, [pulseSignal, cartIconRef]);

  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-hairline">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-4">
        <button
          className="md:hidden h-11 w-11 rounded-full flex items-center justify-center hairline border cursor-pointer transition-colors duration-200 hover:bg-surface-foreground hover:text-surface"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
              <path d="M0 1H18M0 6H18M0 11H18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </button>

        <Link
          href="/"
          className="font-heading text-xl tracking-[0.2em] metal-text font-bold"
        >
          MATTE BLACK
        </Link>

        <NavLinks className="hidden md:flex" />

        <div className="flex items-center gap-2">
          <AnimatedThemeToggler
            variant="circle"
            fromCenter
            duration={500}
            className="h-11 w-11 rounded-full flex items-center justify-center hairline border cursor-pointer transition-colors duration-200 hover:bg-surface-foreground hover:text-surface [&_svg]:h-4 [&_svg]:w-4"
          />
          <button
            className="h-11 w-11 rounded-full flex items-center justify-center hairline border cursor-pointer transition-colors duration-200 hover:bg-surface-foreground hover:text-surface"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L15 15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <Link
            href="/account"
            className="relative h-11 w-11 rounded-full flex items-center justify-center hairline border cursor-pointer transition-colors duration-200 hover:bg-surface-foreground hover:text-surface"
            aria-label={user ? `Account, signed in as ${user.email}` : "Sign in"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            {user && (
              <span
                className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-surface-foreground"
                aria-hidden
              />
            )}
          </Link>
          <Link
            ref={cartIconRef}
            href="/cart"
            className="h-11 min-w-11 px-3 rounded-full flex items-center justify-center gap-1.5 hairline border cursor-pointer transition-colors duration-200 hover:bg-surface-foreground hover:text-surface"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="currentColor" strokeWidth="1.3" />
              <rect x="1.5" y="5" width="11" height="9.5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <span className="font-body text-sm">{count}</span>
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-hairline">
          <form
            className="mx-auto max-w-7xl px-6 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/shop?q=${encodeURIComponent(query)}`);
              setSearchOpen(false);
            }}
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full bg-transparent border-b border-hairline py-2 font-body text-lg outline-none placeholder:text-surface-foreground/40 focus-visible:border-surface-foreground"
            />
          </form>
        </div>
      )}

      {menuOpen && (
        <nav className="md:hidden border-t border-hairline flex flex-col font-body text-sm tracking-wide">
          {[
            ["Shop All", "/shop"],
            ["Clothing", "/shop/category/clothing"],
            ["Accessories", "/shop/category/accessories"],
            ["Gadgets", "/shop/category/gadgets"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="px-6 py-4 border-b border-hairline hover:bg-surface-foreground hover:text-surface transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
