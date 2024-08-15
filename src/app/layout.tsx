import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { Inter } from "next/font/google";
import "../styles/main.scss";
import "../styles/forms.scss";
import "../styles/product.scss"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SRVC",
  description: "SRVC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
