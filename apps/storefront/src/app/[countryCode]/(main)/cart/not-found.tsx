import { Metadata } from "next"

import { getT } from "@lib/i18n/server"
import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default async function NotFound() {
  const t = await getT()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">
        {t("cart.notFound.title")}
      </h1>
      <p className="text-small-regular text-ui-fg-base">
        {t("cart.notFound.text")}
      </p>
      <InteractiveLink href="/">{t("cart.notFound.home")}</InteractiveLink>
    </div>
  )
}
