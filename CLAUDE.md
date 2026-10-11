@AGENTS.md

# Project Log

Running record of finalized decisions and changes made to this site, for context across sessions. Entries are appended after each change — only the final outcome is recorded, not the back-and-forth that led there. Newest at the bottom.

## 2026-08-21 — Project setup
- Scaffolded Next.js 16 (App Router, TypeScript, Tailwind v4) via `create-next-app`, targeting Vercel deployment on a custom domain.
- Stack decision: fully self-owned (no Shopify) — Next.js + Postgres (Neon) + Prisma + Stripe planned for later; product data is hardcoded in `src/lib/products.ts` for now, no DB/payments wired up yet.
- Brand: "Matte Black" — dropshipping store selling only black/matte-black items across Clothing, Accessories, and Gadgets.

## 2026-08-21 — Design system
- Palette: pure black/white (`--ink`/`--paper`), no color accent; a brushed-metal gradient (`.metal-text`) reserved for the wordmark.
- Type: Syne (headings), Manrope (body/UI), Bebas Neue (occasional large "shout" moments).
- Layout: hybrid — full-bleed editorial hero + story sections on the homepage, dense grid on shop/category pages.
- Signature element: generated atmospheric photography (black sand beach, etc.) used as breathing space between product grids, since every product is the same color.

## 2026-08-21 — Homepage, shop, product, cart, checkout built
- Homepage: hero (generated black-sand-beach image), inverted manifesto section, category teasers, featured product grid.
- `/shop`: search + sort, client-side.
- `/shop/[slug]`: product detail with size selector + size guide table.
- `/cart`, `/checkout`: full UI flow; checkout collects phone number only at that step (not site-wide) and is clearly marked as a payment-not-yet-connected preview.
- Cart state: React Context + localStorage, implemented via `useSyncExternalStore` (not useEffect+setState) to stay hydration-safe.

## 2026-08-21 — Light/dark theme toggle
- Installed shadcn/ui + MagicUI's `animated-theme-toggler` (circle expand-from-viewport-center) in the nav.
- Introduced theme-reactive `--surface-bg`/`--surface-fg`/`--surface-hairline` tokens; `.dark` (default on load) = matte black brand look, no class = inverted white look. Preference persisted to `localStorage`, synced via a `beforeInteractive` script to avoid flash.
- All "invert on interact" UI (buttons, hover states, active filters) uses these tokens rather than literal white/black, so it stays correct in both themes. Photo overlays (hero text, category tile labels, swatch labels) intentionally stay literal white since they sit on fixed-dark imagery, not the page surface.

## 2026-08-22 — Rounded corners
- Replaced the earlier zero-radius look with a real `--radius: 0.75rem` scale. Icon buttons/theme toggle are full circles; product photo frames, hero category tiles, and cards use `rounded-2xl`; primary CTAs and filter chips are pills (`rounded-full`); smaller bordered elements (size chips, thumbnails, inputs) use `rounded-lg`/`rounded-xl`.

## 2026-08-22 — Fly-to-cart animation
- Clicking "Add to bag" flies a small circular blob from the button to the cart icon along an arc; the cart count and a pulse animation only fire when the blob lands, not on click.
- Blob color is theme-reactive (`bg-surface-foreground`: white in dark mode, black in light mode), not tied to the product's own color.
- Respects `prefers-reduced-motion` (skips the flight, adds instantly).

## 2026-08-22 — Infinite product marquee ("Every piece, in motion")
- Rebuilt as a physics-driven, JS-animated (not CSS-keyframe) loop: never pauses on hover, drag-to-scrub with velocity tracking, releases into a short coast back to normal auto-scroll speed in whichever direction it was flung, and wraps seamlessly in both directions.
- Pointer capture is deferred until the drag threshold is actually exceeded (not on every press) — capturing eagerly broke plain clicks on cards.

## 2026-08-22 — Related products on product pages
- Product detail pages now show a "You might also like / More in [Category]" grid (same category, excluding the current item) below the main product info, before the footer.

## 2026-08-22 — Real category pages + header nav indicator
- `Clothing`/`Accessories`/`Gadgets` are now dedicated routes (`/shop/category/clothing` etc., statically prerendered), not `/shop?category=X` query-param filters. `ShopClient` takes a pre-filtered `products` + `title` prop; `CategoryChips` links between them.
- Header nav shows which section you're in via an animated underline beneath the active label (`NavLinks.tsx`), driven by `usePathname()`. On activation it snaps to the new position at zero width and grows outward from the center — it does not slide over from the old spot. A glowing "spotlight" version was tried first and explicitly rejected in favor of this.

## 2026-08-22 — Copy
- Hero subtitle reads "Everything, in matte." (not "in black.") — scoped to the hero only; the tagline elsewhere (footer, cart empty state, metadata) is unchanged unless asked.

## 2026-08-22 — Impeccable skill installed; homepage critique
- Installed the "impeccable" design skill (`/impeccable`), which maintains `.impeccable/critique/` snapshots and an auto-running design-quality hook after UI edits.
- Ran a dual-agent critique on the homepage (score 21/32, snapshot `.impeccable/critique/2026-08-22T15-33-09Z__src-app-page-tsx.md`). Two direct fixes shipped immediately since they were bugs, not taste calls:
  - **P0**: `ProductMarquee`'s auto-scroll could overshoot its wrap-around bounds after the tab was backgrounded/throttled (a huge single-frame `dt`), causing real horizontal page overflow. Fixed with a `dt` clamp plus real modulo math in `wrap()` instead of a single add/subtract.
  - **P1**: secondary text at 40–50% opacity (`text-surface-foreground/40`, `/50`) failed WCAG AA contrast in at least one theme — eyebrow labels, inactive nav links, captions. Raised the floor to `/70`–`/75` site-wide (placeholder text left alone, not held to the same bar).
- Suppressed the detector's `gradient-text` flag on `.metal-text` (globals.css) as a confirmed intentional exception — it's the wordmark-only brand treatment documented in the 2026-08-21 Design system entry, not decorative gradient-text sprawl.
- Remaining critique findings (undifferentiated category tiles, marquee/"New arrivals" redundancy, newsletter popup timing/focus-trap, inconsistent email-capture CTAs) were prototyped as a toggle-able "improved" homepage variant for side-by-side comparison, then adopted outright — see the entry below.

## 2026-08-22 — Redesigned homepage adopted permanently
- The "improved" variant from the critique above is now simply the homepage; the dev-only comparison toggle and the old version have been removed entirely (no `preview-mode`/`PreviewToggle`/`HomeCurrent` left in the codebase).
- **Category tiles** are no longer identical — each has its own texture (diagonal weave for Clothing, metallic sheen for Accessories, dot-grid for Gadgets) and a small line icon.
- **"New arrivals" replaced with "Editor's Pick — One from every category"**: 3 large curated cards (one per category, hand-picked) with an editorial one-line note each — a distinct job from the marquee's ambient full-catalog scroll rather than a duplicate of it.
- Manifesto line-height loosened (`leading-tight` → `leading-snug`) to clear the accessibility line-height floor.
- Newsletter popup now triggers on scroll-past-hero instead of a blind 4s timer, and gained Escape-to-close plus a focus trap. Footer's "Join" is now a filled pill ("Join the list") matching the popup's CTA instead of a plain underlined link.
- Left the marquee's small (10px) category-label text as-is — a minor item, not worth a separate pass right now.

## 2026-08-22 — Account page (preview auth + order history)
- `/account`: sign up / sign in / sign out, order history, editable account details, and a saved shipping address — all stored locally per browser (`src/lib/account-context.tsx`, same hydration-safe `useSyncExternalStore` pattern as cart/theme), not a real backend. No password field: the sign-in copy says outright this is a preview account, matching how checkout already discloses payment isn't connected.
- Checkout now actually uses this: if you're signed in, submitting the form saves a real `Order` (line items, address, subtotal, an `ORD-xxxx` id) to your account and clears the cart, and prefills contact/address fields from the saved account/address. Guests can still check out; their order just isn't saved anywhere, with a one-line prompt to sign in for that.
- Order history supports expanding an order for line-item/address detail and cancelling it while `Processing` (flips to `Cancelled` locally) — the "manage orders" part of the ask.
- Nav gained a person-icon link to `/account`, with a small dot indicator when signed in.

## 2026-08-22 — Real Supabase backend (auth, profiles, orders)
- Connected the project's existing Supabase instance (project ref `svexitcvhbppccbuzopd`) via the official Supabase MCP server, and replaced the localStorage-mocked account system with a real one. Products stay hardcoded in `src/lib/products.ts` for now — the plan is still to hand product/order management to Stripe or Shopify once the site goes live, so no product catalog was migrated into Supabase.
- Schema (`public.profiles`, `public.orders`, `public.order_items`) applied via migration, RLS-protected so users can only read/write their own rows; a `handle_new_user()` trigger provisions a profile row on sign-up (its direct RPC execution is revoked so it's only reachable via the trigger). Order `status` updates are column-restricted to just that field.
- Auth is real email + password (Supabase Auth), replacing the old "preview account, no password" flow — sign-up copy updated accordingly. Hosted project has email confirmation on by default, so sign-up shows a "check your email" screen when needed rather than logging straight in.
- `src/lib/account-context.tsx` now talks to Supabase directly (async, with a `loading` state) instead of `useSyncExternalStore`/localStorage; `src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`) refreshes the auth session on every request via `getClaims()`.
- Checkout and order history now write/read real rows instead of local state; verified end-to-end in-browser (sign up → confirm → sign in → place order → view/cancel in history → sign out/in → order persists across reload) against the live database, then the test account and its data were deleted from Supabase afterward.

## 2026-08-23 — Custom SMTP (Resend) for auth emails
- Supabase's default built-in email sender is testing-only (rate-limited to a couple messages/hour, and restricted to only the project's team members) — real sign-up confirmation emails need a real mail sender before launch, so Resend is now wired up as Supabase's custom SMTP provider.
- Two subdomains verified in Resend and dedicated to automated sending only, kept off the root domain to protect its reputation: `mail.matte---black.com` (transactional — auth emails now, order confirmations/shipping updates later) and `news.matte---black.com` (marketing/newsletter, not wired to anything yet). A planned `support.matte---black.com` stays deliberately out of Resend — it'll be a real two-way inbox (Google Workspace/Zoho) for customer replies, not an automated sender.
- Supabase Authentication → SMTP Settings now points at `smtp.resend.com` (port 465) with the sender address on `mail.matte---black.com`; this also auto-raised Supabase's auth email rate limit from 2/hour to 30/hour. Confirmed working end-to-end (real confirmation email received) after fixing an initial sender-domain mismatch (SMTP sender was set to an unverified `order.matte---black.com` instead of the verified `mail.matte---black.com`, caught via Supabase's auth logs).

## 2026-08-23 — App-level transactional email (Resend SDK, order confirmations)
- Added `resend` as a direct dependency for emails the *app* sends itself (as opposed to Supabase Auth's own emails, which still go through the SMTP integration above) — order confirmations, and a place to hang future ones (welcome, shipping updates) from. Uses Resend's HTTP API via their SDK, not SMTP; a separate, domain-restricted API key from the one in Supabase's SMTP settings, kept in `RESEND_API_KEY`.
- `src/lib/email/resend.ts` defines named sender identities (`EMAIL_FROM.noreply/orders/welcome/news`) mapped to the `mail.`/`news.` subdomains, plus a shared `SUPPORT_REPLY_TO` so any automated send routes replies to the (future) real support inbox. The Resend client is lazily constructed — instantiating it eagerly at module scope threw during `next build` whenever the API key was empty, since the constructor validates immediately.
- `src/lib/email/order-confirmation.ts` renders a plain-HTML (email-client-safe, no external CSS) branded confirmation and sends it from `EMAIL_FROM.orders`. Wired into checkout (`src/app/checkout/page.tsx`) via a new route handler, `POST /api/emails/order-confirmation` — the client calls it right after `placeOrder` succeeds, fire-and-forget, so a failed send can't block or fail the checkout flow itself (the order is already saved either way).
- `welcome` and `news` sender identities exist and are ready to use, but nothing triggers them yet — no post-signup welcome email and no newsletter feature built.
- Verified live: a domain-restricted Resend API key (Sending access, `mail.matte---black.com` only) was added to `.env.local` and the confirmation route hit directly with test order data — email arrived from `orders@mail.matte---black.com` as expected.

## 2026-08-23 — Softened the site's white
- `--paper` (the single token behind dark-mode text/icons and the light-mode background) changed from pure `#ffffff` to `#e5e8ef`, a cool blue-grey off-white — sampled directly from the hero photo's foam/mist highlights (canvas pixel analysis, blended 50/50 with white so it reads as a softened white rather than a visibly blue UI) rather than picked by eye.
- Scoped deliberately to just this shared token: literal `text-white` used for text/icons overlaid directly on photos (hero headline, category tile labels) was left untouched — that's a separate, intentional exception documented back in the 2026-08-22 design-system entry, for contrast against fixed dark imagery rather than being "the site's white."
- Follow-up: the nav wordmark's brushed-metal gradient (`.metal-text`, `--metal-mid`) is a separate hardcoded treatment, unrelated to `--paper` — it stayed neutral gray (`#d4d4d4`) after the token change above, so it visibly clashed with the now-cool-tinted nav text right next to it. Retinted `--metal-mid` to `#d0d3d9` (same lightness, same cool hue direction as the new `--paper`) so the wordmark's shine reads as the same "white" as the rest of the site, without flattening it into plain text — it's still a gradient, just recolored to match.

## 2026-08-23 — Forgot-password flow + cleaner auth error UI
- `src/lib/account-context.tsx` gained `resetPassword` (Supabase `resetPasswordForEmail`, redirects to `/account/reset-password`) and `updatePassword` (`updateUser({ password })`). Sign-in's raw Supabase error text ("Invalid login credentials") is now mapped to a friendlier "Incorrect email or password." before it ever reaches the UI.
- New `/account/reset-password` page: relies on Supabase's default flow (no custom route handler needed) — the emailed link lands the user already authenticated via a recovery session (supabase-js auto-detects it client-side), so the page just calls `updatePassword`. Handles the no-session case (expired/reused link) with its own message rather than erroring.
- `AccountClient.tsx`'s sign-in form now shows "Forgot your password?" contextually — it only appears attached to the credentials error itself (not as a permanent link), leading into a lightweight "enter your email" sub-view reusing the same "check your email" pattern as sign-up confirmation.
- Pulled `TextField`/`FormError` out of `AccountClient.tsx` into shared `src/components/account/form-fields.tsx` so the new reset-password page doesn't duplicate them. `FormError` redesigned from a bare left-border line to a proper rounded card (icon, hairline border, subtle tinted background) matching the rest of the site's card language, with an optional `action` slot — that's what the "Forgot your password?" link renders into.
- Verified live: triggered a real "Incorrect email or password" error in-browser (confirmed the cleaner card + contextual link), then requested a reset for a real confirmed test account and confirmed via Supabase's auth logs that `user_recovery_requested` completed with no error (same log signature that caught the SMTP sender-domain bug earlier), meaning the email actually sent through Resend. Test account deleted afterward.
- Found a real edge case from the user's own account (never confirmed after sign-up): requesting a reset for an unconfirmed account sends a confirm-signup email instead of a real recovery one — clicking it confirms the account but doesn't start a recovery session, landing on `/account/reset-password` with no `user`. The page's "no session" copy was confidently claiming "This link has expired," which is wrong in this case; softened to "This link didn't work" and explained both possible causes (expired/reused link, or an unconfirmed account that just got confirmed by this link) rather than asserting one.
