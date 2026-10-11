export type Product = {
  slug: string;
  name: string;
  category: "Clothing" | "Accessories" | "Gadgets";
  price: number;
  description: string;
  material: string;
  sizes?: string[];
  swatch: string; // CSS gradient/texture used as a placeholder until real product photography is added
};

export const products: Product[] = [
  {
    slug: "obsidian-hoodie",
    name: "Obsidian Hoodie",
    category: "Clothing",
    price: 88,
    description:
      "A heavyweight matte-black hoodie in brushed cotton fleece. Boxy fit, dropped shoulder, no branding.",
    material: "420gsm cotton fleece",
    sizes: ["XS", "S", "M", "L", "XL"],
    swatch: "linear-gradient(160deg, #0a0a0a, #1c1c1c 55%, #050505)",
  },
  {
    slug: "void-tee",
    name: "Void Tee",
    category: "Clothing",
    price: 42,
    description:
      "Heavyweight black t-shirt, garment-dyed for a soft matte finish that resists fading.",
    material: "240gsm combed cotton",
    sizes: ["XS", "S", "M", "L", "XL"],
    swatch: "linear-gradient(160deg, #050505, #161616 60%, #000000)",
  },
  {
    slug: "carbon-cargo-pants",
    name: "Carbon Cargo Pants",
    category: "Clothing",
    price: 96,
    description: "Tapered cargo pants in ripstop nylon with matte hardware throughout.",
    material: "Ripstop nylon blend",
    sizes: ["28", "30", "32", "34", "36"],
    swatch: "linear-gradient(160deg, #0d0d0d, #1a1a1a 50%, #060606)",
  },
  {
    slug: "graphite-leather-wallet",
    name: "Graphite Leather Wallet",
    category: "Accessories",
    price: 58,
    description: "Full-grain leather wallet, matte black dye, brushed steel snap closure.",
    material: "Full-grain leather / brushed steel",
    swatch: "linear-gradient(135deg, #141414, #2a2a2a 45%, #0a0a0a)",
  },
  {
    slug: "onyx-crossbody-bag",
    name: "Onyx Crossbody Bag",
    category: "Accessories",
    price: 74,
    description: "Water-resistant canvas crossbody with matte black webbing straps.",
    material: "Coated canvas / webbing",
    swatch: "linear-gradient(135deg, #0c0c0c, #232323 50%, #050505)",
  },
  {
    slug: "titanium-band-watch",
    name: "Titanium Band Watch",
    category: "Accessories",
    price: 149,
    description: "Blacked-out titanium case and band, sapphire crystal, brushed-metal bezel.",
    material: "DLC-coated titanium",
    swatch: "linear-gradient(135deg, #1a1a1a, #3a3a3a 40%, #0a0a0a)",
  },
  {
    slug: "matte-wireless-earbuds",
    name: "Matte Wireless Earbuds",
    category: "Gadgets",
    price: 119,
    description: "Noise-isolating earbuds in a soft-touch matte black finish, graphite charging case.",
    material: "Soft-touch polymer",
    swatch: "linear-gradient(160deg, #0a0a0a, #1e1e1e 55%, #000000)",
  },
  {
    slug: "carbon-power-bank",
    name: "Carbon Power Bank",
    category: "Gadgets",
    price: 54,
    description: "10,000mAh power bank with a brushed carbon-fiber-textured matte shell.",
    material: "Carbon-fiber composite",
    swatch: "linear-gradient(160deg, #111111, #2c2c2c 50%, #0a0a0a)",
  },
  {
    slug: "obsidian-desk-lamp",
    name: "Obsidian Desk Lamp",
    category: "Gadgets",
    price: 89,
    description: "Matte black aluminum desk lamp with a warm-to-cool dimmable LED and touch base.",
    material: "Anodized aluminum",
    swatch: "linear-gradient(160deg, #0d0d0d, #202020 55%, #050505)",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const categories = ["Clothing", "Accessories", "Gadgets"] as const;
