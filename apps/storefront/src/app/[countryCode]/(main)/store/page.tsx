import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listCategoryTree } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { getT } from "@lib/i18n/server"
import StoreTemplate from "@modules/store/templates"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return {
    title: t("store.meta.title"),
    description: t("store.meta.description"),
  }
}

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ category?: string | string[] }>
}) {
  const { countryCode } = await props.params
  const { category } = await props.searchParams
  const [region, categories] = await Promise.all([
    getRegion(countryCode),
    listCategoryTree().catch(() => []),
  ])

  if (!region) {
    notFound()
  }

  return (
    <StoreTemplate
      currencyCode={region.currency_code}
      categories={categories}
      categoryHandle={Array.isArray(category) ? category[0] : category ?? null}
    />
  )
}
