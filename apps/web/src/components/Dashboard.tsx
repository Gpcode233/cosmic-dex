"use client";

import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { TokenCard } from "./TokenCard";
import PortfolioStats from "ui/PortfolioStats";
import * as LucideIcons from "lucide-react";
import { useCovalentPortfolio } from "@utils/useCovalentPortfolio";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, BarChart, Bar } from 'recharts';

interface Transaction {
  id: string;
  type: 'swap' | 'send' | 'receive' | 'stake' | 'unstake';
  token: string;
  amount: string;
  value: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
}

interface MarketTrend {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'activity' | 'markets'>('overview');
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrend[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioChange24h, setPortfolioChange24h] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const {
    portfolioData,
    historicalData,
    loading,
    fetchPortfolioData,
    generateMockHistoricalData,
    getPortfolioStats
  } = useCovalentPortfolio(address);

  // Mock data for recent transactions
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'swap',
        token: 'ETH → USDC',
        amount: '0.5 ETH',
        value: '$1,250.00',
        timestamp: '2 hours ago',
        status: 'completed',
        txHash: '0x1234...5678'
      },
      {
        id: '2',
        type: 'stake',
        token: 'COSMIC',
        amount: '100 COSMIC',
        value: '$500.00',
        timestamp: '1 day ago',
        status: 'completed',
        txHash: '0x8765...4321'
      },
      {
        id: '3',
        type: 'send',
        token: 'USDC',
        amount: '500 USDC',
        value: '$500.00',
        timestamp: '2 days ago',
        status: 'completed',
        txHash: '0xabcd...efgh'
      }
    ];
    setRecentTransactions(mockTransactions);
  }, []);

  // Mock market trends data
  useEffect(() => {
    const mockMarketTrends: MarketTrend[] = [
      { symbol: 'ETH', price: 2500, change24h: 2.5, volume24h: 1500000000, marketCap: 300000000000 },
      { symbol: 'BTC', price: 45000, change24h: -1.2, volume24h: 2000000000, marketCap: 850000000000 },
      { symbol: 'USDC', price: 1.00, change24h: 0.0, volume24h: 500000000, marketCap: 25000000000 },
      { symbol: 'SOL', price: 95, change24h: 5.8, volume24h: 800000000, marketCap: 45000000000 },
      { symbol: 'MATIC', price: 0.85, change24h: -2.1, volume24h: 300000000, marketCap: 8500000000 }
    ];
    setMarketTrends(mockMarketTrends);
  }, []);

  // Calculate portfolio stats
  useEffect(() => {
    if (portfolioData) {
      const stats = getPortfolioStats();
      if (stats) {
        setPortfolioValue(stats.totalValue);
        setPortfolioChange24h(stats.changePercent);
      }
    }
  }, [portfolioData, getPortfolioStats]);

  useEffect(() => {
    if (isConnected && address) {
      setIsLoading(false);
    }
  }, [isConnected, address]);

  const stats = getPortfolioStats();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white"
        >
          <p className="text-xl font-semibold mb-2">Please connect your wallet to view the dashboard</p>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cosmic-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 2 }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-4">
      <div className="max-w-7xl mx-auto mt-24 space-y-6">
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
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Connected</span>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          className="bg-[#181830]/80 rounded-2xl p-6 shadow-lg border border-[#232347]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#232347] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cosmic-500 rounded-lg flex items-center justify-center">
                  <LucideIcons.Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">${portfolioValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#232347] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-nebula-500 rounded-lg flex items-center justify-center">
                  <LucideIcons.TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">24h Change</p>
                  <p className={`text-2xl font-bold ${portfolioChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolioChange24h >= 0 ? '+' : ''}{portfolioChange24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#232347] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stellar-500 rounded-lg flex items-center justify-center">
                  <LucideIcons.Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Tokens</p>
                  <p className="text-2xl font-bold text-white">{stats?.tokenCount || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-[#232347] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ff007a] rounded-lg flex items-center justify-center">
                  <LucideIcons.Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Chains</p>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex gap-2 bg-[#181830] rounded-xl p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {[
            { id: 'overview', label: 'Overview', icon: LucideIcons.Home },
            { id: 'portfolio', label: 'Portfolio', icon: LucideIcons.PieChart },
            { id: 'activity', label: 'Activity', icon: LucideIcons.Activity },
            { id: 'markets', label: 'Markets', icon: LucideIcons.TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.id
                  ? 'bg-cosmic-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-[#232347]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Portfolio Chart */}
                <div className="lg:col-span-2 bg-[#181830]/80 rounded-2xl p-6 shadow-lg border border-[#232347]">
                  <h3 className="text-xl font-bold text-white mb-4">Portfolio Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historicalData || []}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff007a" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ff007a" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="date" stroke="#ffffff60" fontSize={12} />
                        <YAxis stroke="#ffffff60" fontSize={12} tickFormatter={v => `$${v.toLocaleString()}`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a2e', 
                            border: '1px solid #ffffff20', 
                            borderRadius: '8px', 
                            color: '#ffffff' 
                          }} 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']} 
                        />
                        <Area type="monotone" dataKey="value" stroke="#ff007a" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#181830]/80 rounded-2xl p-6 shadow-lg border border-[#232347]">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 bg-cosmic-500 text-white rounded-lg hover:bg-cosmic-600 transition">
                      <LucideIcons.ArrowLeftRight className="w-5 h-5" />
                      <span>Swap Tokens</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-nebula-500 text-white rounded-lg hover:bg-nebula-600 transition">
                      <LucideIcons.Send className="w-5 h-5" />
                      <span>Send Assets</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-stellar-500 text-white rounded-lg hover:bg-stellar-600 transition">
                      <LucideIcons.Download className="w-5 h-5" />
                      <span>Receive</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-[#232347] text-white rounded-lg hover:bg-[#181830] transition">
                      <LucideIcons.Upload className="w-5 h-5" />
                      <span>Bridge Assets</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 bg-[#232347] text-white rounded-lg hover:bg-[#181830] transition">
                      <LucideIcons.Lock className="w-5 h-5" />
                      <span>Stake Tokens</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* Portfolio Stats */}
                <PortfolioStats stats={stats} />
                
                {/* Token Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioData?.items?.filter(token => token.quote > 0).map((token) => (
                    <TokenCard
                      key={token.contract_address}
                      symbol={token.contract_ticker_symbol}
                      price={token.quote_rate}
                      change={token.quote_rate_24h ? ((token.quote_rate - token.quote_rate_24h) / token.quote_rate_24h) * 100 : 0}
                      balance={parseFloat(token.balance) / Math.pow(10, token.decimals)}
                      logo={token.logo_url}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-[#181830]/80 rounded-2xl p-6 shadow-lg border border-[#232347]">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-[#232347] rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.type === 'swap' ? 'bg-cosmic-500' :
                          tx.type === 'send' ? 'bg-red-500' :
                          tx.type === 'receive' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}>
                          {tx.type === 'swap' && <LucideIcons.ArrowLeftRight className="w-5 h-5 text-white" />}
                          {tx.type === 'send' && <LucideIcons.Send className="w-5 h-5 text-white" />}
                          {tx.type === 'receive' && <LucideIcons.Download className="w-5 h-5 text-white" />}
                          {tx.type === 'stake' && <LucideIcons.Lock className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{tx.token}</p>
                          <p className="text-gray-400 text-sm">{tx.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{tx.amount}</p>
                        <p className="text-gray-400 text-sm">{tx.value}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {tx.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'markets' && (
              <div className="space-y-6">
                {/* Market Overview */}
                <div className="bg-[#181830]/80 rounded-2xl p-6 shadow-lg border border-[#232347]">
                  <h3 className="text-xl font-bold text-white mb-4">Market Trends</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-[#232347]">
                          <th className="pb-3">Token</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">24h Change</th>
                          <th className="pb-3">Volume</th>
                          <th className="pb-3">Market Cap</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketTrends.map((token) => (
                          <tr key={token.symbol} className="border-b border-[#232347]/50">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#232347] rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">{token.symbol[0]}</span>
                                </div>
                                <span className="text-white font-medium">{token.symbol}</span>
                              </div>
                            </td>
                            <td className="py-3 text-white">${token.price.toLocaleString()}</td>
                            <td className={`py-3 font-medium ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                            </td>
                            <td className="py-3 text-gray-400">${(token.volume24h / 1000000).toFixed(1)}M</td>
                            <td className="py-3 text-gray-400">${(token.marketCap / 1000000000).toFixed(1)}B</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Market Chart */}
                <div className="bg-[#181830]/80 rounded-2xl p-6 shadow-lg border border-[#232347]">
                  <h3 className="text-xl font-bold text-white mb-4">Market Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="symbol" stroke="#ffffff60" fontSize={12} />
                        <YAxis stroke="#ffffff60" fontSize={12} tickFormatter={v => `$${v}`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1a2e', 
                            border: '1px solid #ffffff20', 
                            borderRadius: '8px', 
                            color: '#ffffff' 
                          }} 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']} 
                        />
                        <Line type="monotone" dataKey="price" stroke="#ff007a" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 