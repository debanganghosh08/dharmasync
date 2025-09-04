import type React from "react"
import type { Metadata } from "next"
import { Lexend } from "next/font/google"
import "./globals.css"
import AppSessionProvider from "./SessionProvider"
import ClientLayout from "./clientLayout"

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
})

export const metadata: Metadata = {
  title: "DharmaSync - Mindful Community",
  description: "A mindful productivity and community connection app born from Digital Dharma",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AppSessionProvider>
      <ClientLayout>{children}</ClientLayout>
    </AppSessionProvider>
  )
}
