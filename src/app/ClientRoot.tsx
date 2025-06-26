"use client";
import { WalletProvider } from "@/components/WalletProvider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <Navigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </WalletProvider>
  );
}
