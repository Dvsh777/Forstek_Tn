
"use client"

import { login } from "@lib/data/customer"
import { useT } from "@lib/i18n/provider"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const t = useT()
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="flex w-full flex-col text-white" data-testid="login-page">
      {message?.state === "verification_required" && (
        <div
          className="mb-6 w-full border border-white/15 bg-white/[0.04] p-4 text-sm leading-relaxed text-white/75"
          data-testid="login-verification-message"
        >
          {t("account.login.verificationBefore")}{" "}
          <strong className="break-all text-white">{message.email}</strong>
          {t("account.login.verificationAfter")}
        </div>
      )}

      <form className="w-full" action={formAction}>
        <div className="flex w-full flex-col gap-y-6">
          <Input
            label={t("account.login.email")}
            name="email"
            type="email"
            title={t("checkout.fields.emailTitle")}
            autoComplete="email"
            required
            data-testid="email-input"
          />

          <Input
            label={t("account.login.password")}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>

        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />

        <SubmitButton
          data-testid="sign-in-button"
          className="mt-7 w-full"
        >
          {t("account.login.signIn")}
        </SubmitButton>
      </form>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[10px] uppercase tracking-wider text-white/30">
          {t("account.login.newHere")}
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <button
        type="button"
        onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
        className="w-full border border-white/20 px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-white hover:text-black"
        data-testid="register-button"
      >
        {t("account.login.createAccount")}
      </button>
    </div>
  )
}

export default Login
