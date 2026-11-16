
import { getT } from "@lib/i18n/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = async () => {
  const t = await getT()

  return (
    <section className="flex flex-col gap-5 border border-white/10 bg-[#0d0e10] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7">
      <div className="min-w-0">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
          {t("cart.signIn.eyebrow")}
        </p>

        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
          {t("cart.signIn.title")}
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/45">
          {t("cart.signIn.text")}
        </p>
      </div>

      <LocalizedClientLink
        href="/account"
        className="inline-flex w-full shrink-0 items-center justify-center border border-white/20 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:border-white hover:bg-white hover:text-black sm:w-auto"
      >
        {t("cart.signIn.button")}
      </LocalizedClientLink>
    </section>
  )
}

export default SignInPrompt
