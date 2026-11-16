import { getT } from "@lib/i18n/server"
import { clx } from "@modules/common/components/ui"

type SearchFormProps = {
  countryCode: string
  defaultValue?: string
  className?: string
}

/** Plain GET form so search works without JavaScript and for browser agents. */
const SearchForm = async ({
  countryCode,
  defaultValue,
  className,
}: SearchFormProps) => {
  const t = await getT()

  return (
  <form
    role="search"
    method="get"
    action={`/${countryCode}/search`}
    className={clx("flex gap-2", className)}
    {...{
      toolname: "search_products",
      tooldescription: "Search the store's products by keyword",
    }}
  >
    <label htmlFor="search-q" className="sr-only">
      {t("layout.searchForm.label")}
    </label>
    <input
      id="search-q"
      type="search"
      name="q"
      defaultValue={defaultValue}
      placeholder={t("layout.searchForm.placeholder")}
      className="flex-1 h-10 px-4 border rounded-md border-ui-border-base bg-ui-bg-field txt-compact-medium"
    />
    <button
      type="submit"
      className="h-10 px-4 rounded-md bg-black text-white hover:bg-gray-800"
    >
      {t("layout.searchForm.submit")}
    </button>
  </form>
  )
}

export default SearchForm
