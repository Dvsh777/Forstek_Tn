import { declineTransferRequest } from "@lib/data/orders"
import { getT } from "@lib/i18n/server"
import { Heading, Text } from "@modules/common/components/ui"
import TransferImage from "@modules/order/components/transfer-image"

export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string }>
}) {
  const { id, token } = await params
  const t = await getT()

  const { success, error } = await declineTransferRequest(id, token)

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <Heading level="h1" className="text-xl text-zinc-900">
              {t("order.transfer.declinedTitle")}
            </Heading>
            <Text className="text-zinc-600">
              {t("order.transfer.declinedText", { id })}
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-zinc-600">
              {t("order.transfer.declineError")}
            </Text>
            {error && (
              <Text className="text-red-500">
                {t("order.transfer.errorMessage", { error })}
              </Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
