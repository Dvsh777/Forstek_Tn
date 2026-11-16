"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { updateLocale } from "@lib/data/locale-actions"
import { Locale } from "@lib/data/locales"
import {
  LANGUAGE_FLAGS,
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  resolveLanguage,
} from "@lib/i18n/config"
import { useT } from "@lib/i18n/provider"

type LanguageOption = {
  code: string
  name: string
  localizedName: string
  countryCode: string
}

type LanguageSelectProps = {
  toggleState: StateType
  locales: Locale[] | null
  currentLocale: string | null
}

const DEFAULT_OPTION: LanguageOption = {
  code: "en",
  name: LANGUAGE_LABELS.en,
  localizedName: LANGUAGE_LABELS.en,
  countryCode: LANGUAGE_FLAGS.en,
}

const LanguageSelect = ({
  toggleState,
  locales,
  currentLocale,
}: LanguageSelectProps) => {
  const t = useT()
  const [current, setCurrent] = useState<LanguageOption | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { state, close } = toggleState

  // English / Francais / Arabic are always offered. When the Medusa backend
  // defines a matching locale (e.g. "fr-FR"), its exact code is used so the
  // cart and product requests keep receiving the configured locale code.
  const options = useMemo(() => {
    return SUPPORTED_LANGUAGES.map((language) => {
      const backendLocale = locales?.find(
        (locale) => resolveLanguage(locale.code) === language
      )
      return {
        code: backendLocale?.code ?? language,
        name: LANGUAGE_LABELS[language],
        localizedName: LANGUAGE_LABELS[language],
        countryCode: LANGUAGE_FLAGS[language],
      }
    })
  }, [locales])

  const currentLanguage = resolveLanguage(currentLocale)

  useEffect(() => {
    const option = options.find(
      (o) => resolveLanguage(o.code) === currentLanguage
    )
    setCurrent(option ?? DEFAULT_OPTION)
  }, [options, currentLanguage])

  const handleChange = (option: LanguageOption) => {
    startTransition(async () => {
      await updateLocale(option.code)
      close()
      router.refresh()
    })
  }

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          options.find((o) => resolveLanguage(o.code) === currentLanguage) ??
          DEFAULT_OPTION
        }
        disabled={isPending}
      >
        <ListboxButton className="py-1 w-full">
          <div className="txt-compact-small flex items-start gap-x-2">
            <span>{t("layout.language.label")}</span>
            {current && (
              <span className="txt-compact-small flex items-center gap-x-2">
                {current.countryCode && (
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    countryCode={current.countryCode}
                  />
                )}
                {isPending ? "..." : current.localizedName}
              </span>
            )}
          </div>
        </ListboxButton>
        <div className="flex relative w-full min-w-[320px]">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute -bottom-[calc(100%-36px)] left-0 xsmall:left-auto xsmall:right-0 max-h-[442px] overflow-y-scroll z-[900] bg-white drop-shadow-md text-small-regular uppercase text-black no-scrollbar rounded-rounded w-full"
              static
            >
              {options.map((o) => (
                <ListboxOption
                  key={o.code || "default"}
                  value={o}
                  className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center gap-x-2"
                >
                  {o.countryCode ? (
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o.countryCode}
                    />
                  ) : (
                    <span style={{ width: "16px", height: "16px" }} />
                  )}
                  {o.localizedName}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default LanguageSelect
