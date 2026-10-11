import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ProductMarquee } from "@/components/ProductMarquee";
import { products, getProduct } from "@/lib/products";

const CATEGORY_TILES = [
  {
    label: "Clothing",
    href: "/shop/category/clothing",
    background: "repeating-linear-gradient(45deg, #050505 0px, #050505 10px, #161616 10px, #161616 20px)",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <path
          d="M13 5.5a2 2 0 0 1 2 2c2.5 0 6.5 1.6 6.5 4.2 0 .8-.6 1.2-1.3.9L16 10.8v8.7H10v-8.7l-4.2 1.8c-.7.3-1.3-.1-1.3-.9 0-2.6 4-4.2 6.5-4.2a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Accessories",
    href: "/shop/category/accessories",
    background: "linear-gradient(115deg, #050505 0%, #232323 45%, #050505 100%)",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <circle cx="13" cy="13" r="7.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13 9v4.2l2.6 2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11 4.5h4M11 21.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Gadgets",
    href: "/shop/category/gadgets",
    background:
      "radial-gradient(circle at 20% 20%, #1a1a1a 1.5px, transparent 1.5px), radial-gradient(circle at 60% 60%, #1a1a1a 1.5px, transparent 1.5px), #050505",
    backgroundSize: "24px 24px, 24px 24px, auto",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
        <path d="M14.5 3 6 14.5h6L11.5 23 20 11.5h-6L14.5 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const PICK_SLUGS = ["obsidian-hoodie", "titanium-band-watch", "carbon-power-bank"] as const;
const PICK_NOTES: Record<(typeof PICK_SLUGS)[number], string> = {
  "obsidian-hoodie": "The one piece everyone asks about first.",
  "titanium-band-watch": "Blacked-out titanium, not painted-on.",
  "carbon-power-bank": "Carries a full charge and the aesthetic.",
};

export default function Home() {
  const picks = PICK_SLUGS.map((slug) => getProduct(slug)).filter((p) => p !== undefined);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
        <Image
          src="/images/hero-black-sand.webp"
          alt="A black volcanic sand beach at dusk, mirror-still water reflecting a charcoal sky"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <p className="font-display text-5xl md:text-8xl tracking-wide mb-4 text-white">
              MATTE BLACK
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-white/80 mb-10">
              Everything, in matte.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <Link
              href="/shop"
              className="inline-block rounded-full bg-white text-black font-body text-sm tracking-widest uppercase px-8 py-4 transition-transform duration-200 hover:scale-[1.04]"
            >
              Shop the Drop
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Statement / manifesto — inverted section */}
      <section className="invert-section py-28 px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-2xl md:text-4xl leading-snug">
            One color. No compromises. Every piece in the drop is engineered, dyed, and
            finished in a single shade — because black isn&apos;t the absence of color,
            it&apos;s a material to be studied.
          </p>
        </Reveal>
      </section>

      {/* Category teasers — each with its own texture and mark, not an identical tile */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-surface-foreground/70 mb-3 text-center">
              The Drop
            </p>
            <p className="font-heading text-3xl md:text-4xl text-center mb-16">
              Shop by category
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-surface-foreground/10">
            {CATEGORY_TILES.map((tile, i) => (
              <Reveal key={tile.label} delay={i * 100}>
                <Link
                  href={tile.href}
                  className="group relative block h-80 rounded-2xl overflow-hidden"
                >
                  <div
                    className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    style={{ background: tile.background, backgroundSize: tile.backgroundSize }}
                  />
                  <div className="relative h-full flex flex-col justify-between p-6">
                    <span className="text-white/80">{tile.icon}</span>
                    <p className="font-heading text-xl tracking-wide text-white">{tile.label}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite product gallery — the ambient, browse-everything section */}
      <ProductMarquee products={products} />

      {/* Featured Picks — a deliberate, curated spotlight (one per category), distinct from the marquee's ambient sweep */}
      <section className="py-24 px-6 border-t border-hairline">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-body text-xs tracking-[0.3em] uppercase text-surface-foreground/70 mb-3">
                  Editor&apos;s Pick
                </p>
                <p className="font-heading text-3xl md:text-4xl">One from every category</p>
              </div>
              <Link
                href="/shop"
                className="font-body text-sm tracking-widest uppercase hover:opacity-60 transition-opacity duration-200"
              >
                View all →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {picks.map((product, i) => (
              <Reveal key={product.slug} delay={i * 100}>
                <Link href={`/shop/${product.slug}`} className="group block">
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-hairline mb-4"
                    style={{ background: product.swatch }}
                  >
                    <div className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
                    <p className="absolute top-4 left-4 font-body text-[11px] tracking-[0.2em] uppercase text-white/70">
                      {product.category}
                    </p>
                  </div>
                  <p className="font-heading text-xl mb-1 group-hover:opacity-60 transition-opacity duration-200">
                    {product.name}
                  </p>
                  <p className="font-body text-sm text-surface-foreground/70 mb-2">
                    {PICK_NOTES[product.slug as (typeof PICK_SLUGS)[number]]}
                  </p>
                  <p className="font-body text-sm">${product.price}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
