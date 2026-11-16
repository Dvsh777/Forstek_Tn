import { getLanguage } from "./server"
import { getDictionary } from "./dictionaries"
import { I18nProvider } from "./provider"

/** Wraps a layout so client components can call useT(). */
export default async function I18n({
  children,
}: {
  children: React.ReactNode
}) {
  const language = await getLanguage()
  return (
    <I18nProvider
      language={language}
      dictionary={getDictionary(language)}
      fallback={getDictionary("en")}
    >
      {children}
    </I18nProvider>
  )
}
