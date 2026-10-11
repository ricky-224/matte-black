"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { products } from "@/lib/products";
import { useCartFx } from "@/lib/cart-fx";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

const SIZE_GUIDE_CLOTHING = [
  { size: "XS", chest: "34–36", waist: "27–29", length: "26" },
  { size: "S", chest: "37–39", waist: "30–32", length: "27" },
  { size: "M", chest: "40–42", waist: "33–35", length: "28" },
  { size: "L", chest: "43–45", waist: "36–38", length: "29" },
  { size: "XL", chest: "46–48", waist: "39–41", length: "30" },
];

const SIZE_GUIDE_PANTS = [
  { size: "28", waist: "28", inseam: "30" },
  { size: "30", waist: "30", inseam: "30" },
  { size: "32", waist: "32", inseam: "31" },
  { size: "34", waist: "34", inseam: "31" },
  { size: "36", waist: "36", inseam: "32" },
];

export function ProductDetailClient({ product }: { product: Product }) {
  const { flyToCart } = useCartFx();
  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);
  const hasSizes = Boolean(product.sizes?.length);
  const isPants = product.sizes?.[0] === "28";
  const [size, setSize] = useState<string | undefined>(
    hasSizes ? undefined : undefined
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);

  function handleAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
    if (hasSizes && !size) {
      setError(true);
      return;
    }
    setError(false);
    flyToCart({
      slug: product.slug,
      size,
      quantity: 1,
      fromEl: e.currentTarget,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/shop"
          className="font-body text-sm text-surface-foreground/60 hover:text-surface-foreground transition-colors duration-200"
        >
          ← Back to shop
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div
            className="aspect-square rounded-2xl border border-hairline"
            style={{ background: product.swatch }}
          />

          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-surface-foreground/70 mb-2">
              {product.category}
            </p>
            <h1 className="font-heading text-3xl md:text-4xl mb-4">{product.name}</h1>
            <p className="font-body text-2xl mb-6">${product.price}</p>
            <p className="font-body text-sm text-surface-foreground/70 leading-relaxed mb-6">
              {product.description}
            </p>
            <p className="font-body text-xs tracking-widest uppercase text-surface-foreground/70 mb-8">
              {product.material}
            </p>

            {hasSizes && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-body text-xs tracking-widest uppercase text-surface-foreground/60">
                    Size
                  </p>
                  <button
                    onClick={() => setSizeGuideOpen((v) => !v)}
                    className="font-body text-xs tracking-widest uppercase underline underline-offset-4 text-surface-foreground/60 hover:text-surface-foreground transition-colors duration-200 cursor-pointer"
                  >
                    Size guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes!.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSize(s);
                        setError(false);
                      }}
                      className={`h-11 min-w-11 px-3 rounded-lg font-body text-sm border cursor-pointer transition-colors duration-200 ${
                        size === s
                          ? "bg-surface-foreground text-surface border-surface-foreground"
                          : "border-hairline hover:bg-surface-foreground hover:text-surface"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {error && (
                  <p className="font-body text-xs text-surface-foreground mt-2 border-l-2 border-surface-foreground pl-2">
                    Select a size before adding to bag.
                  </p>
                )}

                {sizeGuideOpen && (
                  <div className="mt-4 rounded-xl border border-hairline overflow-x-auto">
                    <table className="w-full text-left font-body text-xs">
                      <thead>
                        <tr className="border-b border-hairline text-surface-foreground/70 uppercase tracking-widest">
                          <th className="p-3">Size</th>
                          {isPants ? (
                            <>
                              <th className="p-3">Waist (in)</th>
                              <th className="p-3">Inseam (in)</th>
                            </>
                          ) : (
                            <>
                              <th className="p-3">Chest (in)</th>
                              <th className="p-3">Waist (in)</th>
                              <th className="p-3">Length (in)</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {(isPants ? SIZE_GUIDE_PANTS : SIZE_GUIDE_CLOTHING).map((row) => (
                          <tr key={row.size} className="border-b border-hairline last:border-0">
                            <td className="p-3">{row.size}</td>
                            {isPants && "inseam" in row ? (
                              <>
                                <td className="p-3">{row.waist}</td>
                                <td className="p-3">{row.inseam}</td>
                              </>
                            ) : (
                              <>
                                <td className="p-3">{"chest" in row ? row.chest : "—"}</td>
                                <td className="p-3">{row.waist}</td>
                                <td className="p-3">{"length" in row ? row.length : "—"}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-full font-body text-sm tracking-widest uppercase cursor-pointer transition-all duration-200 ${
                added ? "bg-surface-foreground/20 border border-surface-foreground" : "bg-surface-foreground text-surface hover:scale-[1.01]"
              }`}
            >
              {added ? "Added to bag" : "Add to bag"}
            </button>
          </div>
        </div>

        {related.length > 0 && (
          <Reveal className="mt-24 pt-16 border-t border-hairline">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-surface-foreground/70 mb-3">
              You might also like
            </p>
            <p className="font-heading text-2xl md:text-3xl mb-10">
              More in {product.category}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
