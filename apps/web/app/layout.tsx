import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import Analytics from "@/components/Analytics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FinanPsi - Planejamento Financeiro para Psicólogos",
  description: "Diagnóstico financeiro e curso online prático para psicólogos e profissionais da saúde",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Analytics />
        {children}
      </body>
    </html>
  )
}

