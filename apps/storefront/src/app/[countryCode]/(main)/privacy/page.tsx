import { Metadata } from "next"

import { getT } from "@lib/i18n/server"
import { STORE_NAME } from "@lib/util/site"
import { PlaceholderNotice, PolicyPage } from "@modules/policies/templates"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return {
    title: t("policies.privacy.title"),
    description: t("policies.privacy.description", { store: STORE_NAME }),
  }
}

export default async function PrivacyPage() {
  const t = await getT()

  return (
    <PolicyPage title={t("policies.privacy.title")}>
      <PlaceholderNotice />
      <p>{t("policies.privacy.p1", { store: STORE_NAME })}</p>
      <p>{t("policies.privacy.p2")}</p>
    </PolicyPage>
  )
}
