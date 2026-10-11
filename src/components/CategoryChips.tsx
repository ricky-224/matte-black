import Link from "next/link";

const CHIPS = [
  { label: "All", href: "/shop" },
  { label: "Clothing", href: "/shop/category/clothing" },
  { label: "Accessories", href: "/shop/category/accessories" },
  { label: "Gadgets", href: "/shop/category/gadgets" },
];

export function CategoryChips({ active }: { active?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map((chip) => {
        const isActive = active ? chip.label === active : chip.label === "All";
        return (
          <Link
            key={chip.href}
            href={chip.href}
            className={`font-body text-xs tracking-widest uppercase px-4 py-2 rounded-full border transition-colors duration-200 ${
              isActive
                ? "bg-surface-foreground text-surface border-surface-foreground"
                : "border-hairline hover:bg-surface-foreground hover:text-surface"
            }`}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
