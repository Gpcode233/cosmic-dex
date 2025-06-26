'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface TokenData {
  address: string;
  name: string;
  symbol: string;
  priceUsd: string;
  volume24h: string;
  priceChange24h: string;
  chainId: string;
  icon: string;
}

interface DexData {
  schemaVersion: string;
  pairs: Array<{
    chainId: string;
    dexId: string;
    baseToken: TokenData;
    quoteToken: TokenData;
    priceNative: string;
    priceUsd: string;
    volume24h: string;
    volume24hQuote: string;
    txns24h: string;
    priceChange24h: string;
    pairAddress: string;
    url: string;
  }>;
}

export default function Explore() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');
  const [sortField, setSortField] = useState<'price' | 'volume' | 'change'>('price');
  const searchParams = useSearchParams();

  useEffect(() => {
    // List of popular tokens to show by default
    const defaultTokens = ["ETH", "USDT", "USDC", "SOL", "BNB", "MATIC", "ARB", "OP", "AVAX", "FTM"];

    const fetchTokens = async (query?: string) => {
      setLoading(true);
      setError(null);
      try {
        let pairs: any[] = [];
        if (query) {
          // Search for pairs matching the query
          const res = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${encodeURIComponent(query)}`);
          if (!res.ok) throw new Error('Failed to fetch token data');
          const data = await res.json();
          pairs = data.pairs;
        } else {
          // Fetch pairs for each default token
          for (const token of defaultTokens) {
            const res = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${encodeURIComponent(token)}`);
            if (res.ok) {
              const data = await res.json();
              pairs = pairs.concat(data.pairs);
            }
          }
        }
        const transformedData = pairs.map((pair: any) => ({
          address: pair.baseToken.address,
          name: pair.baseToken.name,
          symbol: pair.baseToken.symbol,
          priceUsd: pair.priceUsd,
          volume24h: pair.volume?.usd || pair.volume24h || "0",
          priceChange24h: pair.priceChange?.h24 || pair.priceChange24h || "0",
          chainId: pair.chainId,
          icon: pair.info?.imageUrl || '',
        }));
        setTokens(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Failed to load token data. Please try again later.');
        setLoading(false);
      }
    };

    // Initial load: show popular tokens
    fetchTokens();
  }, []);

  const filteredTokens = tokens
    .filter(token => {
      const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChain = selectedChain === 'all' || token.chainId === selectedChain;
      return matchesSearch && matchesChain;
    })
    .sort((a, b) => {
      switch (sortField) {
        case 'price':
          return parseFloat(b.priceUsd) - parseFloat(a.priceUsd);
        case 'volume':
          return parseFloat(b.volume24h) - parseFloat(a.volume24h);
        case 'change':
          return parseFloat(b.priceChange24h) - parseFloat(a.priceChange24h);
        default:
          return 0;
      }
    });

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white"
        >
          <p className="text-xl font-semibold mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-cosmic-500 text-white rounded-lg hover:bg-cosmic-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Explore Tokens</h1>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#181830] text-white placeholder-gray-400 w-64"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#181830] text-white"
          >
            <option value="all">All Chains</option>
            <option value="ethereum">Ethereum</option>
            <option value="binance">Binance</option>
            <option value="polygon">Polygon</option>
            <option value="avalanche">Avalanche</option>
            <option value="fantom">Fantom</option>
            <option value="arbitrum">Arbitrum</option>
            <option value="optimism">Optimism</option>
          </select>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as 'price' | 'volume' | 'change')}
            className="px-4 py-2 rounded-lg bg-[#181830] text-white"
          >
            <option value="price">Price (High to Low)</option>
            <option value="volume">24h Volume (High to Low)</option>
            <option value="change">24h Change (High to Low)</option>
          </select>
        </div>
      </div>

      <div className="bg-[#181830] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredTokens.map((token) => (
            <motion.div
              key={token.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#232347] rounded-xl p-4 hover:bg-[#2a2a52] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <img
                    src={token.icon}
                    alt={`${token.symbol} logo`}
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{token.name}</h3>
                  <p className="text-sm text-gray-400">{token.symbol}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-white">${parseFloat(token.priceUsd).toFixed(2)}</p>
                <p
                  className={`mt-1 text-sm ${
                    parseFloat(token.priceChange24h) >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {parseFloat(token.priceChange24h) >= 0 ? '+' : ''}
                  {parseFloat(token.priceChange24h).toFixed(2)}%
                </p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-400">
                  24h Volume: ${parseFloat(token.volume24h).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">
                  Chain: {token.chainId.charAt(0).toUpperCase() + token.chainId.slice(1)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
