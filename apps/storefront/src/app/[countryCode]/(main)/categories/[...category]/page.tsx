import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
}

// Category pages now live on the unified store page. Old category links land
// there with the category (the last handle of the path) already applied.
export default async function CategoryPage(props: Props) {
  const { category, countryCode } = await props.params
  const handle = category[category.length - 1]

  redirect(`/${countryCode}/store?category=${encodeURIComponent(handle)}`)
}
