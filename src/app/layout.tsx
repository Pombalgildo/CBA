import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Convenção Baptista de Angola",
  description:
    "Convenção Baptista de Angola (C.B.A) — Uma comunidade de fé, amor e esperança. Fundada a 25 de Junho de 1940.",
  keywords: [
    "Convenção Baptista de Angola",
    "CBA",
    "Igreja Baptista",
    "Angola",
    "Luanda",
    "Cristianismo",
  ],
  authors: [{ name: "Convenção Baptista de Angola" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-cba.png",
    apple: "/icon-app.png",
  },
  openGraph: {
    title: "Convenção Baptista de Angola",
    description:
      "Uma comunidade de fé, amor e esperança. Fundada a 25 de Junho de 1940.",
    siteName: "Convenção Baptista de Angola",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a3a2a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icon-app.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CBA" />
      </head>
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased m-0 p-0`}
      >
        {children}
      </body>
    </html>
  );
}
