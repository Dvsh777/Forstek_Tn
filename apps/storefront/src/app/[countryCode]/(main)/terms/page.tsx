import { Metadata } from "next"

import { getT } from "@lib/i18n/server"
import { STORE_NAME } from "@lib/util/site"
import { PlaceholderNotice, PolicyPage } from "@modules/policies/templates"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return {
    title: t("policies.terms.title"),
    description: t("policies.terms.description", { store: STORE_NAME }),
  }
}

export default async function TermsPage() {
  const t = await getT()

  return (
    <PolicyPage title={t("policies.terms.title")}>
      <PlaceholderNotice />
      <p>{t("policies.terms.p1", { store: STORE_NAME })}</p>
      <p>{t("policies.terms.p2")}</p>
    </PolicyPage>
  )
}
