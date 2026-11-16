import { Metadata } from "next"
import { Suspense } from "react"

import { getT } from "@lib/i18n/server"
import VerifyAccount from "@modules/account/components/verify-account"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return {
    title: t("account.pages.verify.title"),
    description: t("account.pages.verify.description"),
  }
}

export default async function VerifyAccountPage() {
  const t = await getT()

  return (
    <div className="w-full flex justify-center px-8 py-12">
      <Suspense
        fallback={
          <p className="text-base-regular text-ui-fg-base">
            {t("account.pages.verify.fallback")}
          </p>
        }
      >
        <VerifyAccount />
      </Suspense>
    </div>
  )
}
