# Localization progress — Stage 1 (frontend UI foundation)

Languages: English (default), French, Arabic. Storefront: `apps/storefront`.

## Status
Stage 1 code is written for every customer-facing area. **It has not been compiled, linted or run** (the available tooling could only read/write files). Run the checks in "Verify" before treating Stage 1 as accepted.

## Architecture (no new dependency)
Small custom i18n, compatible with Server and Client Components. All under `src/lib/i18n/`:

| File | Role |
| --- | --- |
| `config.ts` | `SUPPORTED_LANGUAGES` (`en`,`fr`,`ar`), `DEFAULT_LANGUAGE`, `LOCALE_COOKIE_NAME` (`_medusa_locale`), labels/flags, `resolveLanguage()`, `translate()`, `TFunction` |
| `server.ts` | `getLanguage()`, `await getT()` for Server Components, `generateMetadata`, not-found pages |
| `provider.tsx` | `useT()`, `useLanguage()` for Client Components |
| `server-provider.tsx` | `<I18n>` wrapper used in `(main)` and `(checkout)` layouts |
| `dictionaries/index.ts` | Registers every namespace for en/fr/ar |
| `dictionaries/{en,fr,ar}/*.json` | One file per namespace |

Usage: `t("namespace.key", { var })`, `{var}` interpolation, fallback to English, then to the key.
Namespaces: `layout, home, verticals, store, product, cart, common, checkout, account, order, policies`.

Rule: components used from both server and client trees are marked `"use client"` and use `useT()`; server-only components/pages use `getT()`.

## Locale config
- Language comes from the existing `_medusa_locale` cookie (set by existing `lib/data/locale-actions.ts`); `fr-FR` → `fr`, unknown/empty → `en`.
- Selector (nav side menu, `language-select`) always offers EN / Français / العربية. It uses the backend locale code when a matching locale exists (e.g. `fr-FR`), otherwise plain `en`/`fr`/`ar`. The cart locale update is wrapped in try/catch so an unconfigured backend locale never blocks switching.
- Region/country/currency selection is untouched and independent.
- Routing/middleware unchanged (no `/fr` URL prefix).

## What was migrated
Navigation, side menu, language/country selectors, footer, search (drawer/hits/form/page), home (hero, value props, rails), store (filters, sorting, pagination, empty states), product pages (actions, tabs, gallery, price, related, mobile bar), cart, checkout (addresses, delivery, payment, review, summary, discount), account (login, register, verify, overview, profile, addresses, orders, transfer), order (confirmed, details, transfer accept/decline), policy pages (contact, privacy, terms, returns, shipping), 404 pages, page `<title>`/description metadata.

Commerce data (product titles/descriptions, prices, images, categories, collections, option values) is **not** translated and still comes from Medusa.

## Notable changes
- Removed `dynamic = "force-static"` from home, product and policy pages so the cookie language is honoured (`revalidate = 60` kept).
- `PoliciesUnavailable`, `ShippingSummary`, `PlaceholderNotice`, `SearchForm`, cart/checkout server components became async.
- `lib/constants.tsx`: new `getPaymentTitle(id, t)`; `paymentInfoMap` unchanged.
- Preserved: wording of English text, classes, `data-testid`s, props, handlers, brand name `FORSTEK`.

## Verify (run in `apps/storefront`)
1. `npm run lint`
2. `npm run build` (note `typescript.ignoreBuildErrors` is on; also run `npx tsc --noEmit`)
3. Manually: switch EN → FR → AR in the menu on home, store, product, cart, checkout, account, order pages; refresh and navigate to confirm persistence; confirm English looks identical to before.
4. Check key parity across `dictionaries/{en,fr,ar}` and that every `t("…")` key exists (a missing key renders the key text).

## Known problems / not done
- Not compiled or run (see Status). Possible type issues: async components used as JSX (`SearchForm`, policy helpers), `useT` in shared components.
- Root `<html lang="en">` and text direction are unchanged — **Arabic RTL layout is Stage 3**; Arabic currently renders left-to-right.
- Dates/numbers are still formatted with fixed locales (`toDateString`, `toLocaleDateString()`), not per-language.
- Category/collection `<title>` keeps the existing `| Medusa Store` suffix.
- WhatsApp order/help message text (`lib/util/whatsapp.ts`) is a message sent to the merchant and was left in English.
- Checkout brand link text "Medusa Store" and `llms.txt`/structured data left as-is.
- Backend `/store/locales` must contain `fr`/`ar` locales for `x-medusa-locale` to be sent; otherwise the UI still translates but products stay in the default language.
- French/Arabic strings were machine-written and should get a native review.

## Stage 2 — Medusa commerce translations (VERIFIED by the project owner)
Status (reported by the owner, not re-run by me): Translation Module active (registered explicitly in `modules` because `defineConfig` evaluates its `disable` before `featureFlags` is read), 46 translations created. Only the apparel size codes `S`, `M`, `L`, `XL` remain in `untranslated-catalog.json`; they are standard size labels and stay as they are.

Original implementation notes:

Installed: Medusa 2.22.1 (backend) and `@medusajs/js-sdk` 2.22.1 — above the 2.12.3 minimum. `@medusajs/translation` is part of `defineConfig` and only needs the feature flag.

### Translation Module config
- `apps/backend/medusa-config.ts`: added `featureFlags: { translation: true }` (nothing else changed). No custom table/service was created.
- Locale codes are BCP 47 and must exist in the module's locale table: store supports `en-US` (original content), `fr-FR`, `ar-SA` (all built-in defaults). The storefront maps `fr-FR` → `fr`, `ar-SA` → `ar` (`resolveLanguage`).

### Commands to run (in `apps/backend`)
1. `npx medusa db:migrate` (creates the translation tables; no reset needed)
2. Restart the backend (`npm run dev`) so the flag, locales and translation settings load.
3. `npx medusa exec ./src/scripts/seed-translations.ts dry` — report only.
4. `npx medusa exec ./src/scripts/seed-translations.ts` — applies. Safe to re-run: existing translation records are never overwritten, only missing fields are added.
5. Anything it could not translate is written to `apps/backend/untranslated-catalog.json` (send it back to get it translated; nothing is guessed).

### Supported commerce resources (per the installed module)
product (title, subtitle, description, material), product_variant (title, material), product_category (name, description), product_collection (title), product_tag, product_type, product_option (title), product_option_value. The script only writes fields the module reports as translatable.

### Translation batch progress
- Built-in FR/AR text (`src/scripts/data/catalog-translations.ts`): the 8 seed categories, 4 collections, 6 tags, 5 options and their values, the 4 seed products (title + description) and all generated demo products (title, subtitle, description, variant titles).
- Products/categories you created yourself (e.g. French-named PC Portable categories) are not covered until they appear in `untranslated-catalog.json` and are translated. English records, prices, stock, handles, images and relationships are not touched.

### SDK / locale behavior
- Server: Stage 1 `sdk.client.fetch` wrapper (`lib/config.ts`) adds `x-medusa-locale` from the `_medusa_locale` cookie to every request; the Medusa docs list the header and `?locale=` as the two ways. `sdk.setLocale` is browser-only and is not used.
- Language switch (`updateLocale`) already sets the cookie, updates the cart locale and revalidates products/categories/collections tags.
- `listCategoryTree` now asks explicitly for the default content (`x-medusa-locale: en-US`) for the facet name, because the wrapper would otherwise return the translated name. `label` is the translated name for display.

### InstantSearch behavior
- The index (`apps/backend/src/search/product.ts`) stores the ORIGINAL title, description and category names. Filtering therefore keeps working in every language: facet values stay the original category names; the store shows translated labels for them (`getCategoryLabels`).
- Product titles shown in the hit grid are re-read from `/store/products` for the active locale (`useLocalizedTitles`), falling back to the indexed title.
- Not done: text search matches the original (English) title/description only, not French/Arabic text. Fixing that means indexing translated fields in the backend search index (a larger change, left for later).

### Cart localization
Supported in 2.22.1: `locale` is sent on cart create (`getOrSetCart`) and updated on language switch (`updateLocale`); cart id, items, region and customer are untouched. The locale is copied to the order on completion.

### To verify after running the commands
- `GET /store/products?locale=fr-FR` (with the publishable key) returns French titles.
- Check the same for `/store/product-categories?locale=fr-FR` and `/store/collections?locale=fr-FR`; the docs only guarantee products, so if those stay English, category/collection names stay English in the UI (the code falls back safely).
- Switch EN → FR → AR on `/store`, a product page and the cart.
- Dynamic strings that are not catalogue records (shipping option names, promotions, payment provider titles) are not covered by this module and are still untranslated.

## Stage 3 — Arabic RTL & final multilingual verification — DONE (2026-11-24)
Status: complete. Verification results below were run and reported by the project owner (not run from the assistant session).

Client requirement: Arabic text reads right to left, but the FORSTEK layout is NOT mirrored.

### What is implemented
- `app/layout.tsx` sets `<html lang dir>`: `ar` → `rtl`; `en`/`fr` → `ltr`.
- `styles/globals.css` (`html[dir="rtl"]` block): `body` stays `direction: ltr` so grids, flex rows, positions and carousels keep the designed layout. Headings/paragraphs/legends get `direction: rtl` (right-aligned, trailing `.` at the sentence end). Inline text (`span, a, button, label, li, dt, dd, td, th`) uses `unicode-bidi: plaintext` so Arabic, French/English and numbers each take their own direction in one row. Email/tel/number/url inputs stay ltr.
- `.rtl-flip` (`scale: -1 1`, Arabic only) on directional arrows: store toolbar and drawer CTA, hero tile, side-menu links. Images, numbers and unrelated icons are not flipped.
- Filter chips and facet labels are wrapped in `<bdi>`, so mixed tokens such as `Size: L` and `الفئة: بناطيل` are isolated.
- `lib/config.ts`: the `x-medusa-locale` header is only sent when a language cookie exists (previously a missing cookie sent a null header).

### Frontend ↔ backend language flow (checked by reading the code)
- `_medusa_locale` (not httpOnly) is read by `getLocale()` (server action, so usable from Server Components, Client Components and Server Actions) and added to every Store API request by the `sdk.client.fetch` wrapper.
- Caching: product/category/collection fetches use `force-cache` with tags; the locale header is part of each request (separate cache entries per locale were seen in the dev logs), and `updateLocale` revalidates products, categories, collections and carts.
- Cart: created with `locale` (`getOrSetCart`); `updateLocale` updates the cart's locale and revalidates; failure is swallowed so switching never breaks.
- Facets: `/store` keeps filtering on original (`en-US`) category names; labels shown are translated. Option names/values in the filter drawer come from the index and stay in the original language; on product pages Medusa returns translated options.
- Fallbacks: UI keys fall back to English then to the key; untranslated backend fields come back in the original language from Medusa.

### Hardcoded text audit
Scanned the Stage 1 component files (account, cart, checkout, common, home, layout, order, store, products) for JSX text and `placeholder`/`aria-label`/`title`/`alt` literals: no customer-facing English left except the `you@example.com` example placeholder. `src/app` pages and `lib` constants were not re-scanned.

### Audit pass (code review, 2026-11-23)
Faults found and fixed:
- `app/[countryCode]/(checkout)/not-found.tsx` was fully hardcoded English; now uses `common.notFound.*` via `getT()`.
- `aria-label="Breadcrumb"` (store page and product page) was English; now `store.breadcrumb` (EN/FR/AR). `product-breadcrumb` became a client component to use `useT()`.

Final hardening (included in the verified build):
- `_medusa_locale` cookie is now `sameSite: "lax"` (`lib/data/locale-actions.ts`), so the language survives a cross-site return from a redirect payment.
- `getOrSetCart` retries `cart.create` without `locale` if creating it with the cookie locale fails, so an unsupported locale never blocks the cart.
- The four `not-found.tsx` files now build their metadata description with `generateMetadata()` and `common.notFound.metaDescription`; the collection page title suffix uses `STORE_NAME` instead of `Medusa Store`.

Closed item: a one-off "Objects are not valid as a React child" error appeared at dev start while the backend was down. No cause was found in the code; it did not reproduce in the later browser run with the backend running.

RTL review: `body` stays `direction: ltr`; only text elements switch to RTL; `.rtl-flip` composes correctly with Tailwind hover translate; inputs of type email/tel/number/url stay LTR; images and numbers are not flipped.

### Verification results (run by the project owner, 2026-11-24)
- `npx tsc --noEmit`: passed, 0 errors.
- `npm run lint`: passed; only pre-existing React Hook warnings, no errors.
- `npm run build`: succeeded in Next.js 16.3.8 with the backend running.
- Browser click-through of `/store` in EN, FR and AR: no React child error; Arabic punctuation, chips and LTR page layout correct; French category cards not clipped.
- Final scan (assistant, code read): no remaining `Medusa Store` string in `src`; `STORE_NAME` resolves to the brand name; the Stage 3 hardening edits are present.

### Remaining / limitations
- Search index holds original text only: text search matches English titles/descriptions and option filter labels stay original.
- Not translated by the Translation Module: shipping option names, promotions, payment provider titles, other non-catalog entities.
- Dates/numbers use fixed locales; `hreflang`/SEO alternates per language not added.
- Region/shipping defaults (e.g. a Denmark entry in the country selector) are region data, not localization.
- French strings in narrow category cards were checked in the browser and are not clipped.
- FR/AR UI strings are machine-written and should get a native review before launch.
- Apparel size codes `S`, `M`, `L`, `XL` stay as standard labels (only entries left in `untranslated-catalog.json`).

### Medusa v2.22.1 scope notes
- Translation Module is registered explicitly in `modules` (`defineConfig` evaluates its `disable` flag before `featureFlags` is read); the `translation` feature flag is also set.
- It translates catalog entities only (products, variants, categories, collections, tags, types, options, option values). Shipping options, promotions and payment provider titles are not covered.
- Locales use BCP 47 codes (`en-US`, `fr-FR`, `ar-SA`) and must be listed in the store's supported locales; the storefront falls back to the store default if a cart is created with an unsupported one.
- The search index holds original text only; translating search needs the backend indexer extended.
