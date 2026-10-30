import { Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: {
    default: "Saray City — Turk va Yevropa taomlari",
    template: "%s | Saray City",
  },
  description:
    "Saray City — 100% halol turk va yevropa taomlari restorani. Banket va marosimlar, stol band qilish: +998 94 455 73 13.",
  icons: {
    icon: "/images/logo.PNG",
    shortcut: "/images/logo.PNG",
    apple: "/images/logo.PNG",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${geistSans.variable} ${cormorantGaramond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
