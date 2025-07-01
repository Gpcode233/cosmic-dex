'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings, ArrowUpDown } from 'lucide-react';

// Mock token data
const mockTokens = [
  { symbol: 'ETH', name: 'Ethereum', icon: <span className="text-cosmic-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L12 22M12 2L19 12M12 2L5 12M12 22L19 12M12 22L5 12" /></svg></span>, balance: '2.45' },
  { symbol: 'USDC', name: 'USD Coin', icon: <span className="text-cosmic-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">$</text></svg></span>, balance: '1250.00' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: <span className="text-cosmic-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">₿</text></svg></span>, balance: '0.023' },
  { symbol: 'MATIC', name: 'Polygon', icon: <span className="text-cosmic-400"><svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">M</text></svg></span>, balance: '500.00' },
];

export function SwapInterface() {
  const [fromToken, setFromToken] = useState(mockTokens[0]);
  const [toToken, setToToken] = useState(mockTokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const handleSwap = () => {
    // Mock swap logic
    console.log(`Swapping ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`);
  };

  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-void via-space to-cosmic-dark p-4">
      <div className="max-w-md mx-auto pt-20">
        {/* Swap Card */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-glass"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Swap</h2>
            <motion.button
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5 text-cosmic-400" />
            </motion.button>
          </div>

          {/* From Token */}
          <motion.div
            className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10"
            whileHover={{ boxShadow: "0 0 20px rgba(107, 99, 255, 0.2)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">From</span>
              <span className="text-sm text-gray-400">
                Balance: {fromToken.balance}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {fromToken.icon}
                <div>
                  <div className="font-semibold text-white">{fromToken.symbol}</div>
                  <div className="text-xs text-gray-400">{fromToken.name}</div>
                </div>
              </div>
              <input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 bg-transparent text-right text-white text-xl font-semibold outline-none"
              />
            </div>
          </motion.div>

          {/* Switch Button */}
          <motion.div className="flex justify-center mb-4">
            <motion.button
              onClick={handleSwitchTokens}
              className="p-2 rounded-full bg-cosmic-500/20 border border-cosmic-500/30 hover:bg-cosmic-500/30 transition-colors"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowUpDown className="w-5 h-5 text-cosmic-400" />
            </motion.button>
          </motion.div>

          {/* To Token */}
          <motion.div
            className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10"
            whileHover={{ boxShadow: "0 0 20px rgba(217, 70, 239, 0.2)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">To</span>
              <span className="text-sm text-gray-400">
                Balance: {toToken.balance}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {toToken.icon}
                <div>
                  <div className="font-semibold text-white">{toToken.symbol}</div>
                  <div className="text-xs text-gray-400">{toToken.name}</div>
                </div>
              </div>
              <input
                type="number"
                placeholder="0.0"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="flex-1 bg-transparent text-right text-white text-xl font-semibold outline-none"
              />
            </div>
          </motion.div>

          {/* Swap Details */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">1 {fromToken.symbol} = 1.85 {toToken.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slippage</span>
                <span className="text-white">0.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network Fee</span>
                <span className="text-white">~$2.50</span>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <motion.button
            onClick={handleSwap}
            className="w-full py-4 bg-gradient-to-r from-cosmic-500 to-nebula-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300"
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(107, 99, 255, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            disabled={!fromAmount || !toAmount}
          >
            {!fromAmount || !toAmount ? 'Enter an amount' : 'Swap'}
          </motion.button>
        </motion.div>

        {/* Token List */}
        <motion.div
          className="mt-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Popular Tokens</h3>
          <div className="space-y-2">
            {mockTokens.map((token, index) => (
              <motion.div
                key={token.symbol}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{token.icon}</span>
                  <div>
                    <div className="font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-gray-400">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white">{token.balance}</div>
                  <div className="text-xs text-gray-400">~$1,234</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 