"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryChips } from "@/components/CategoryChips";
import type { Product } from "@/lib/products";

type SortKey = "featured" | "price-asc" | "price-desc";

export function ShopClient({
  products,
  title,
  categoryActive,
  initialQuery,
}: {
  products: Product[];
  title: string;
  categoryActive?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    let list = products;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, query, sort]);

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <p className="font-heading text-3xl md:text-4xl mb-8">{title}</p>

        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-10 pb-6 border-b border-hairline">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full md:w-64 bg-transparent border-b border-hairline py-2 font-body text-sm outline-none placeholder:text-surface-foreground/40 focus-visible:border-surface-foreground"
          />

          <CategoryChips active={categoryActive} />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="md:ml-auto rounded-lg bg-surface border border-hairline px-3 py-2 font-body text-xs tracking-widest uppercase outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-heading text-xl mb-2">Nothing here yet.</p>
            <p className="font-body text-sm text-surface-foreground/60">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
