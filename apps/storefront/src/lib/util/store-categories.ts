/**
 * A product category as the unified /store page needs it. `name` is the
 * default-language name, which is what the search index stores under its
 * `category` facet. `label` is the name in the active locale, for display.
 */
export type StoreCategoryNode = {
  id: string
  handle: string
  name: string
  label: string
  parentId: string | null
}

export type StoreCategoryState =
  | { kind: "none" }
  | { kind: "single"; category: StoreCategoryNode; trail: StoreCategoryNode[] }
  | { kind: "mixed" }

/** Original (indexed) category name -> name in the active locale. */
export const getCategoryLabels = (categories: StoreCategoryNode[]) =>
  Object.fromEntries(
    categories.map((category) => [category.name.trim(), category.label])
  ) as Record<string, string>

const getChildren = (categories: StoreCategoryNode[], parentId: string) =>
  categories.filter((category) => category.parentId === parentId)

/** The category and every category below it. */
const getSubtree = (
  categories: StoreCategoryNode[],
  root: StoreCategoryNode
): StoreCategoryNode[] => {
  const result: StoreCategoryNode[] = []
  const seen = new Set<string>()
  const queue = [root]

  while (queue.length) {
    const current = queue.shift()!
    if (seen.has(current.id)) continue
    seen.add(current.id)
    result.push(current)
    queue.push(...getChildren(categories, current.id))
  }

  return result
}

/** Facet values that select a category together with its sub-categories. */
export const getSubtreeNames = (
  categories: StoreCategoryNode[],
  root: StoreCategoryNode
) => Array.from(new Set(getSubtree(categories, root).map((c) => c.name.trim())))

/** Root-to-leaf chain, so the category itself is always the last item. */
export const getAncestry = (
  categories: StoreCategoryNode[],
  leaf: StoreCategoryNode
): StoreCategoryNode[] => {
  const byId = new Map(categories.map((c) => [c.id, c]))
  const chain: StoreCategoryNode[] = []
  const seen = new Set<string>()
  let current: StoreCategoryNode | undefined = leaf

  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    chain.unshift(current)
    current = current.parentId ? byId.get(current.parentId) : undefined
  }

  return chain
}

/**
 * Root-to-leaf trail for a product: of the categories it is assigned to, the
 * deepest one (the most specific) and its ancestors. Empty when it has none.
 */
export const getProductTrail = (
  categories: StoreCategoryNode[],
  productCategoryIds: string[]
): StoreCategoryNode[] => {
  const assigned = new Set(productCategoryIds)
  let best: StoreCategoryNode[] = []

  for (const category of categories) {
    if (!assigned.has(category.id)) continue
    const trail = getAncestry(categories, category)
    if (trail.length > best.length) best = trail
  }

  return best
}

const sameSet = (a: string[], b: string[]) => {
  const left = new Set(a)
  const right = new Set(b)
  return left.size === right.size && Array.from(left).every((value) => right.has(value))
}

/**
 * Reads the selected `category` facet values:
 * - none selected: "none";
 * - one selected: "single", with its root-to-leaf trail;
 * - several selected: "mixed", unless they are exactly a category plus its
 *   sub-categories (what a link to a parent category selects), which counts as
 *   that parent being selected.
 */
export const resolveCategoryState = (
  categories: StoreCategoryNode[],
  selectedNames: string[]
): StoreCategoryState => {
  if (selectedNames.length === 0) {
    return { kind: "none" }
  }

  const category =
    selectedNames.length === 1
      ? categories.find((c) => c.name.trim() === selectedNames[0])
      : categories.find(
          (c) =>
            getChildren(categories, c.id).length > 0 &&
            sameSet(getSubtreeNames(categories, c), selectedNames)
        )

  if (category) {
    return {
      kind: "single",
      category,
      trail: getAncestry(categories, category),
    }
  }

  return selectedNames.length === 1 ? { kind: "none" } : { kind: "mixed" }
}
