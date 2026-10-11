"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "matte-black-newsletter-dismissed";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // ignore
    }
    if (dismissed) return;

    // Trigger once the visitor has actually engaged with the page, rather
    // than a blind timer that fights whatever they're looking at.
    function onScroll() {
      if (window.scrollY > window.innerHeight * 0.6) {
        setOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function close() {
    setOpen(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Newsletter signup"
      onClick={close}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-md rounded-2xl bg-surface border border-surface-foreground/30 p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center hairline border cursor-pointer transition-colors duration-200 hover:bg-surface-foreground hover:text-surface"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <p className="font-heading text-2xl mb-2">You&apos;re in.</p>
            <p className="font-body text-sm text-surface-foreground/60">
              Watch your inbox for early access to new drops.
            </p>
          </div>
        ) : (
          <>
            <p className="font-display text-4xl tracking-wide mb-2">10% OFF</p>
            <p className="font-heading text-lg mb-4">your first order</p>
            <p className="font-body text-sm text-surface-foreground/60 mb-6">
              Sign up for early access to new drops and restocks.
            </p>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="bg-transparent border-b border-hairline py-2 font-body outline-none placeholder:text-surface-foreground/40 focus-visible:border-surface-foreground"
              />
              <button
                type="submit"
                className="mt-2 rounded-full bg-surface-foreground text-surface font-body text-sm tracking-widest uppercase py-3 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
              >
                Get my code
              </button>
            </form>
            <button
              onClick={close}
              className="mt-4 font-body text-xs text-surface-foreground/70 hover:text-surface-foreground transition-colors duration-200 cursor-pointer"
            >
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  );
}
