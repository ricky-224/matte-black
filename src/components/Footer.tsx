"use client";

import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="border-t border-hairline mt-24">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <p className="font-heading text-lg tracking-[0.2em] metal-text font-bold mb-4">
            MATTE BLACK
          </p>
          <p className="font-body text-sm text-surface-foreground/60 max-w-xs">
            Everything, in black. Clothing, accessories, and gadgets — one color, done right.
          </p>
        </div>

        <div className="font-body text-sm">
          <p className="tracking-widest uppercase text-surface-foreground/70 mb-4">Shop</p>
          <ul className="space-y-2">
            <li><Link href="/shop/category/clothing" className="hover:opacity-60 transition-opacity duration-200">Clothing</Link></li>
            <li><Link href="/shop/category/accessories" className="hover:opacity-60 transition-opacity duration-200">Accessories</Link></li>
            <li><Link href="/shop/category/gadgets" className="hover:opacity-60 transition-opacity duration-200">Gadgets</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-body tracking-widest uppercase text-surface-foreground/70 mb-4 text-sm">
            Stay in black
          </p>
          {submitted ? (
            <p className="font-body text-sm">You&apos;re on the list.</p>
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="bg-transparent border-b border-hairline py-2 font-body text-sm outline-none placeholder:text-surface-foreground/40 focus-visible:border-surface-foreground"
              />
              <button
                type="submit"
                className="rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase py-3 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
              >
                Join the list
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-hairline">
        <p className="mx-auto max-w-7xl px-6 py-6 font-body text-xs text-surface-foreground/70 tracking-wide">
          © {new Date().getFullYear()} Matte Black. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
