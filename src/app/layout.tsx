import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "700", "900"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Cosmic DEX - Decentralized Exchange",
  description: "The future of decentralized trading. Experience seamless swaps across the galaxy. Built for the Umi network.",
  keywords: ["DEX", "DeFi", "Cryptocurrency", "Swap", "Blockchain", "Decentralized Exchange"],
  icons: {
    icon: "/galaxy.svg",
    shortcut: "/galaxy.svg",
    apple: "/galaxy.svg",
  },
  openGraph: {
    title: "Cosmic DEX - Decentralized Exchange",
    description: "The future of decentralized trading is here.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={orbitron.className}>
      <body className="flex flex-col min-h-screen">
        <WalletProvider>
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}