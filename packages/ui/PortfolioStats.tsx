import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Wallet, Activity } from 'lucide-react';

interface PortfolioStatsProps {
  stats: {
    totalValue: number;
    change24h: number;
    changePercent: number;
    tokenCount: number;
  } | null;
}

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

export default function PortfolioStats({ stats }: PortfolioStatsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Value</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalValue)}</p>
          </div>
          <DollarSign className="w-8 h-8 text-[#ff007a]" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">24h Change</p>
            <p className={`text-2xl font-bold ${stats.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(stats.change24h)}
            </p>
            <p className={`text-sm ${stats.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercentage(stats.changePercent)}
            </p>
          </div>
          {stats.change24h >= 0 ? (
            <TrendingUp className="w-8 h-8 text-green-400" />
          ) : (
            <TrendingDown className="w-8 h-8 text-red-400" />
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Tokens</p>
            <p className="text-2xl font-bold text-white">{stats.tokenCount}</p>
          </div>
          <Wallet className="w-8 h-8 text-[#00d4ff]" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <p className="text-2xl font-bold text-green-400">Active</p>
          </div>
          <Activity className="w-8 h-8 text-green-400" />
        </div>
      </motion.div>
    </div>
  );
} 