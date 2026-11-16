import "server-only"

import { getLocale } from "@lib/data/locale-actions"
import { AppLanguage, resolveLanguage, translate, TFunction } from "./config"
import { getDictionary } from "./dictionaries"

/** Current interface language, derived from the existing locale cookie. */
export async function getLanguage(): Promise<AppLanguage> {
  return resolveLanguage(await getLocale())
}

/** Translation function for server components: `const t = await getT()`. */
export async function getT(): Promise<TFunction> {
  const language = await getLanguage()
  const dict = getDictionary(language)
  const fallback = getDictionary("en")
  return (key, vars) => translate(dict, fallback, key, vars)
}
