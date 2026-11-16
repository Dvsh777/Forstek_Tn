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

## Stage 2 (not started)
- Configure Medusa v2 locales and translation of products, variants, options, categories, collections.
- Ensure product/category fetches pass `x-medusa-locale` (existing `getLocale()` hooks) and cache keys include the locale.
- Translate dynamic strings that come from backend data (shipping option names, payment titles from providers, promotions).

## Stage 3 (not started)
- Arabic RTL: `<html lang dir>` per language, logical Tailwind classes (`ms-*`/`me-*`, `text-start`), mirrored icons/chevrons, RTL-safe layouts and carousels.
- Locale-aware date/number formatting, `hreflang` per language, SEO metadata alternates.
