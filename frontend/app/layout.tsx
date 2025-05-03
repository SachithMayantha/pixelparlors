import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { SoundProvider } from "@/components/SoundManager"

export const metadata: Metadata = {
  title: "PIXEL PARLORS",
  description: "A self-rewriting 8-bit adventure",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="font-pixel bg-bg-dark text-fg-text antialiased">
        <SoundProvider>
          <div className="crt-effect">{children}</div>
        </SoundProvider>
      </body>
    </html>
  )
}
