'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  PieChart as PieChartIcon, 
  Wallet, RefreshCw, ExternalLink, Copy, CheckCircle,
  Eye, EyeOff
} from 'lucide-react';
import { useCovalentPortfolio } from '../../hooks/useCovalentPortfolio';
import PortfolioStats from '../../components/PortfolioStats';

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const [timeframe, setTimeframe] = useState<'1D' | '7D' | '1M' | '3M' | '1Y'>('7D');
  const [showBalances, setShowBalances] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);

  const {
    portfolioData,
    historicalData,
    loading,
    fetchPortfolioData,
    generateMockHistoricalData,
    getPortfolioStats
  } = useCovalentPortfolio(address);

  // Copy address to clipboard
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Chart colors
  const chartColors = ['#ff007a', '#00d4ff', '#ff6b35', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

  useEffect(() => {
    generateMockHistoricalData(timeframe);
  }, [timeframe, generateMockHistoricalData]);

  useEffect(() => {
    if (portfolioData && !loading) {
      setTableLoading(false);
    } else {
      setTableLoading(true);
    }
  }, [portfolioData, loading]);

  const stats = getPortfolioStats();

  if (!isConnected) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-4"
      >
        <div className="max-w-6xl mx-auto mt-24">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-[#ff007a]" />
            <h1 className="text-3xl font-orbitron font-bold mb-4 text-white">Portfolio Dashboard</h1>
            <p className="text-gray-300 mb-6">Connect your wallet to view your comprehensive portfolio analytics</p>
            <div className="text-gray-500">Connect your wallet to get started!</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-4"
    >
      <div className="max-w-6xl mx-auto mt-24 space-y-6">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-orbitron font-bold text-white mb-2">Portfolio Dashboard</h1>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="font-mono text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <button
                  onClick={copyAddress}
                  className="p-1 hover:bg-white/10 rounded transition"
                  title="Copy address"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-white/10 rounded transition"
                  title="View on Etherscan"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
                title={showBalances ? "Hide balances" : "Show balances"}
              >
                {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                onClick={fetchPortfolioData}
                disabled={loading}
                className="p-2 hover:bg-white/10 rounded-lg transition disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Overview */}
        <PortfolioStats stats={stats} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Value Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Portfolio Value</h3>
              <div className="flex gap-2">
                {(['1D', '7D', '1M', '3M', '1Y'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      timeframe === period
                        ? 'bg-[#ff007a] text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff007a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff007a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff60" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#ffffff60" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Value']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ff007a"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Asset Allocation Pie Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Asset Allocation</h3>
              <PieChartIcon className="w-6 h-6 text-[#00d4ff]" />
            </div>
            {portfolioData?.items && portfolioData.items.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={portfolioData.items.filter(item => item.quote > 0).slice(0, 8)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quote"
                  >
                    {portfolioData.items.filter(item => item.quote > 0).slice(0, 8).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                No data available
              </div>
            )}
          </motion.div>
        </div>

        {/* Token Holdings Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">Token Holdings</h3>
          </div>
          {tableLoading ? (
            <div className="p-8 text-center">
              <span className="inline-block w-8 h-8 rounded-full bg-cosmic-500 animate-pulse mb-4" />
              <p className="text-gray-400">Loading token holdings...</p>
            </div>
          ) : portfolioData?.items && portfolioData.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">24h Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {portfolioData.items
                    .filter(item => item.quote > 0)
                    .sort((a, b) => b.quote - a.quote)
                    .map((token, index) => {
                      const balance = parseFloat(token.balance) / Math.pow(10, token.decimals);
                      const priceChange = token.quote_rate_24h ? 
                        ((token.quote_rate - token.quote_rate_24h) / token.quote_rate_24h) * 100 : 0;
                      
                      return (
                        <tr key={index} className="hover:bg-white/5 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Image 
                                src={token.logo_url} 
                                alt={token.contract_name}
                                width={32}
                                height={32}
                                className="rounded-full mr-3"
                                onError={(e) => {
                                  e.currentTarget.src = '/moon.png';
                                }}
                              />
                              <div>
                                <p className="text-white font-medium">{token.contract_ticker_symbol}</p>
                                <p className="text-gray-400 text-sm">{token.contract_name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-white">{showBalances ? balance.toFixed(4) : '***'}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-white">${token.quote_rate?.toFixed(6) || '0.00'}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="text-white font-medium">{formatCurrency(token.quote)}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              priceChange >= 0 
                                ? 'bg-green-400/20 text-green-400' 
                                : 'bg-red-400/20 text-red-400'
                            }`}>
                              {formatPercentage(priceChange)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Wallet className="w-8 h-8 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">No tokens found in this wallet</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
} 