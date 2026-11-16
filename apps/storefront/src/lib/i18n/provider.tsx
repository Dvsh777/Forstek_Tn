"use client"

import { createContext, useCallback, useContext, useMemo } from "react"
import { AppLanguage, translate, TFunction } from "./config"

type Dictionary = Record<string, unknown>

type I18nContextValue = {
  language: AppLanguage
  dictionary: Dictionary
  fallback: Dictionary
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  language,
  dictionary,
  fallback,
  children,
}: I18nContextValue & { children: React.ReactNode }) {
  const value = useMemo(
    () => ({ language, dictionary, fallback }),
    [language, dictionary, fallback]
  )
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/** Translation function for client components: `const t = useT()`. */
export function useT(): TFunction {
  const ctx = useContext(I18nContext)
  return useCallback(
    (key, vars) =>
      ctx
        ? translate(ctx.dictionary, ctx.fallback, key, vars)
        : translate({}, {}, key, vars),
    [ctx]
  )
}

export function useLanguage(): AppLanguage {
  return useContext(I18nContext)?.language ?? "en"
}
