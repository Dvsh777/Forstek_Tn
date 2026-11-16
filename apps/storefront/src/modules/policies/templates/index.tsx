import { getT } from "@lib/i18n/server"
import { convertToLocale } from "@lib/util/money"
import { formatDayRange, StorePolicies } from "@lib/util/store-policies"

export const formatShippingRate = (
  rate: number,
  currencyCode: string,
  freeLabel = "Free"
) =>
  rate === 0 ? freeLabel : convertToLocale({ amount: rate, currency_code: currencyCode })

export const PolicyPage = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="content-container py-12 max-w-3xl" data-testid="policy-page">
    <h1 className="text-2xl-semi mb-8">{title}</h1>
    <div className="flex flex-col gap-6 text-base-regular text-ui-fg-base">
      {children}
    </div>
  </div>
)

export const PoliciesUnavailable = async () => {
  const t = await getT()

  return <p className="text-ui-fg-subtle">{t("policies.unavailable")}</p>
}

export const ShippingSummary = async ({
  policies,
  currencyCode,
}: {
  policies: StorePolicies
  currencyCode: string
}) => {
  const t = await getT()

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
      <dt className="text-ui-fg-subtle">{t("policies.shippingRate")}</dt>
      <dd>
        {formatShippingRate(
          policies.shippingRate,
          currencyCode,
          t("policies.free")
        )}
      </dd>
      <dt className="text-ui-fg-subtle">{t("policies.processingTime")}</dt>
      <dd>
        {t("policies.businessDays", {
          range: formatDayRange(policies.handlingDays),
        })}
      </dd>
      <dt className="text-ui-fg-subtle">{t("policies.deliveryTime")}</dt>
      <dd>
        {t("policies.afterDispatch", {
          range: formatDayRange(policies.transitDays),
        })}
      </dd>
    </dl>
  )
}

export const PlaceholderNotice = async () => {
  const t = await getT()

  return (
    <p className="text-ui-fg-subtle" data-testid="policy-placeholder">
      {t("policies.placeholder")}
    </p>
  )
}
