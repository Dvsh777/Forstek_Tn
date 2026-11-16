import { Metadata } from "next"

import { getStorePolicies } from "@lib/data/store-policies"
import { getT } from "@lib/i18n/server"
import { PoliciesUnavailable, PolicyPage } from "@modules/policies/templates"

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return {
    title: t("policies.returns.title"),
    description: t("policies.returns.description"),
  }
}

export default async function ReturnsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const t = await getT()
  const { countryCode } = await props.params
  const { current } = await getStorePolicies(countryCode)

  return (
    <PolicyPage title={t("policies.returns.title")}>
      {current ? (
        <>
          <p>
            {t("policies.returns.p1", { days: current.returnWindowDays })}
          </p>
          <p>
            {current.freeReturns
              ? t("policies.returns.free")
              : t("policies.returns.paid")}
          </p>
        </>
      ) : (
        <PoliciesUnavailable />
      )}
    </PolicyPage>
  )
}
