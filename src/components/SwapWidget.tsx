'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowDown, X } from 'lucide-react';
import Image from 'next/image';

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: string;
}

const tokens: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: '/eth.png', balance: '2.45' },
  { symbol: 'USDC', name: 'USD Coin', icon: '/usdc.png', balance: '1250.00' },
  { symbol: 'USDT', name: 'Tether', icon: '/usdt.png', balance: '500.00' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', icon: '/btc.png', balance: '0.023' },
];

export function SwapWidget() {
  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [selecting, setSelecting] = useState<'from' | 'to' | null>(null);
  const [search, setSearch] = useState('');

  const filteredTokens = tokens.filter(t =>
    t.symbol.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleTokenSelect = (token: Token) => {
    if (selecting === 'from') setFromToken(token);
    if (selecting === 'to') setToToken(token);
    setSelecting(null);
    setSearch('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0d0c24] via-[#181830] to-[#232347] relative py-12">
      {/* Heading */}
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4 mt-8 drop-shadow-lg">
        Swap anytime,<br />anywhere.
      </h1>
      {/* Swap Card */}
      <div className="w-full max-w-md rounded-2xl bg-black/80 border border-white/10 shadow-2xl mx-auto mt-6 backdrop-blur-xl flex flex-col">
        {/* Sell Panel */}
        <div className="rounded-t-2xl p-6 pb-4 bg-black/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg text-gray-300 font-semibold">Sell</span>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181830] border border-white/10 text-white font-semibold hover:border-cosmic-400 transition"
              onClick={() => setSelecting('from')}
            >
              <Image src={fromToken.icon} alt={fromToken.symbol} width={20} height={20} className="w-5 h-5 mr-1 inline-block" />
              {fromToken.symbol}
              <ChevronDown className="w-4 h-4 ml-1 text-cosmic-400" />
            </button>
          </div>
          <div className="flex items-end justify-between">
            <input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={e => setFromAmount(e.target.value)}
              className="bg-transparent text-4xl font-bold text-white outline-none w-2/3"
            />
            <div className="text-right">
              <div className="text-xs text-gray-400">Balance: {fromToken.balance}</div>
            </div>
          </div>
        </div>
        {/* Arrow */}
        <div className="flex justify-center -my-2 z-10">
          <div className="rounded-full bg-[#181830] border border-white/10 w-10 h-10 flex items-center justify-center shadow-lg">
            <ArrowDown className="w-6 h-6 text-white" />
          </div>
        </div>
        {/* Buy Panel */}
        <div className="rounded-b-2xl p-6 pt-4 bg-black/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg text-gray-300 font-semibold">Buy</span>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181830] border border-white/10 text-white font-semibold hover:border-cosmic-400 transition"
              onClick={() => setSelecting('to')}
            >
              <Image src={toToken.icon} alt={toToken.symbol} width={20} height={20} className="w-5 h-5 mr-1 inline-block" />
              {toToken.symbol}
              <ChevronDown className="w-4 h-4 ml-1 text-cosmic-400" />
            </button>
          </div>
          <div className="flex items-end justify-between">
            <input
              type="number"
              placeholder="0.0"
              value={toAmount}
              onChange={e => setToAmount(e.target.value)}
              className="bg-transparent text-4xl font-bold text-white outline-none w-2/3"
            />
            <div className="text-right">
              <button
                className="px-4 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-[#bd00ff] to-[#00ffe7] shadow-lg hover:shadow-neon transition-all duration-300 border-2 border-transparent hover:border-[#00ffe7] text-center"
                onClick={() => setSelecting('to')}
              >
                Select token
                <ChevronDown className="w-4 h-4 ml-1 inline-block" />
              </button>
            </div>
          </div>
        </div>
        {/* Swap Button */}
        <button
          className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-cosmic-500 to-nebula-500 text-white font-bold text-lg shadow-lg hover:shadow-glow transition-all duration-300"
        >
          Swap
        </button>
      </div>
      {/* Info Text */}
      <div className="w-full max-w-md mx-auto text-center text-gray-400 mt-8 text-base">
        The largest onchain marketplace. Buy and sell crypto on Ethereum and 12+ other chains.
      </div>
      {/* Token Selector Modal */}
      <AnimatePresence>
        {selecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-[#181830] rounded-2xl shadow-2xl p-6 relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setSelecting(null)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-white mb-4">Select a token</h2>
              <div className="flex items-center gap-2 mb-4 bg-black/30 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Search tokens"
                  className="w-full bg-transparent text-white outline-none"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {filteredTokens.map(token => (
                  <button
                    key={token.symbol}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-cosmic-500/10 transition-colors"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <Image src={token.icon} alt={token.symbol} width={24} height={24} className="w-6 h-6 rounded-full" />
                    <span className="font-bold text-white">{token.symbol}</span>
                    <span className="text-xs text-gray-400">{token.name}</span>
                  </button>
                ))}
                {filteredTokens.length === 0 && (
                  <div className="text-gray-400 text-center py-8">No tokens found.</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}