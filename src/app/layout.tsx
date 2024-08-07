import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/main.scss";
import "../styles/forms.scss";

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
