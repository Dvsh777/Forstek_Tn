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

## Stage 2 — Medusa commerce translations (code written, NOT yet run)

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

## Stage 3 (not started) — Arabic RTL, still to do
- Arabic RTL: `<html lang dir>` per language, logical Tailwind classes (`ms-*`/`me-*`, `text-start`), mirrored icons/chevrons, RTL-safe layouts and carousels.
- Locale-aware date/number formatting, `hreflang` per language, SEO metadata alternates.
