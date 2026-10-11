"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getProduct } from "@/lib/products";

export default function CartPage() {
  const { lines, setQuantity, removeItem, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="font-heading text-2xl mb-3">Your bag is empty.</p>
        <p className="font-body text-sm text-surface-foreground/60 mb-8">
          Everything looks better in black. Go find something.
        </p>
        <Link
          href="/shop"
          className="inline-block rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase px-8 py-4 transition-transform duration-200 hover:scale-[1.02]"
        >
          Shop All
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <p className="font-heading text-3xl md:text-4xl mb-10">Your Bag</p>

        <div className="border-t border-hairline">
          {lines.map((line) => {
            const product = getProduct(line.slug);
            if (!product) return null;
            return (
              <div
                key={`${line.slug}-${line.size ?? ""}`}
                className="flex gap-6 py-6 border-b border-hairline"
              >
                <div
                  className="h-28 w-24 shrink-0 rounded-xl border border-hairline"
                  style={{ background: product.swatch }}
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="font-heading text-base hover:opacity-60 transition-opacity duration-200"
                      >
                        {product.name}
                      </Link>
                      {line.size && (
                        <p className="font-body text-xs text-surface-foreground/75 mt-1">
                          Size {line.size}
                        </p>
                      )}
                    </div>
                    <p className="font-body text-sm">
                      ${(product.price * line.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-hairline overflow-hidden">
                      <button
                        onClick={() => setQuantity(line.slug, line.size, line.quantity - 1)}
                        className="h-9 w-9 flex items-center justify-center cursor-pointer hover:bg-surface-foreground hover:text-surface transition-colors duration-200"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="font-body text-sm w-8 text-center">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(line.slug, line.size, line.quantity + 1)}
                        className="h-9 w-9 flex items-center justify-center cursor-pointer hover:bg-surface-foreground hover:text-surface transition-colors duration-200"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(line.slug, line.size)}
                      className="font-body text-xs tracking-widest uppercase text-surface-foreground/75 hover:text-surface-foreground transition-colors duration-200 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="font-body text-sm text-surface-foreground/60">Subtotal</p>
          <p className="font-heading text-xl">${subtotal.toFixed(2)}</p>
        </div>
        <p className="font-body text-xs text-surface-foreground/70 mt-1">
          Shipping and taxes calculated at checkout.
        </p>

        <Link
          href="/checkout"
          className="mt-8 block text-center rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase py-4 transition-transform duration-200 hover:scale-[1.01]"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
