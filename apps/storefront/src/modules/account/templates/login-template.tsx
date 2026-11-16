
"use client"

import { useState } from "react"

import { useT } from "@lib/i18n/provider"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const t = useT()
  const [currentView, setCurrentView] = useState(LOGIN_VIEW.SIGN_IN)

  const isSignIn = currentView === LOGIN_VIEW.SIGN_IN

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#08090b] px-5 py-12 text-white sm:px-8 sm:py-16">
      <main className="w-full max-w-[460px]">
        <div className="mb-9 border-b border-white/10 pb-8 sm:mb-10">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/40">
            {t("account.eyebrow")}
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {isSignIn
              ? t("account.loginTemplate.welcome")
              : t("account.loginTemplate.createTitle")}
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-white/45">
            {isSignIn
              ? t("account.loginTemplate.signInText")
              : t("account.loginTemplate.createText")}
          </p>
        </div>

        {isSignIn ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}

        <div className="mt-10 border-t border-white/[0.07] pt-5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
            {t("account.loginTemplate.footer")}
          </p>
        </div>
      </main>
    </div>
  )
}

export default LoginTemplate
