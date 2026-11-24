import { Metadata } from "next"

import { getT } from "@lib/i18n/server"
import InteractiveLink from "@modules/common/components/interactive-link"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return { title: "404", description: t("common.notFound.metaDescription") }
}

export default async function NotFound() {
  const t = await getT()

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">
        {t("common.notFound.title")}
      </h1>
      <p className="text-small-regular text-ui-fg-base">
        {t("common.notFound.text")}
      </p>
      <InteractiveLink href="/">{t("common.notFound.home")}</InteractiveLink>
    </div>
  )
}
