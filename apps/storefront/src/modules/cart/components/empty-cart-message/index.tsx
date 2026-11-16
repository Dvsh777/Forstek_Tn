
import { getT } from "@lib/i18n/server"
import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = async () => {
  const t = await getT()

  return (
    <section
      className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#08090b] px-5 py-24 text-center text-white sm:px-8"
      data-testid="empty-cart-message"
    >
      <div className="w-full max-w-xl">
        <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
          {t("cart.empty.eyebrow")}
        </p>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          {t("cart.empty.title")}
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/45 sm:text-base">
          {t("cart.empty.text")}
        </p>

        <div className="mt-9 flex justify-center">
          <InteractiveLink href="/store">
            {t("cart.empty.explore")}
          </InteractiveLink>
        </div>

        <p className="mt-12 border-t border-white/[0.08] pt-5 text-[10px] uppercase tracking-[0.16em] text-white/25">
          {t("cart.empty.footer")}
        </p>
      </div>
    </section>
  )
}

export default EmptyCartMessage
