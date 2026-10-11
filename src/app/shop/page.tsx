import { ShopClient } from "@/components/ShopClient";
import { products } from "@/lib/products";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  return <ShopClient products={products} title="Shop All" initialQuery={params.q} />;
}
