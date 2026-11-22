/**
 * French and Arabic text for the records this project's seed scripts create.
 *
 * Records are matched by their exact English text, so nothing here depends on
 * ids. Anything that has no entry is NOT translated (and is listed by
 * seed-translations.ts so it can be translated properly) rather than guessed.
 */

export type Lang = "fr" | "ar"
export type Pair = { fr: string; ar: string }

/** Exact English text -> translation. Used for every translatable field. */
export const TEXT: Record<string, Pair> = {
  // Categories (initial-data-seed.ts)
  Clothing: { fr: "Vêtements", ar: "ملابس" },
  "Sports & Nutrition": {
    fr: "Sport et nutrition",
    ar: "الرياضة والتغذية",
  },
  "Lifestyle & Home": {
    fr: "Style de vie et maison",
    ar: "نمط الحياة والمنزل",
  },
  "Electronics & Gadgets": {
    fr: "Électronique et gadgets",
    ar: "الإلكترونيات والأجهزة الذكية",
  },
  Shirts: { fr: "Chemises", ar: "قمصان" },
  Sweatshirts: { fr: "Sweat-shirts", ar: "سويت شيرت" },
  Pants: { fr: "Pantalons", ar: "بناطيل" },
  Merch: { fr: "Produits dérivés", ar: "منتجات ترويجية" },

  // Collections (seed-demo-products.ts)
  "Summer Essentials": { fr: "Essentiels d'été", ar: "أساسيات الصيف" },
  "Winter Layers": { fr: "Vêtements d'hiver", ar: "ملابس الشتاء" },
  "Everyday Basics": { fr: "Basiques du quotidien", ar: "أساسيات يومية" },
  "Limited Run": { fr: "Série limitée", ar: "إصدار محدود" },

  // Tags
  sale: { fr: "Soldes", ar: "تخفيضات" },
  "new-arrival": { fr: "Nouveauté", ar: "وصل حديثًا" },
  organic: { fr: "Bio", ar: "عضوي" },
  unisex: { fr: "Unisexe", ar: "للجنسين" },
  bestseller: { fr: "Meilleure vente", ar: "الأكثر مبيعًا" },
  "last-chance": { fr: "Dernière chance", ar: "الفرصة الأخيرة" },

  // Product options
  Size: { fr: "Taille", ar: "المقاس" },
  Color: { fr: "Couleur", ar: "اللون" },
  Material: { fr: "Matière", ar: "الخامة" },
  Fit: { fr: "Coupe", ar: "القَصّة" },
  Sleeve: { fr: "Manche", ar: "الكم" },

  // Option values
  Black: { fr: "Noir", ar: "أسود" },
  White: { fr: "Blanc", ar: "أبيض" },
  Cotton: { fr: "Coton", ar: "قطن" },
  Linen: { fr: "Lin", ar: "كتان" },
  Merino: { fr: "Mérinos", ar: "ميرينو" },
  Fleece: { fr: "Polaire", ar: "فليس" },
  Denim: { fr: "Denim", ar: "دنيم" },
  Twill: { fr: "Sergé", ar: "تويل" },
  Regular: { fr: "Classique", ar: "عادية" },
  Slim: { fr: "Ajustée", ar: "ضيقة" },
  Relaxed: { fr: "Décontractée", ar: "مريحة" },
  Short: { fr: "Courtes", ar: "قصير" },
  Long: { fr: "Longues", ar: "طويل" },

  // Products (initial-data-seed.ts)
  "Medusa T-Shirt": { fr: "T-shirt Medusa", ar: "تيشيرت ميدوسا" },
  "Medusa Sweatshirt": { fr: "Sweat-shirt Medusa", ar: "سويت شيرت ميدوسا" },
  "Medusa Sweatpants": {
    fr: "Pantalon de jogging Medusa",
    ar: "بنطال رياضي ميدوسا",
  },
  "Medusa Shorts": { fr: "Short Medusa", ar: "شورت ميدوسا" },
  "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.":
    {
      fr: "Réinventez la sensation d'un T-shirt classique. Avec nos T-shirts en coton, les basiques du quotidien n'ont plus rien d'ordinaire.",
      ar: "أعد تخيّل إحساس التيشيرت الكلاسيكي. مع تيشيرتاتنا القطنية، لم تعد أساسيات الحياة اليومية عادية.",
    },
  "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.":
    {
      fr: "Réinventez la sensation d'un sweat-shirt classique. Avec notre sweat-shirt en coton, les basiques du quotidien n'ont plus rien d'ordinaire.",
      ar: "أعد تخيّل إحساس السويت شيرت الكلاسيكي. مع سويت شيرتنا القطني، لم تعد أساسيات الحياة اليومية عادية.",
    },
  "Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.":
    {
      fr: "Réinventez la sensation d'un pantalon de jogging classique. Avec notre pantalon de jogging en coton, les basiques du quotidien n'ont plus rien d'ordinaire.",
      ar: "أعد تخيّل إحساس البنطال الرياضي الكلاسيكي. مع بنطالنا الرياضي القطني، لم تعد أساسيات الحياة اليومية عادية.",
    },
  "Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.":
    {
      fr: "Réinventez la sensation d'un short classique. Avec notre short en coton, les basiques du quotidien n'ont plus rien d'ordinaire.",
      ar: "أعد تخيّل إحساس الشورت الكلاسيكي. مع شورتنا القطني، لم تعد أساسيات الحياة اليومية عادية.",
    },
}

// ---- Demo products (seed-demo-products.ts) -----------------------------------
//
// Titles are generated as "<adjective> <material> <type>", subtitles as
// "<type> — demo data" and descriptions from a fixed sentence, so they can be
// translated by parts. French adjectives agree with the type's gender.

type Gender = "m" | "f" | "fp"

const ADJECTIVES: Record<
  string,
  { fr: Record<Gender, string>; ar: { m: string; f: string } }
> = {
  Vintage: {
    fr: { m: "vintage", f: "vintage", fp: "vintage" },
    ar: { m: "عتيق", f: "عتيقة" },
  },
  Classic: {
    fr: { m: "classique", f: "classique", fp: "classiques" },
    ar: { m: "كلاسيكي", f: "كلاسيكية" },
  },
  Relaxed: {
    fr: { m: "décontracté", f: "décontractée", fp: "décontractées" },
    ar: { m: "مريح", f: "مريحة" },
  },
  Tailored: {
    fr: { m: "cintré", f: "cintrée", fp: "cintrées" },
    ar: { m: "مفصّل", f: "مفصّلة" },
  },
  Oversized: {
    fr: { m: "oversize", f: "oversize", fp: "oversize" },
    ar: { m: "واسع", f: "واسعة" },
  },
  Everyday: {
    fr: { m: "quotidien", f: "quotidienne", fp: "quotidiennes" },
    ar: { m: "يومي", f: "يومية" },
  },
  Heritage: {
    fr: { m: "héritage", f: "héritage", fp: "héritage" },
    ar: { m: "تراثي", f: "تراثية" },
  },
  Essential: {
    fr: { m: "essentiel", f: "essentielle", fp: "essentielles" },
    ar: { m: "أساسي", f: "أساسية" },
  },
  Cropped: {
    fr: { m: "court", f: "courte", fp: "courtes" },
    ar: { m: "قصير", f: "قصيرة" },
  },
  Lightweight: {
    fr: { m: "léger", f: "légère", fp: "légères" },
    ar: { m: "خفيف", f: "خفيفة" },
  },
}

const TYPES: Record<
  string,
  { fr: string; frGender: Gender; ar: string; arGender: "m" | "f" }
> = {
  Tee: { fr: "T-shirt", frGender: "m", ar: "تيشيرت", arGender: "m" },
  Hoodie: {
    fr: "Sweat à capuche",
    frGender: "m",
    ar: "هودي",
    arGender: "m",
  },
  Sweatshirt: {
    fr: "Sweat-shirt",
    frGender: "m",
    ar: "سويت شيرت",
    arGender: "m",
  },
  Shorts: { fr: "Short", frGender: "m", ar: "شورت", arGender: "m" },
  Joggers: { fr: "Jogging", frGender: "m", ar: "بنطال جوجر", arGender: "m" },
  Overshirt: {
    fr: "Surchemise",
    frGender: "f",
    ar: "قميص خارجي",
    arGender: "m",
  },
  Cap: { fr: "Casquette", frGender: "f", ar: "قبعة", arGender: "f" },
  Socks: { fr: "Chaussettes", frGender: "fp", ar: "جوارب", arGender: "f" },
  Tote: { fr: "Sac cabas", frGender: "m", ar: "حقيبة قماشية", arGender: "f" },
  Beanie: { fr: "Bonnet", frGender: "m", ar: "قبعة صوفية", arGender: "f" },
}

const MATERIALS = ["Cotton", "Linen", "Merino", "Denim", "Fleece", "Twill"]

const TITLE_RE = new RegExp(
  `^(${Object.keys(ADJECTIVES).join("|")}) (${MATERIALS.join("|")}) (${Object.keys(TYPES).join("|")})$`
)
const SUBTITLE_RE = new RegExp(`^(${Object.keys(TYPES).join("|")}) — demo data$`)
const DESCRIPTION_RE =
  /^A (.+) generated to fill out the demo catalogue\. Not a real product\.$/

const lowerFirst = (value: string) =>
  value.charAt(0).toLowerCase() + value.slice(1)

const translateDemoTitle = (title: string, lang: Lang): string | null => {
  const match = TITLE_RE.exec(title)
  if (!match) return null

  const [, adjective, material, type] = match
  const adj = ADJECTIVES[adjective]
  const kind = TYPES[type]
  const materialText = TEXT[material][lang]

  if (lang === "fr") {
    return `${kind.fr} ${adj.fr[kind.frGender]} en ${lowerFirst(materialText)}`
  }

  return `${kind.ar} ${adj.ar[kind.arGender]} من ${materialText}`
}

const FR_ARTICLE: Record<Gender, string> = { m: "Un", f: "Une", fp: "Des" }
const FR_PARTICIPLE: Record<Gender, string> = {
  m: "généré",
  f: "générée",
  fp: "générées",
}

/** Translates the generated demo-product text, or returns null. */
const translateDemo = (text: string, lang: Lang): string | null => {
  const title = translateDemoTitle(text, lang)
  if (title) return title

  const subtitle = SUBTITLE_RE.exec(text)
  if (subtitle) {
    const kind = TYPES[subtitle[1]]
    return lang === "fr"
      ? `${kind.fr} — données de démonstration`
      : `${kind.ar} — بيانات تجريبية`
  }

  const description = DESCRIPTION_RE.exec(text)
  if (description) {
    // The seed lower-cases the title, so match it back case-insensitively.
    const lowered = description[1]
    const original = Object.keys(ADJECTIVES)
      .flatMap((adjective) =>
        MATERIALS.flatMap((material) =>
          Object.keys(TYPES).map((type) => `${adjective} ${material} ${type}`)
        )
      )
      .find((candidate) => candidate.toLowerCase() === lowered)
    const translatedTitle = original && translateDemoTitle(original, lang)
    if (!original || !translatedTitle) return null

    if (lang === "fr") {
      const gender = TYPES[original.split(" ")[2]].frGender
      return `${FR_ARTICLE[gender]} ${lowerFirst(translatedTitle)} ${FR_PARTICIPLE[gender]} pour remplir le catalogue de démonstration. Ce n'est pas un vrai produit.`
    }

    return `تم إنشاء ${translatedTitle} لملء كتالوج العرض التجريبي. هذا ليس منتجًا حقيقيًا.`
  }

  return null
}

/** " / "-joined option values, e.g. a variant title "S / Black". */
const translateVariantTitle = (text: string, lang: Lang): string | null => {
  const parts = text.split(" / ")
  if (parts.length < 1) return null

  const translated = parts.map((part) => TEXT[part]?.[lang] ?? part)
  const known = parts.every(
    (part) => TEXT[part] || /^(XXS|XS|S|M|L|XL|XXL)$/.test(part)
  )

  return known ? translated.join(" / ") : null
}

/**
 * The translation of one English field value, or null when there is none.
 * Never guesses: unknown text stays untranslated.
 */
export const translateText = (
  text: string,
  lang: Lang,
  isVariantTitle = false
): string | null => {
  const value = text.trim()
  if (!value) return null

  const exact = TEXT[value]?.[lang]
  if (exact) return exact

  const demo = translateDemo(value, lang)
  if (demo) return demo

  return isVariantTitle ? translateVariantTitle(value, lang) : null
}
