
"use client"

import React, { useEffect, useActionState } from "react"

import { useT } from "@lib/i18n/provider"
import Input from "@modules/common/components/input"
import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const t = useT()
  const [successState, setSuccessState] = React.useState(false)

  const updateCustomerEmail = (
    _currentState: Record<string, unknown>,
    _formData: FormData
  ) => {
    return {
      success: false,
      error: t("account.profile.emailUnsupported"),
    }
  }

  const [state, formAction] = useActionState(updateCustomerEmail, {
    error: null as string | null,
    success: false,
  })

  const clearState = () => setSuccessState(false)

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  return (
    <form action={formAction} className="w-full min-w-0">
      <AccountInfo
        label={t("account.profile.email")}
        currentInfo={customer.email}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error || undefined}
        clearState={clearState}
        data-testid="account-email-editor"
      >
        <div className="w-full">
          <Input
            label={t("account.profile.email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={customer.email}
            data-testid="email-input"
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileEmail
