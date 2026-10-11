import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-hairline mb-3"
        style={{ background: product.swatch }}
      >
        <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
        <p className="absolute top-3 left-3 font-body text-[10px] tracking-[0.2em] uppercase text-white/60">
          {product.category}
        </p>
      </div>
      <p className="font-heading text-sm md:text-base group-hover:opacity-60 transition-opacity duration-200">
        {product.name}
      </p>
      <p className="font-body text-sm text-surface-foreground/60">${product.price}</p>
    </Link>
  );
}
