import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Courier_Prime, Libre_Franklin } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

const sans = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Clube do Filme",
    template: "%s · Clube do Filme",
  },
  description: "O clube do livro, mas de filme. Avalie, discuta e acompanhe os filmes da semana com seu clube.",
  applicationName: "Clube do Filme",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Clube do Filme",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Clube do Filme",
    title: "Clube do Filme",
    description: "O clube do livro, mas de filme.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clube do Filme",
    description: "O clube do livro, mas de filme.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#14110D",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${mono.variable} ${sans.variable}`}>
      <body className="bg-bg text-paper font-sans min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
