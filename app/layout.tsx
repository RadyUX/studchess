import "./globals.css";
import { Metadata } from "next";


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

  return (
    <html lang="en" suppressHydrationWarning>
      <body
      
      className="h-full bg-[#2E2E2E] text-white">
         {children}
      </body>
    </html>
  );
}
