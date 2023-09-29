import type { Metadata } from 'next'
import NyafileProvider from "@/components/nya/NyafileProvider";
import "./global.css"

export const metadata: Metadata = {
  title: 'Quarky',
  description: 'A web client for Lightquark made in Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NyafileProvider>{children}</NyafileProvider>
      </body>
    </html>
  )
}
