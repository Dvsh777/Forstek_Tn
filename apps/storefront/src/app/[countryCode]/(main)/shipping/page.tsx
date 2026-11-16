import { Metadata } from "next"

import { getStorePolicies } from "@lib/data/store-policies"
import { getT } from "@lib/i18n/server"
import {
  PoliciesUnavailable,
  PolicyPage,
  ShippingSummary,
} from "@modules/policies/templates"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return {
    title: t("policies.shipping.title"),
    description: t("policies.shipping.description"),
  }
}

export default async function ShippingPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const t = await getT()
  const { countryCode } = await props.params
  const { current, currencyCode } = await getStorePolicies(countryCode)

  return (
    <PolicyPage title={t("policies.shipping.title")}>
      {current ? (
        <>
          <p>
            {t("policies.shipping.intro", { country: countryCode.toUpperCase() })}
          </p>
          <ShippingSummary policies={current} currencyCode={currencyCode} />
          <p className="text-ui-fg-subtle">{t("policies.shipping.note")}</p>
        </>
      ) : (
        <PoliciesUnavailable />
      )}
    </PolicyPage>
  )
}
