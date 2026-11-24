import { getLanguage } from "@lib/i18n/server"
import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// viewportFit "cover" lets the sticky mobile bars respect the iPhone home
// indicator through env(safe-area-inset-bottom). The theme color tints the
// browser chrome on Android Chrome and iOS Safari.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
  colorScheme: "dark",
}

export default async function RootLayout(props: {
  children: React.ReactNode
}) {
  // Language comes from the `_medusa_locale` cookie. Arabic reads right to left;
  // the layout itself is kept as designed by the `html[dir="rtl"]` rules in
  // styles/globals.css.
  const language = await getLanguage()
  const dir = language === "ar" ? "rtl" : "ltr"

  return (
    <html lang={language} dir={dir} className="dark" data-mode="dark">
      <head>
        <link rel="ucp" href="/.well-known/ucp" />
      </head>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
