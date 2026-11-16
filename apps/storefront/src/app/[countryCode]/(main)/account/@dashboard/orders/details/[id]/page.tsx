import { retrieveOrder } from "@lib/data/orders"
import { getT } from "@lib/i18n/server"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)
  const t = await getT()

  if (!order) {
    notFound()
  }

  return {
    title: t("account.pages.orderDetail.title", { id: order.display_id ?? "" }),
    description: t("account.pages.orderDetail.description"),
  }
}

export default async function OrderDetailPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return <OrderDetailsTemplate order={order} />
}
