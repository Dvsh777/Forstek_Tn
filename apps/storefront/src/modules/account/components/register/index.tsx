
"use client"

import { useActionState } from "react"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { useT } from "@lib/i18n/provider"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const t = useT()
  const [message, formAction] = useActionState(signup, null)

  const fieldClass =
    "w-full h-12 px-4 bg-[#17181b] border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/40 transition-colors"

  const labelClass =
    "block text-xs font-medium text-white/65 mb-2"

  return (
    <div
      className="w-full flex flex-col"
      data-testid="register-page"
    >
      <div className="mb-7">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-3">
          {t("account.eyebrow")}
        </p>

        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {t("account.register.title")}
        </h2>

        <p className="text-sm leading-6 text-white/45 mt-2">
          {t("account.register.text")}
        </p>
      </div>

      {message?.state === "verification_required" && (
        <div
          className="w-full mb-5 p-4 border border-emerald-500/20 bg-emerald-500/5 text-sm text-white/75 leading-6"
          data-testid="register-verification-message"
        >
          {t("account.register.verificationBefore")}{" "}
          <strong className="text-white">{message.email}</strong>
          {t("account.register.verificationAfter")}
        </div>
      )}

      <form className="w-full flex flex-col gap-5" action={formAction}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="register-first-name">
              {t("account.register.firstName")}{" "}
              <span className="text-white/35">*</span>
            </label>
            <input
              id="register-first-name"
              className={fieldClass}
              name="first_name"
              placeholder={t("account.register.firstName")}
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="register-last-name">
              {t("account.register.lastName")}{" "}
              <span className="text-white/35">*</span>
            </label>
            <input
              id="register-last-name"
              className={fieldClass}
              name="last_name"
              placeholder={t("account.register.lastName")}
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="register-email">
            {t("account.register.email")}{" "}
            <span className="text-white/35">*</span>
          </label>
          <input
            id="register-email"
            className={fieldClass}
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            data-testid="email-input"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="register-phone">
            {t("account.register.phone")}
          </label>
          <input
            id="register-phone"
            className={fieldClass}
            name="phone"
            type="tel"
            placeholder={t("account.register.phonePlaceholder")}
            autoComplete="tel"
            data-testid="phone-input"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="register-password">
            {t("account.register.password")}{" "}
            <span className="text-white/35">*</span>
          </label>
          <input
            id="register-password"
            className={fieldClass}
            name="password"
            type="password"
            placeholder={t("account.register.passwordPlaceholder")}
            required
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>

        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />

        <p className="text-xs leading-6 text-white/40">
          {t("account.register.agreeBefore")}{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="text-white/75 underline underline-offset-4 hover:text-white"
          >
            {t("account.register.privacy")}
          </LocalizedClientLink>{" "}
          {t("account.register.and")}{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="text-white/75 underline underline-offset-4 hover:text-white"
          >
            {t("account.register.terms")}
          </LocalizedClientLink>
          .
        </p>

        <SubmitButton
          className="!w-full !h-12 !bg-white !text-black hover:!bg-white/85 !border-0 !rounded-none !text-sm !font-semibold transition-colors"
          data-testid="register-button"
        >
          {t("account.register.createAccount")}
        </SubmitButton>
      </form>

      <div className="mt-7 pt-6 border-t border-white/10 text-center">
        <span className="text-sm text-white/45">
          {t("account.register.haveAccount")}{" "}
        </span>

        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-sm text-white font-medium underline underline-offset-4 hover:text-white/65 transition-colors"
        >
          {t("account.register.signIn")}
        </button>
      </div>
    </div>
  )
}

export default Register
