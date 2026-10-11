"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useAccount, type Address } from "@/lib/account-context";
import { getProduct } from "@/lib/products";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { user, profile, placeOrder } = useAccount();
  const [submitted, setSubmitted] = useState(false);
  const [savedOrderNumber, setSavedOrderNumber] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (lines.length === 0 && !submitted) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="font-heading text-2xl mb-3">Your bag is empty.</p>
        <Link
          href="/shop"
          className="inline-block rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase px-8 py-4 mt-6 transition-transform duration-200 hover:scale-[1.02]"
        >
          Shop All
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="font-heading text-2xl mb-3">Payment isn&apos;t connected yet.</p>
        <p className="font-body text-sm text-surface-foreground/60 max-w-md mx-auto">
          This is a preview of the checkout flow — your details weren&apos;t sent anywhere.
          Once payments are wired up, this step will run the real order.
        </p>
        {savedOrderNumber ? (
          <p className="font-body text-sm text-surface-foreground/60 max-w-md mx-auto mt-4">
            We did save {savedOrderNumber} to your order history so you can see how that part
            works.
          </p>
        ) : null}
        <div className="flex items-center justify-center gap-6 mt-8">
          {savedOrderNumber && (
            <Link
              href="/account"
              className="font-body text-sm tracking-widest uppercase underline underline-offset-4 text-surface-foreground/60 hover:text-surface-foreground transition-colors duration-200"
            >
              View order
            </Link>
          )}
          <Link
            href="/cart"
            className="font-body text-sm tracking-widest uppercase underline underline-offset-4 text-surface-foreground/60 hover:text-surface-foreground transition-colors duration-200"
          >
            Back to bag
          </Link>
        </div>
      </div>
    );
  }

  const savedAddress = profile?.address as unknown as Address | null;

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-16">
        <form
          key={user?.email ?? "guest"}
          className="flex flex-col gap-10"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setOrderError(null);
            const data = new FormData(e.currentTarget);
            const address: Address = {
              firstName: String(data.get("firstName") ?? ""),
              lastName: String(data.get("lastName") ?? ""),
              address: String(data.get("address") ?? ""),
              city: String(data.get("city") ?? ""),
              postalCode: String(data.get("postalCode") ?? ""),
              country: String(data.get("country") ?? ""),
            };

            if (user) {
              const orderLines = lines
                .map((line) => {
                  const product = getProduct(line.slug);
                  if (!product) return null;
                  return {
                    slug: line.slug,
                    name: product.name,
                    size: line.size,
                    quantity: line.quantity,
                    price: product.price,
                  };
                })
                .filter((l) => l !== null);

              const result = await placeOrder({ subtotal, address, lines: orderLines });
              setSubmitting(false);
              if (!result.ok) {
                setOrderError(result.error);
                return;
              }
              setSavedOrderNumber(result.orderNumber);
              clear();

              // Fire-and-forget: a failed confirmation email shouldn't block checkout,
              // the order is already saved either way.
              fetch("/api/emails/order-confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  to: user.email,
                  orderNumber: result.orderNumber,
                  lines: orderLines,
                  subtotal,
                  address,
                }),
              }).catch((err) => console.error("Order confirmation email failed:", err));
            } else {
              setSubmitting(false);
            }

            setSubmitted(true);
          }}
        >
          <div>
            <p className="font-heading text-xl mb-5">Contact</p>
            <div className="grid grid-cols-1 gap-4">
              <Field
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={user?.email}
              />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                helper="For delivery updates only."
                defaultValue={profile?.phone ?? undefined}
              />
            </div>
          </div>

          <div>
            <p className="font-heading text-xl mb-5">Shipping address</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="First name"
                name="firstName"
                required
                autoComplete="given-name"
                defaultValue={savedAddress?.firstName}
              />
              <Field
                label="Last name"
                name="lastName"
                required
                autoComplete="family-name"
                defaultValue={savedAddress?.lastName}
              />
              <div className="md:col-span-2">
                <Field
                  label="Address"
                  name="address"
                  required
                  autoComplete="street-address"
                  defaultValue={savedAddress?.address}
                />
              </div>
              <Field
                label="City"
                name="city"
                required
                autoComplete="address-level2"
                defaultValue={savedAddress?.city}
              />
              <Field
                label="Postal code"
                name="postalCode"
                required
                autoComplete="postal-code"
                defaultValue={savedAddress?.postalCode}
              />
              <div className="md:col-span-2">
                <Field
                  label="Country"
                  name="country"
                  required
                  autoComplete="country-name"
                  defaultValue={savedAddress?.country}
                />
              </div>
            </div>
          </div>

          {!user && (
            <p className="font-body text-xs text-surface-foreground/70">
              <Link href="/account" className="underline underline-offset-4 hover:text-surface-foreground">
                Sign in
              </Link>{" "}
              to save this order to your account, or continue as a guest.
            </p>
          )}

          {orderError && (
            <p className="font-body text-xs text-surface-foreground border-l-2 border-surface-foreground pl-2">
              {orderError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase py-4 cursor-pointer transition-transform duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Placing order…" : "Continue to payment"}
          </button>
        </form>

        <div className="rounded-2xl border border-hairline p-6 h-fit">
          <p className="font-heading text-lg mb-5">Order summary</p>
          <div className="flex flex-col gap-4 mb-6">
            {lines.map((line) => {
              const product = getProduct(line.slug);
              if (!product) return null;
              return (
                <div key={`${line.slug}-${line.size ?? ""}`} className="flex gap-4">
                  <div
                    className="h-16 w-14 shrink-0 rounded-lg border border-hairline"
                    style={{ background: product.swatch }}
                  />
                  <div className="flex-1 flex justify-between">
                    <div>
                      <p className="font-body text-sm">{product.name}</p>
                      <p className="font-body text-xs text-surface-foreground/75">
                        {line.size ? `Size ${line.size} · ` : ""}Qty {line.quantity}
                      </p>
                    </div>
                    <p className="font-body text-sm">
                      ${(product.price * line.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-hairline pt-4 flex justify-between">
            <p className="font-body text-sm text-surface-foreground/60">Subtotal</p>
            <p className="font-body text-sm">${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="font-body text-sm text-surface-foreground/60">Shipping</p>
            <p className="font-body text-sm text-surface-foreground/60">Calculated next step</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  helper,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  helper?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="font-body text-xs tracking-widest uppercase text-surface-foreground/75">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="mt-1.5 w-full bg-transparent border-b border-hairline py-2 font-body text-sm outline-none focus-visible:border-surface-foreground transition-colors duration-200"
      />
      {helper && <span className="block font-body text-xs text-surface-foreground/30 mt-1">{helper}</span>}
    </label>
  );
}
