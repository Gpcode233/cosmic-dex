"use client";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { TokenCard } from "./TokenCard";
import PortfolioStats from "ui/PortfolioStats";
import * as LucideIcons from "lucide-react";

// Mock data for demonstration
const tokens = [
  { symbol: "AVAX", price: 17.93, change: -4.25, balance: 0, logo: "/avax-logo.png" },
  { symbol: "ETH", price: 3200.12, change: 2.1, balance: 0.5, logo: "/eth-logo.png" },
  { symbol: "USDT", price: 1.0, change: 0.0, balance: 100, logo: "/usdt-logo.png" },
];
const stats = {
  totalValue: 1600.12,
  change24h: -50.23,
  changePercent: -3.1,
  tokenCount: 3,
};
const activity = [
  { type: "Swap", desc: "Swapped 1 AVAX for 17.5 USDT", time: "2h ago" },
  { type: "Send", desc: "Sent 0.1 ETH to 0x123...abcd", time: "1d ago" },
  { type: "Receive", desc: "Received 100 USDT", time: "3d ago" },
];

export function Dashboard() {
  const { address } = useAccount();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-4">
      <div className="max-w-6xl mx-auto mt-24 space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-orbitron font-bold text-white mb-2">Welcome to Cosmic DEX</h1>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-cosmic-500 text-white rounded-lg font-semibold hover:bg-cosmic-600 transition">
              <LucideIcons.Swap className="w-5 h-5" /> Swap
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-nebula-500 text-white rounded-lg font-semibold hover:bg-nebula-600 transition">
              <LucideIcons.Send className="w-5 h-5" /> Send
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-stellar-500 text-white rounded-lg font-semibold hover:bg-stellar-600 transition">
              <LucideIcons.Download className="w-5 h-5" /> Receive
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#232347] text-white rounded-lg font-semibold hover:bg-[#181830] transition">
              <LucideIcons.Upload className="w-5 h-5" /> Bridge
            </button>
          </div>
        </motion.div>
        {/* Portfolio Stats */}
        <PortfolioStats stats={stats} />
        {/* Token Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <TokenCard key={token.symbol} />
          ))}
        </div>
        {/* Recent Activity */}
        <div className="bg-[#181830]/80 rounded-2xl p-6 mt-8 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <ul className="divide-y divide-[#232347]">
            {activity.map((item, idx) => (
              <li key={idx} className="py-3 flex items-center gap-4">
                <span className="inline-block w-8 h-8 bg-cosmic-500/20 rounded-full flex items-center justify-center">
                  {item.type === "Swap" && <LucideIcons.Swap className="w-5 h-5 text-cosmic-500" />}
                  {item.type === "Send" && <LucideIcons.Send className="w-5 h-5 text-nebula-500" />}
                  {item.type === "Receive" && <LucideIcons.Download className="w-5 h-5 text-stellar-500" />}
                </span>
                <span className="flex-1 text-gray-200">{item.desc}</span>
                <span className="text-xs text-gray-400">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 