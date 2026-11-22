/**
 * Stage 2: French and Arabic translations for the catalogue, using Medusa's
 * official Translation Module. Requires `featureFlags: { translation: true }`
 * in medusa-config.ts and `npx medusa db:migrate` to have been run.
 *
 *   npx medusa exec ./src/scripts/seed-translations.ts dry   # report only
 *   npx medusa exec ./src/scripts/seed-translations.ts       # apply
 *
 * What it does:
 *  1. Makes sure the store supports en-US, fr-FR and ar-SA (existing supported
 *     locales are kept).
 *  2. Reads every product, variant, category, collection, tag, type, option and
 *     option value, and translates the text it has a translation for
 *     (src/scripts/data/catalog-translations.ts).
 *  3. Creates a translation per record and locale. Existing translation records
 *     are never overwritten; only fields they are missing are added.
 *  4. Writes everything it could not translate to
 *     untranslated-catalog.json, so it can be translated properly instead of
 *     guessed. English records, prices, handles, ids, images and relationships
 *     are never touched.
 *
 * Safe to run again: it only creates what is missing.
 */
import { writeFileSync } from "node:fs"
import { join } from "node:path"

import type { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  batchTranslationsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

import { Lang, translateText } from "./data/catalog-translations"

/** English is the original content, so it is supported but never translated. */
const BASE_LOCALE = "en-US"
const TRANSLATED_LOCALES: { code: string; lang: Lang }[] = [
  { code: "fr-FR", lang: "fr" },
  { code: "ar-SA", lang: "ar" },
]

type Row = Record<string, unknown>

/** The fields to translate on each translatable entity (`reference`). */
const ENTITIES: {
  reference: string
  entity: string
  fields: string[]
  extra?: string[]
}[] = [
  {
    reference: "product",
    entity: "product",
    fields: ["title", "subtitle", "description", "material"],
  },
  {
    reference: "product_variant",
    entity: "product_variant",
    fields: ["title", "material"],
  },
  {
    reference: "product_category",
    entity: "product_category",
    fields: ["name", "description"],
  },
  {
    reference: "product_collection",
    entity: "product_collection",
    fields: ["title"],
  },
  { reference: "product_tag", entity: "product_tag", fields: ["value"] },
  { reference: "product_type", entity: "product_type", fields: ["value"] },
  { reference: "product_option", entity: "product_option", fields: ["title"] },
  {
    reference: "product_option_value",
    entity: "product_option_value",
    fields: ["value"],
  },
]

const PAGE_SIZE = 500

export default async function seedTranslations({ container, args }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const translationService = container.resolve(Modules.TRANSLATION) as any
  const dry = (args ?? []).includes("dry")

  logger.info(
    dry ? "Translation seed: DRY RUN (nothing is written)" : "Translation seed"
  )

  // ---- 1. Store locales ------------------------------------------------------

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "supported_locales.locale_code"],
  })
  const store = stores[0]

  if (!store) {
    throw new Error("No store found. Run the initial data seed first.")
  }

  const currentLocales = ((store.supported_locales ?? []) as Row[])
    .map((locale) => locale?.locale_code)
    .filter((code): code is string => typeof code === "string")
  const wantedLocales = Array.from(
    new Set([
      ...currentLocales,
      BASE_LOCALE,
      ...TRANSLATED_LOCALES.map((locale) => locale.code),
    ])
  )

  if (wantedLocales.length !== currentLocales.length) {
    logger.info(`Store locales: ${wantedLocales.join(", ")}`)
    if (!dry) {
      await updateStoresWorkflow(container).run({
        input: {
          selector: { id: store.id },
          update: {
            supported_locales: wantedLocales.map((locale_code) => ({
              locale_code,
            })),
          },
        },
      })
    }
  } else {
    logger.info(`Store locales already set: ${currentLocales.join(", ")}`)
  }

  // ---- 2. What can be translated --------------------------------------------

  let translatable: Record<string, string[]> | null = null
  try {
    const result = await translationService.getTranslatableFields()
    translatable = result && typeof result === "object" ? result : null
  } catch (error) {
    logger.warn(
      `Could not read translatable fields (${(error as Error).message}). Is the translation feature flag on and the migration run?`
    )
  }

  // ---- 3. Read the catalogue -------------------------------------------------

  const fetchAll = async (entity: string, fields: string[]) => {
    const rows: Row[] = []
    for (let skip = 0; ; skip += PAGE_SIZE) {
      const { data } = await query.graph({
        entity,
        fields,
        pagination: { skip, take: PAGE_SIZE },
      })
      rows.push(...(data as Row[]))
      if (data.length < PAGE_SIZE) break
    }
    return rows
  }

  type Pending = {
    reference: string
    reference_id: string
    locale_code: string
    translations: Record<string, string>
  }

  const wanted: Pending[] = []
  const untranslated: {
    reference: string
    reference_id: string
    field: string
    locale_code: string
    value: string
  }[] = []

  for (const { reference, entity, fields } of ENTITIES) {
    const allowed = translatable?.[reference]
    const usable = allowed ? fields.filter((f) => allowed.includes(f)) : fields

    if (allowed && usable.length < fields.length) {
      logger.warn(
        `${reference}: not translatable here, skipped fields: ${fields
          .filter((f) => !usable.includes(f))
          .join(", ")}`
      )
    }
    if (!usable.length) continue

    let rows: Row[]
    try {
      rows = await fetchAll(entity, ["id", ...usable])
    } catch (error) {
      logger.warn(`${reference}: could not be read (${(error as Error).message})`)
      continue
    }

    for (const row of rows) {
      for (const { code, lang } of TRANSLATED_LOCALES) {
        const translations: Record<string, string> = {}

        for (const field of usable) {
          const original = row[field]
          if (typeof original !== "string" || !original.trim()) continue

          const translated = translateText(
            original,
            lang,
            reference === "product_variant" && field === "title"
          )

          if (translated && translated !== original) {
            translations[field] = translated
          } else if (!translated) {
            untranslated.push({
              reference,
              reference_id: row.id as string,
              field,
              locale_code: code,
              value: original,
            })
          }
        }

        if (Object.keys(translations).length) {
          wanted.push({
            reference,
            reference_id: row.id as string,
            locale_code: code,
            translations,
          })
        }
      }
    }
  }

  // ---- 4. Compare with what exists ------------------------------------------

  const existing = new Map<string, { id: string; translations: Row }>()
  for (let start = 0; start < wanted.length; start += PAGE_SIZE) {
    const ids = Array.from(
      new Set(wanted.slice(start, start + PAGE_SIZE).map((w) => w.reference_id))
    )
    const found = (await translationService.listTranslations(
      { reference_id: ids },
      { take: null }
    )) as { id: string; reference_id: string; locale_code: string; translations: Row }[]

    for (const record of found) {
      existing.set(`${record.reference_id}:${record.locale_code}`, {
        id: record.id,
        translations: record.translations ?? {},
      })
    }
  }

  const create: Pending[] = []
  const update: { id: string; translations: Record<string, string> }[] = []
  let unchanged = 0

  for (const item of wanted) {
    const current = existing.get(`${item.reference_id}:${item.locale_code}`)

    if (!current) {
      create.push(item)
      continue
    }

    // Keep what is already translated; only add fields that are missing.
    const missing = Object.fromEntries(
      Object.entries(item.translations).filter(([field]) => {
        const value = current.translations[field]
        return typeof value !== "string" || !value.trim()
      })
    )

    if (Object.keys(missing).length) {
      update.push({
        id: current.id,
        translations: {
          ...(current.translations as Record<string, string>),
          ...missing,
        },
      })
    } else {
      unchanged += 1
    }
  }

  // ---- 5. Write --------------------------------------------------------------

  logger.info(
    `Translations: ${create.length} to create, ${update.length} to complete, ${unchanged} already done.`
  )

  if (!dry) {
    for (let start = 0; start < Math.max(create.length, update.length); start += 100) {
      await batchTranslationsWorkflow(container).run({
        input: {
          create: create.slice(start, start + 100),
          update: update.slice(start, start + 100),
          delete: [],
        },
      })
    }
  }

  // ---- 6. Report what still needs a translator ------------------------------

  const byReference = new Map<string, number>()
  for (const item of untranslated) {
    byReference.set(item.reference, (byReference.get(item.reference) ?? 0) + 1)
  }

  if (untranslated.length) {
    const file = join(process.cwd(), "untranslated-catalog.json")
    writeFileSync(file, JSON.stringify(untranslated, null, 2))
    logger.warn(
      `${untranslated.length} field value(s) have no translation yet (${Array.from(
        byReference.entries()
      )
        .map(([reference, count]) => `${reference}: ${count}`)
        .join(", ")}). Listed in ${file}`
    )
  } else {
    logger.info("Every translatable field has a translation.")
  }

  logger.info(dry ? "Dry run finished." : "Translation seed finished.")
}
