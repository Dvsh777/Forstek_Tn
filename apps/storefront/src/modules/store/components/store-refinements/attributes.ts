import { TFunction } from "@lib/i18n/config"
import { PRODUCT_INDEX_NAME, priceAttribute } from "@lib/search-client"

export const OPTION_VALUES_ATTRIBUTE = "option_values"
export const CATEGORY_ATTRIBUTE = "category"
// The index calls the product's tags "labels".
export const LABELS_ATTRIBUTE = "labels"

export const getSortOptions = (currencyCode: string, t: TFunction) => {
  const minPrice = priceAttribute("min_price", currencyCode)

  return [
    { value: PRODUCT_INDEX_NAME, label: t("store.refinements.relevance") },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/created_at:desc`,
      label: t("store.refinements.latestArrivals"),
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:asc`,
      label: t("store.refinements.priceLowHigh"),
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:desc`,
      label: t("store.refinements.priceHighLow"),
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/title:asc`,
      label: t("store.refinements.titleAZ"),
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/title:desc`,
      label: t("store.refinements.titleZA"),
    },
  ]
}
