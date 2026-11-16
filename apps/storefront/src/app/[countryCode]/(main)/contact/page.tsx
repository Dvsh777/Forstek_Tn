import { Metadata } from "next"

import { getT } from "@lib/i18n/server"
import { STORE_NAME } from "@lib/util/site"
import { PlaceholderNotice, PolicyPage } from "@modules/policies/templates"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return {
    title: t("policies.contact.title"),
    description: t("policies.contact.description", { store: STORE_NAME }),
  }
}

export default async function ContactPage() {
  const t = await getT()

  return (
    <PolicyPage title={t("policies.contact.title")}>
      <PlaceholderNotice />
      <p>{t("policies.contact.text", { store: STORE_NAME })}</p>
    </PolicyPage>
  )
}
