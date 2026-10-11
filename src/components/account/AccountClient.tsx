"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount, type Address } from "@/lib/account-context";
import { TextField, FormError } from "@/components/account/form-fields";

export function AccountClient() {
  const { user, loading } = useAccount();

  if (loading) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="font-body text-sm text-surface-foreground/60">Loading your account…</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <div className="mx-auto max-w-4xl">{user ? <Dashboard /> : <AuthForms />}</div>
    </div>
  );
}

function AuthForms() {
  const { signUp, signIn, resetPassword } = useAccount();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  if (confirmSent) {
    return (
      <div className="max-w-md mx-auto text-center">
        <p className="font-heading text-3xl mb-3">Check your email</p>
        <p className="font-body text-sm text-surface-foreground/70">
          We sent a confirmation link — click it to activate your account, then come back and
          sign in.
        </p>
      </div>
    );
  }

  if (forgotMode) {
    if (forgotSent) {
      return (
        <div className="max-w-md mx-auto text-center">
          <p className="font-heading text-3xl mb-3">Check your email</p>
          <p className="font-body text-sm text-surface-foreground/70">
            We sent a password reset link — click it to set a new password, then come back and
            sign in.
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto">
        <p className="font-heading text-3xl mb-2 text-center">Reset your password</p>
        <p className="font-body text-sm text-surface-foreground/70 text-center mb-8">
          Enter your email and we&apos;ll send you a link to set a new one.
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setForgotSubmitting(true);
            setForgotError(null);
            const data = new FormData(e.currentTarget);
            const result = await resetPassword(String(data.get("email") ?? ""));
            setForgotSubmitting(false);
            if (!result.ok) {
              setForgotError(result.error);
              return;
            }
            setForgotSent(true);
          }}
        >
          <TextField label="Email" name="email" type="email" required autoComplete="email" />
          {forgotError && <FormError message={forgotError} />}
          <button
            type="submit"
            disabled={forgotSubmitting}
            className="mt-2 rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase py-4 cursor-pointer transition-transform duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {forgotSubmitting ? "Sending…" : "Send reset link"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForgotMode(false);
              setForgotError(null);
            }}
            className="font-body text-xs tracking-widest uppercase text-surface-foreground/70 hover:text-surface-foreground transition-colors duration-200 cursor-pointer"
          >
            Back to sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <p className="font-heading text-3xl mb-2 text-center">
        {mode === "in" ? "Sign in" : "Create your account"}
      </p>
      <p className="font-body text-sm text-surface-foreground/70 text-center mb-8">
        {mode === "in"
          ? "Sign in to view your orders and saved details."
          : "Takes a few seconds — you'll be able to track orders and save your address."}
      </p>

      <div className="flex rounded-full border border-hairline p-1 mb-8">
        {(["in", "up"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={`flex-1 rounded-full py-2 font-body text-xs tracking-widest uppercase cursor-pointer transition-colors duration-200 ${
              mode === m
                ? "bg-surface-foreground text-surface"
                : "text-surface-foreground/70 hover:text-surface-foreground"
            }`}
          >
            {m === "in" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      {mode === "in" ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);
            const data = new FormData(e.currentTarget);
            const result = await signIn(
              String(data.get("email") ?? ""),
              String(data.get("password") ?? "")
            );
            setSubmitting(false);
            if (!result.ok) setError(result.error);
          }}
        >
          <TextField label="Email" name="email" type="email" required autoComplete="email" />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
          {error && (
            <FormError
              message={error}
              action={
                error === "Incorrect email or password." ? (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(true);
                      setError(null);
                    }}
                    className="mt-1.5 font-body text-xs tracking-widest uppercase underline underline-offset-4 text-surface-foreground/80 hover:text-surface-foreground transition-colors duration-200 cursor-pointer"
                  >
                    Forgot your password?
                  </button>
                ) : undefined
              }
            />
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase py-4 cursor-pointer transition-transform duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);
            const data = new FormData(e.currentTarget);
            const result = await signUp(
              String(data.get("name") ?? ""),
              String(data.get("email") ?? ""),
              String(data.get("password") ?? ""),
              String(data.get("phone") ?? "") || undefined
            );
            setSubmitting(false);
            if (!result.ok) {
              setError(result.error);
            } else if (result.needsEmailConfirmation) {
              setConfirmSent(true);
            }
          }}
        >
          <TextField label="Full name" name="name" required autoComplete="name" />
          <TextField label="Email" name="email" type="email" required autoComplete="email" />
          <TextField
            label="Password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            helper="At least 6 characters."
          />
          <TextField label="Phone number" name="phone" type="tel" autoComplete="tel" />
          {error && <FormError message={error} />}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase py-4 cursor-pointer transition-transform duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>
      )}
    </div>
  );
}

function Dashboard() {
  const { user, profile, signOut } = useAccount();
  if (!user) return null;

  return (
    <div className="flex flex-col gap-16">
      <div className="flex items-center justify-between border-b border-hairline pb-8">
        <div>
          <p className="font-heading text-3xl mb-1">
            Hi{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </p>
          <p className="font-body text-sm text-surface-foreground/70">{user.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="font-body text-xs tracking-widest uppercase rounded-full border border-hairline px-5 py-2.5 cursor-pointer transition-colors duration-200 hover:bg-surface-foreground hover:text-surface"
        >
          Sign out
        </button>
      </div>

      <OrderHistory />
      <AccountDetails />
      <SavedAddress />
    </div>
  );
}

function OrderHistory() {
  const { orders, cancelOrder } = useAccount();
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);

  return (
    <div>
      <p className="font-heading text-xl mb-5">Order history</p>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-hairline p-8 text-center">
          <p className="font-body text-sm text-surface-foreground/70 mb-4">
            No orders yet — once you check out, they&apos;ll show up here.
          </p>
          <Link
            href="/shop"
            className="inline-block rounded-full bg-surface-foreground text-surface font-body text-xs tracking-widest uppercase px-6 py-3 transition-transform duration-200 hover:scale-[1.02]"
          >
            Shop All
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const open = openOrderId === order.id;
            const address = order.address as unknown as Address;
            const itemCount = order.order_items.reduce((n, l) => n + l.quantity, 0);
            return (
              <div key={order.id} className="rounded-2xl border border-hairline overflow-hidden">
                <button
                  onClick={() => setOpenOrderId(open ? null : order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left"
                >
                  <div>
                    <p className="font-body text-sm">
                      {order.order_number} ·{" "}
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="font-body text-xs text-surface-foreground/70 mt-1">
                      {itemCount} item{itemCount === 1 ? "" : "s"} · ${order.subtotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      aria-hidden
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </div>
                </button>
                {open && (
                  <div className="border-t border-hairline px-5 py-4">
                    <div className="flex flex-col gap-3 mb-4">
                      {order.order_items.map((line) => (
                        <div key={line.id} className="flex justify-between font-body text-sm">
                          <span>
                            {line.name}
                            {line.size ? ` · Size ${line.size}` : ""} · Qty {line.quantity}
                          </span>
                          <span>${(line.price * line.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="font-body text-xs text-surface-foreground/70 mb-4">
                      Shipping to {address.address}, {address.city} {address.postalCode},{" "}
                      {address.country}
                    </div>
                    {order.status === "processing" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="font-body text-xs tracking-widest uppercase text-surface-foreground/70 hover:text-surface-foreground transition-colors duration-200 cursor-pointer"
                      >
                        Cancel order
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const processing = status === "processing";
  return (
    <span
      className={`font-body text-[11px] tracking-widest uppercase rounded-full px-3 py-1 border border-hairline ${
        processing ? "text-surface-foreground/70" : "text-surface-foreground/40 line-through"
      }`}
    >
      {status}
    </span>
  );
}

function AccountDetails() {
  const { profile, updateProfile } = useAccount();
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <p className="font-heading text-xl mb-5">Account details</p>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          await updateProfile({
            full_name: String(data.get("name") ?? profile?.full_name ?? ""),
            phone: String(data.get("phone") ?? "") || undefined,
          });
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
      >
        <TextField label="Full name" name="name" defaultValue={profile?.full_name ?? ""} required />
        <TextField label="Phone number" name="phone" type="tel" defaultValue={profile?.phone ?? ""} />
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-full border border-hairline px-6 py-3 font-body text-xs tracking-widest uppercase cursor-pointer transition-colors duration-200 hover:bg-surface-foreground hover:text-surface"
          >
            {saved ? "Saved" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SavedAddress() {
  const { profile, updateProfile } = useAccount();
  const [saved, setSaved] = useState(false);
  const address = profile?.address as unknown as Address | null;

  return (
    <div>
      <p className="font-heading text-xl mb-2">Saved address</p>
      <p className="font-body text-sm text-surface-foreground/70 mb-5">
        Used to prefill shipping at checkout.
      </p>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const next: Address = {
            firstName: String(data.get("firstName") ?? ""),
            lastName: String(data.get("lastName") ?? ""),
            address: String(data.get("address") ?? ""),
            city: String(data.get("city") ?? ""),
            postalCode: String(data.get("postalCode") ?? ""),
            country: String(data.get("country") ?? ""),
          };
          await updateProfile({ address: next });
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
      >
        <TextField label="First name" name="firstName" defaultValue={address?.firstName} />
        <TextField label="Last name" name="lastName" defaultValue={address?.lastName} />
        <div className="md:col-span-2">
          <TextField label="Address" name="address" defaultValue={address?.address} />
        </div>
        <TextField label="City" name="city" defaultValue={address?.city} />
        <TextField label="Postal code" name="postalCode" defaultValue={address?.postalCode} />
        <div className="md:col-span-2">
          <TextField label="Country" name="country" defaultValue={address?.country} />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-full border border-hairline px-6 py-3 font-body text-xs tracking-widest uppercase cursor-pointer transition-colors duration-200 hover:bg-surface-foreground hover:text-surface"
          >
            {saved ? "Saved" : "Save address"}
          </button>
        </div>
      </form>
    </div>
  );
}

