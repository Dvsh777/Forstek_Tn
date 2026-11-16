import React from "react"

import { getT } from "@lib/i18n/server"
import AddAddress from "../address-card/add-address"
import EditAddress from "../address-card/edit-address-modal"
import { HttpTypes } from "@medusajs/types"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook = async ({ customer, region }: AddressBookProps) => {
  const t = await getT()
  const { addresses = [] } = customer

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-2 border-b border-[#292929] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#777777]">
            {t("account.addresses.yourAccount")}
          </span>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#eeeeee]">
            {t("account.addresses.saved")}
          </h2>
          <p className="mt-1 text-sm text-[#888888]">
            {t("account.addresses.manage")}
          </p>
        </div>

        <span className="text-xs text-[#777777]">
          {t(
            addresses.length === 1
              ? "account.addresses.countOne"
              : "account.addresses.countOther",
            { count: addresses.length }
          )}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <AddAddress region={region} addresses={addresses} />

        {addresses.map((address) => (
          <EditAddress
            region={region}
            address={address}
            key={address.id}
          />
        ))}
      </div>

      {addresses.length === 0 && (
        <p className="mt-4 text-xs text-[#777777]">
          {t("account.addresses.none")}
        </p>
      )}
    </div>
  )
}

export default AddressBook