"use client"

import { Fragment } from "react"

import { useT } from "@lib/i18n/provider"
import type { StoreCategoryNode } from "@lib/util/store-categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * `FORSTEK / Root / ... / Category / Product`, in the same style as the
 * breadcrumb on the store page. Categories link to the store filtered to that
 * category; the product name is the current page.
 */
const ProductBreadcrumb = ({
  trail,
  productTitle,
}: {
  trail: StoreCategoryNode[]
  productTitle: string
}) => {
  const t = useT()
  const linkClass = "transition-colors duration-300 hover:text-white"

  return (
    <nav
      aria-label={t("store.breadcrumb")}
      data-testid="product-breadcrumb"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-start font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500"
    >
      <LocalizedClientLink href="/" className={linkClass}>
        FORSTEK
      </LocalizedClientLink>
      {trail.map((category) => (
        <Fragment key={category.id}>
          <span aria-hidden="true" className="text-zinc-700">
            /
          </span>
          <LocalizedClientLink
            href={`/store?category=${encodeURIComponent(category.handle)}`}
            className={linkClass}
          >
            {category.label}
          </LocalizedClientLink>
        </Fragment>
      ))}
      <span aria-hidden="true" className="text-zinc-700">
        /
      </span>
      <span aria-current="page" className="min-w-0 break-words text-zinc-300">
        {productTitle}
      </span>
    </nav>
  )
}

export default ProductBreadcrumb
