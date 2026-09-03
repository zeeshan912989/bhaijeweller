import type { Metadata } from "next";
import { Inter, Cinzel, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import CookieConsentModal from "@/components/ui/CookieConsentModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BHAI | Luxury Fine Jewellery",
  description: "Explore handcrafted luxury necklaces, earrings, rings, and bracelets in 18K gold and certified diamonds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} ${playfair.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-neutral-900 selection:bg-[#d4af37] selection:text-white">
        {children}
        <CookieConsentModal />
      </body>
    </html>
  );
}
