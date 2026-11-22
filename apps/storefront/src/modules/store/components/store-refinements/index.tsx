
"use client"

import { useSortBy } from "react-instantsearch"

import { useT } from "@lib/i18n/provider"
import {
  getCategoryLabels,
  type StoreCategoryNode,
} from "@lib/util/store-categories"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import {
  CATEGORY_ATTRIBUTE,
  LABELS_ATTRIBUTE,
  getSortOptions,
} from "./attributes"
import CurrentRefinements from "./current-refinements"
import OnSaleToggle from "./on-sale-toggle"
import OptionRefinements from "./option-refinements"
import PriceRange from "./price-range"
import RefinementGroup from "./refinement-group"

const SortProducts = ({ currencyCode }: { currencyCode: string }) => {
  const t = useT()
  const items = getSortOptions(currencyCode, t)
  const { currentRefinement, refine } = useSortBy({ items })

  return (
    <FilterRadioGroup
      title={t("store.refinements.sortBy")}
      items={items}
      value={currentRefinement}
      handleChange={refine}
      data-testid="sort-by-container"
    />
  )
}

const StoreRefinements = ({
  currencyCode,
  categories = [],
}: {
  currencyCode: string
  categories?: StoreCategoryNode[]
}) => {
  const t = useT()

  return (
    <div className="flex flex-col gap-8 py-2">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            {t("store.refinements.ordering")}
          </span>
          <span className="font-mono text-[9px] text-zinc-700">01</span>
        </div>
        <SortProducts currencyCode={currencyCode} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            {t("store.refinements.activeFilters")}
          </span>
          <span className="font-mono text-[9px] text-zinc-700">02</span>
        </div>
        <CurrentRefinements
          currencyCode={currencyCode}
          categories={categories}
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            {t("store.refinements.productOptions")}
          </span>
          <span className="font-mono text-[9px] text-zinc-700">03</span>
        </div>
        <OptionRefinements />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            {t("store.refinements.price")}
          </span>
          <span className="font-mono text-[9px] text-zinc-700">04</span>
        </div>
        <PriceRange currencyCode={currencyCode} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            {t("store.refinements.offers")}
          </span>
          <span className="font-mono text-[9px] text-zinc-700">05</span>
        </div>
        <OnSaleToggle currencyCode={currencyCode} />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            {t("store.refinements.categories")}
          </span>
          <span className="font-mono text-[9px] text-zinc-700">06</span>
        </div>
        <RefinementGroup
          attribute={CATEGORY_ATTRIBUTE}
          title={t("store.refinements.category")}
          labels={getCategoryLabels(categories)}
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">
            {t("store.refinements.labels")}
          </span>
          <span className="font-mono text-[9px] text-zinc-700">07</span>
        </div>
        <RefinementGroup
          attribute={LABELS_ATTRIBUTE}
          title={t("store.refinements.labelsTitle")}
        />
      </div>
    </div>
  )
}

export default StoreRefinements
