import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import { getT } from "@lib/i18n/server"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT()

  return {
    title: t("account.pages.orders.title"),
    description: t("account.pages.orders.description"),
  }
}

export default async function Orders() {
  const t = await getT()
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">{t("account.pages.orders.heading")}</h1>
        <p className="text-base-regular">
          {t("account.pages.orders.text")}
        </p>
      </div>
      <div>
        <OrderOverview orders={orders} />
        <Divider className="mb-8 mt-8" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
