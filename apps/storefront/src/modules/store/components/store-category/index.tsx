"use client"

import { Fragment, useEffect, useRef } from "react"
import { useCurrentRefinements, useInstantSearch } from "react-instantsearch"

import { useT } from "@lib/i18n/provider"
import { PRODUCT_INDEX_NAME } from "@lib/search-client"
import {
  getSubtreeNames,
  resolveCategoryState,
  StoreCategoryNode,
} from "@lib/util/store-categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CATEGORY_ATTRIBUTE } from "../store-refinements/attributes"

/** Facet values that a link to `handle` selects (the category and its children). */
export const getCategoryFacetValues = (
  categories: StoreCategoryNode[],
  handle?: string | null
) => {
  const category = handle ? categories.find((c) => c.handle === handle) : null
  return category ? getSubtreeNames(categories, category) : []
}

const useCategoryState = (categories: StoreCategoryNode[]) => {
  const { items } = useCurrentRefinements({
    includedAttributes: [CATEGORY_ATTRIBUTE],
  })
  const selected = items.flatMap((item) =>
    item.refinements.map((refinement) => String(refinement.value))
  )

  return resolveCategoryState(categories, selected)
}

/**
 * Applies `?category=<handle>` when the store page is navigated to while it is
 * already open (breadcrumb links, the menu). The first render is handled by
 * `initialUiState` on the search, so this skips it.
 */
export const StoreCategoryPreset = ({
  categories,
  handle,
}: {
  categories: StoreCategoryNode[]
  handle?: string | null
}) => {
  const { setUiState } = useInstantSearch()
  const previous = useRef(handle)

  useEffect(() => {
    if (previous.current === handle) {
      return
    }
    previous.current = handle

    const values = getCategoryFacetValues(categories, handle)

    setUiState((uiState) => {
      const index = uiState[PRODUCT_INDEX_NAME] ?? {}
      const refinementList = { ...(index.refinementList ?? {}) }

      if (values.length) {
        refinementList[CATEGORY_ATTRIBUTE] = values
      } else {
        delete refinementList[CATEGORY_ATTRIBUTE]
      }

      return {
        ...uiState,
        [PRODUCT_INDEX_NAME]: { ...index, refinementList, page: undefined },
      }
    })
  }, [categories, handle, setUiState])

  return null
}

/**
 * The line above the page title. Default: `FORSTEK / THE STORE`. With exactly
 * one category selected it becomes the clickable trail
 * `FORSTEK / Root / ... / Active`.
 */
export const StoreEyebrow = ({
  categories,
}: {
  categories: StoreCategoryNode[]
}) => {
  const t = useT()
  const state = useCategoryState(categories)

  if (state.kind !== "single") {
    return (
      <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500">
        FORSTEK <span className="text-zinc-700">/</span>{" "}
        {t("store.page.eyebrow")}
      </span>
    )
  }

  const linkClass = "transition-colors duration-300 hover:text-white"
  const last = state.trail.length - 1

  return (
    <nav
      aria-label={t("store.breadcrumb")}
      data-testid="store-breadcrumb"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500"
    >
      <LocalizedClientLink href="/" className={linkClass}>
        FORSTEK
      </LocalizedClientLink>
      {state.trail.map((category, index) => (
        <Fragment key={category.id}>
          <span aria-hidden="true" className="text-zinc-700">
            /
          </span>
          {index === last ? (
            <span aria-current="page" className="text-zinc-300">
              {category.label}
            </span>
          ) : (
            <LocalizedClientLink
              href={`/store?category=${encodeURIComponent(category.handle)}`}
              className={linkClass}
            >
              {category.label}
            </LocalizedClientLink>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

/** Page title: "All products", the selected category, or "Mixed". */
export const StoreTitle = ({
  categories,
}: {
  categories: StoreCategoryNode[]
}) => {
  const t = useT()
  const state = useCategoryState(categories)

  if (state.kind === "single") {
    return <>{state.category.label}</>
  }

  return <>{state.kind === "mixed" ? t("store.mixed") : t("store.page.title")}</>
}
