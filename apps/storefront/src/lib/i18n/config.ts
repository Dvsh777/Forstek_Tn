export const SUPPORTED_LANGUAGES = ["en", "fr", "ar"] as const

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: AppLanguage = "en"

// Shared with lib/data/locale-actions.ts (existing locale cookie).
export const LOCALE_COOKIE_NAME = "_medusa_locale"

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
}

// Flag shown next to each language in the existing selector.
export const LANGUAGE_FLAGS: Record<AppLanguage, string> = {
  en: "GB",
  fr: "FR",
  ar: "TN",
}

/**
 * Maps any locale code (e.g. "fr", "fr-FR", "ar-TN", "en_US", "" or null)
 * to one of the supported interface languages. Unknown values fall back to
 * English.
 */
export function resolveLanguage(code?: string | null): AppLanguage {
  const base = (code ?? "").toLowerCase().split(/[-_]/)[0]
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(base)
    ? (base as AppLanguage)
    : DEFAULT_LANGUAGE
}

type Vars = Record<string, string | number>

/**
 * Looks up a dot-separated key ("nav.account") and interpolates {vars}.
 * Falls back to the English value, then to the key itself.
 */
export function translate(
  dict: Record<string, unknown>,
  fallback: Record<string, unknown>,
  key: string,
  vars?: Vars
): string {
  const find = (d: Record<string, unknown>): string | undefined => {
    let cur: unknown = d
    for (const part of key.split(".")) {
      if (cur && typeof cur === "object" && part in (cur as object)) {
        cur = (cur as Record<string, unknown>)[part]
      } else {
        return undefined
      }
    }
    return typeof cur === "string" ? cur : undefined
  }

  const raw = find(dict) ?? find(fallback) ?? key
  if (!vars) return raw
  return raw.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{${name}}`
  )
}

export type TFunction = (key: string, vars?: Vars) => string
