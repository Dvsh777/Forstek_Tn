import { Metadata } from "next"

import { getT } from "@lib/i18n/server"
import LoginTemplate from "@modules/account/templates/login-template"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return {
    title: t("account.pages.login.title"),
    description: t("account.pages.login.description"),
  }
}

export default function Login() {
  return <LoginTemplate />
}
