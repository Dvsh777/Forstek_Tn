import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getLocaleHeader } from "@lib/util/get-locale-header"
import type { StoreCategoryNode } from "@lib/util/store-categories"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, unknown>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

type CategoryRow = {
  id: string
  name: string
  handle: string
  parent_category_id?: string | null
}

/**
 * The store's original (untranslated) content language. `sdk.client.fetch`
 * adds the visitor's locale to every request, so asking for the default
 * content has to be explicit: the search index stores the original category
 * names, and the store filters match on those.
 */
const DEFAULT_CATALOG_LOCALE = "en-US"

const fetchCategoryRows = async (
  headers: Record<string, string> = {
    "x-medusa-locale": DEFAULT_CATALOG_LOCALE,
  }
) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<{ product_categories: CategoryRow[] }>("/store/product-categories", {
      query: {
        fields: "id,name,handle,parent_category_id",
        limit: 1000,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ product_categories }) => product_categories)
}

/**
 * Every category with its parent link, for the store breadcrumb and heading.
 * `name` is the default-language name, which is what the search index stores
 * and filters on. `label` is the name in the active locale for display. If the
 * backend rejects the locale, labels fall back to the default names.
 */
export const listCategoryTree = async (): Promise<StoreCategoryNode[]> => {
  const localeHeader = await getLocaleHeader()
  const locale = localeHeader["x-medusa-locale"]

  const [base, localized] = await Promise.all([
    fetchCategoryRows(),
    locale
      ? fetchCategoryRows({ "x-medusa-locale": locale }).catch(() => null)
      : Promise.resolve(null),
  ])

  const labels = new Map((localized ?? []).map((c) => [c.id, c.name]))

  return base.map((category) => ({
    id: category.id,
    handle: category.handle,
    name: category.name,
    label: labels.get(category.id) || category.name,
    parentId: category.parent_category_id ?? null,
  }))
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
