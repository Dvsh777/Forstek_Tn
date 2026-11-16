"use client"

import { Plus } from "@medusajs/icons"
import { Button, Heading } from "@modules/common/components/ui"
import { useActionState, useEffect, useState } from "react"

import { addCustomerAddress } from "@lib/data/customer"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useT } from "@lib/i18n/provider"
import { HttpTypes } from "@medusajs/types"
import CountrySelect from "@modules/checkout/components/country-select"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"

const AddAddress = ({
  region,
}: {
  region: HttpTypes.StoreRegion
  addresses: HttpTypes.StoreCustomerAddress[]
}) => {
  const t = useT()
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(addCustomerAddress, {
    success: false,
    error: null,
  } as { success: boolean; error: string | null })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <>
      <button
        type="button"
        onClick={open}
        data-testid="add-address-button"
        className="
          group relative flex min-h-[220px] h-full w-full flex-col
          justify-between overflow-hidden border border-dashed
          border-[#343434] bg-[#111111] p-5 text-left
          transition-all duration-200
          hover:border-[#777777] hover:bg-[#161616]
          focus-visible:outline-none focus-visible:ring-1
          focus-visible:ring-white
        "
      >
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#777777]">
            {t("account.addresses.book")}
          </span>
          <span className="text-sm font-semibold text-[#eeeeee]">
            {t("account.addresses.newAddress")}
          </span>
        </div>

        <div className="flex h-10 w-10 items-center justify-center border border-[#383838] bg-[#191919] text-[#aaaaaa] transition-colors group-hover:border-[#777777] group-hover:text-white">
          <Plus className="h-5 w-5" />
        </div>

        <span className="absolute bottom-5 right-5 text-[10px] uppercase tracking-[0.15em] text-[#555555] transition-colors group-hover:text-[#aaaaaa]">
          {t("account.addresses.addLocation")}
        </span>
      </button>

      <Modal isOpen={state} close={close} data-testid="add-address-modal">
        <Modal.Title>
          <div className="mb-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#888888]">
              {t("account.addresses.book")}
            </span>
            <Heading className="mt-1 text-[#eeeeee]">
              {t("account.addresses.addTitle")}
            </Heading>
          </div>
        </Modal.Title>

        <form action={formAction}>
          <Modal.Body>
            <div className="flex flex-col gap-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label={t("checkout.fields.firstName")}
                  name="first_name"
                  required
                  autoComplete="given-name"
                  data-testid="first-name-input"
                />
                <Input
                  label={t("checkout.fields.lastName")}
                  name="last_name"
                  required
                  autoComplete="family-name"
                  data-testid="last-name-input"
                />
              </div>

              <Input
                label={t("checkout.fields.company")}
                name="company"
                autoComplete="organization"
                data-testid="company-input"
              />

              <Input
                label={t("checkout.fields.address")}
                name="address_1"
                required
                autoComplete="address-line1"
                data-testid="address-1-input"
              />

              <Input
                label={t("account.addresses.apartment")}
                name="address_2"
                autoComplete="address-line2"
                data-testid="address-2-input"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr]">
                <Input
                  label={t("checkout.fields.postalCode")}
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  data-testid="postal-code-input"
                />

                <Input
                  label={t("checkout.fields.city")}
                  name="city"
                  required
                  autoComplete="locality"
                  data-testid="city-input"
                />
              </div>

              <Input
                label={t("account.addresses.provinceState")}
                name="province"
                autoComplete="address-level1"
                data-testid="state-input"
              />

              <CountrySelect
                region={region}
                name="country_code"
                required
                autoComplete="country"
                data-testid="country-select"
              />

              <Input
                label={t("checkout.fields.phone")}
                name="phone"
                autoComplete="tel"
                data-testid="phone-input"
              />
            </div>

            {formState.error && (
              <div
                className="border border-rose-900/50 bg-rose-950/20 px-3 py-2 text-sm text-rose-400"
                data-testid="address-error"
              >
                {formState.error}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10 w-full border border-[#383838] bg-transparent text-[#cccccc] hover:bg-[#222222] sm:w-auto"
                data-testid="cancel-button"
              >
                {t("account.addresses.cancel")}
              </Button>

              <SubmitButton
                data-testid="save-button"
                className="h-10 w-full sm:w-auto"
              >
                {t("account.addresses.saveAddress")}
              </SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default AddAddress