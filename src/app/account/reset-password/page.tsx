"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "@/lib/account-context";
import { TextField, FormError } from "@/components/account/form-fields";

export default function ResetPasswordPage() {
  const { user, loading, updatePassword } = useAccount();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (loading) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="font-body text-sm text-surface-foreground/60">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="font-heading text-2xl mb-3">This link didn&apos;t work.</p>
        <p className="font-body text-sm text-surface-foreground/70 max-w-md mx-auto mb-8">
          Reset links only work once and expire after a while — and if your account wasn&apos;t
          confirmed yet, this one confirmed it instead of resetting your password. Either way,
          head back and request a fresh link.
        </p>
        <Link
          href="/account"
          className="inline-block rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase px-8 py-4 transition-transform duration-200 hover:scale-[1.02]"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="px-6 py-24 text-center">
        <p className="font-heading text-2xl mb-3">Password updated.</p>
        <p className="font-body text-sm text-surface-foreground/70 mb-8">
          You&apos;re all set — and already signed in.
        </p>
        <Link
          href="/account"
          className="inline-block rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase px-8 py-4 transition-transform duration-200 hover:scale-[1.02]"
        >
          Go to your account
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-md mx-auto">
        <p className="font-heading text-3xl mb-2 text-center">Set a new password</p>
        <p className="font-body text-sm text-surface-foreground/70 text-center mb-8">
          Choose a new password for {user.email}.
        </p>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const password = String(data.get("password") ?? "");
            const confirm = String(data.get("confirm") ?? "");
            if (password !== confirm) {
              setError("Those passwords don't match.");
              return;
            }
            setSubmitting(true);
            setError(null);
            const result = await updatePassword(password);
            setSubmitting(false);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            setDone(true);
          }}
        >
          <TextField
            label="New password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            helper="At least 6 characters."
          />
          <TextField
            label="Confirm password"
            name="confirm"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
          {error && <FormError message={error} />}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase py-4 cursor-pointer transition-transform duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
