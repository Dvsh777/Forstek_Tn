import { AppLanguage } from "../config"

import enLayout from "./en/layout.json"
import enHome from "./en/home.json"
import enVerticals from "./en/verticals.json"
import enStore from "./en/store.json"
import enProduct from "./en/product.json"
import enCart from "./en/cart.json"
import enCommon from "./en/common.json"
import enCheckout from "./en/checkout.json"
import enAccount from "./en/account.json"
import enOrder from "./en/order.json"
import enPolicies from "./en/policies.json"

import frLayout from "./fr/layout.json"
import frHome from "./fr/home.json"
import frVerticals from "./fr/verticals.json"
import frStore from "./fr/store.json"
import frProduct from "./fr/product.json"
import frCart from "./fr/cart.json"
import frCommon from "./fr/common.json"
import frCheckout from "./fr/checkout.json"
import frAccount from "./fr/account.json"
import frOrder from "./fr/order.json"
import frPolicies from "./fr/policies.json"

import arLayout from "./ar/layout.json"
import arHome from "./ar/home.json"
import arVerticals from "./ar/verticals.json"
import arStore from "./ar/store.json"
import arProduct from "./ar/product.json"
import arCart from "./ar/cart.json"
import arCommon from "./ar/common.json"
import arCheckout from "./ar/checkout.json"
import arAccount from "./ar/account.json"
import arOrder from "./ar/order.json"
import arPolicies from "./ar/policies.json"

// One namespace per JSON file. Add new files here (all three languages).
const dictionaries: Record<AppLanguage, Record<string, unknown>> = {
  en: {
    layout: enLayout,
    home: enHome,
    verticals: enVerticals,
    store: enStore,
    product: enProduct,
    cart: enCart,
    common: enCommon,
    checkout: enCheckout,
    account: enAccount,
    order: enOrder,
    policies: enPolicies,
  },
  fr: {
    layout: frLayout,
    home: frHome,
    verticals: frVerticals,
    store: frStore,
    product: frProduct,
    cart: frCart,
    common: frCommon,
    checkout: frCheckout,
    account: frAccount,
    order: frOrder,
    policies: frPolicies,
  },
  ar: {
    layout: arLayout,
    home: arHome,
    verticals: arVerticals,
    store: arStore,
    product: arProduct,
    cart: arCart,
    common: arCommon,
    checkout: arCheckout,
    account: arAccount,
    order: arOrder,
    policies: arPolicies,
  },
}

export function getDictionary(language: AppLanguage): Record<string, unknown> {
  return dictionaries[language] ?? dictionaries.en
}
