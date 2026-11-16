import { getT } from "@lib/i18n/server"
import { TFunction } from "@lib/i18n/config"

type ValueProp = {
  title: string
  description: string
}

const buildValueProps = (
  currencyCode: string,
  t: TFunction
): ValueProp[] => [
  {
    title: t("home.valueProps.deliveryTitle"),
    description: t("home.valueProps.deliveryDescription"),
  },
  {
    title: t("home.valueProps.whatsappTitle"),
    description: t("home.valueProps.whatsappDescription"),
  },
  {
    title: t("home.valueProps.returnsTitle"),
    description: t("home.valueProps.returnsDescription"),
  },
  {
    title: t("home.valueProps.pricesTitle", {
      currency: currencyCode.toUpperCase(),
    }),
    description: t("home.valueProps.pricesDescription"),
  },
]

export default async function ValueProps({
  currencyCode,
}: {
  currencyCode: string
}) {
  const t = await getT()

  return (
    <section
      aria-labelledby="value-props-heading"
      className="border-t border-ui-border-base bg-brand-surface"
      data-testid="value-props"
    >
      <div className="content-container py-12 small:py-16">
        <h2 id="value-props-heading" className="sr-only">
          {t("home.valueProps.heading")}
        </h2>
        <ul className="grid grid-cols-1 gap-8 xsmall:grid-cols-2 small:grid-cols-4">
          {buildValueProps(currencyCode, t).map((prop) => (
            <li key={prop.title}>
              <h3 className="text-large-semi text-brand-text">{prop.title}</h3>
              <p className="mt-2 max-w-xs text-base-regular text-brand-muted">
                {prop.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
