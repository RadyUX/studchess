
import { auth } from "@/auth";
import "./globals.css";
import { Metadata } from "next";
import {SessionProvider }from "next-auth/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {Toaster} from "sonner"
import ReactQueryProvider from "@/utils/QueryProvider";

import { ModalProvider } from "./(main)/_components/providers/modals-provider";

export const metadata: Metadata = {

  title: "Stud'Chess",
  description: "chess tracker",
  icons: {
    icon: [
      {
        media: "(prefer-color-schemes: light)",
        url: "/logo.svg",
        href: "/logo.svg"
      }
    ]
  }
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 const session = await auth()

  return (
     <html lang="en" suppressHydrationWarning>
      <ReactQueryProvider>
        <SessionProvider session={session}>
          <body className="h-full bg-[#2E2E2E] text-white">
            <Toaster position="bottom-center" />
            <ModalProvider/>
            {children}
          </body>
        </SessionProvider>
        </ReactQueryProvider>
    </html>
  );
}
