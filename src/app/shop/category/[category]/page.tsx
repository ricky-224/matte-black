import { notFound } from "next/navigation";
import { ShopClient } from "@/components/ShopClient";
import { products } from "@/lib/products";

const SLUG_TO_CATEGORY = {
  clothing: "Clothing",
  accessories: "Accessories",
  gadgets: "Gadgets",
} as const;

type CategorySlug = keyof typeof SLUG_TO_CATEGORY;

export function generateStaticParams() {
  return Object.keys(SLUG_TO_CATEGORY).map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryName = SLUG_TO_CATEGORY[category as CategorySlug];
  if (!categoryName) notFound();

  const filtered = products.filter((p) => p.category === categoryName);

  return <ShopClient products={filtered} title={categoryName} categoryActive={categoryName} />;
}
