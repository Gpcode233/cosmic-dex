'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

// Add a type for chart data points
interface ChartPoint {
  time: string;
  price: number;
}

export default function Explore() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');
  const [sortField, setSortField] = useState<'price' | 'volume' | 'change'>('price');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const filterOptions = [
    'Top Gainers',
    'Top Losers',
    'New Listings',
    'High Volume',
    'Trending',
  ];
  const filterRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'15m' | '1h' | '1d' | '1w' | '6mo'>('1d');
  const modalRef = useRef<HTMLDivElement>(null);
  const [symbolToId, setSymbolToId] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterDropdownOpen(false);
      }
    }
    if (filterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterDropdownOpen]);

  useEffect(() => {
    // List of popular tokens to show by default
    const defaultTokens = ["ETH", "USDT", "USDC", "SOL", "BNB", "MATIC", "ARB", "OP", "AVAX", "FTM"];

    const fetchTokens = async (query?: string) => {
      setLoading(true);
      setError(null);
      try {
        let pairs: unknown[] = [];
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
        const transformedData = pairs.map((pair: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const p = pair as Record<string, any>;
          return {
            address: p.baseToken.address,
            name: p.baseToken.name,
            symbol: p.baseToken.symbol,
            priceUsd: p.priceUsd,
            volume24h: p.volume?.usd || p.volume24h || "0",
            priceChange24h: p.priceChange?.h24 || p.priceChange24h || "0",
            chainId: p.chainId,
            icon: p.info?.imageUrl || '',
          };
        });
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

  // Fetch CoinGecko symbol-to-id mapping on mount
  useEffect(() => {
    const fetchCoinList = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
        const data = await res.json();
        const mapping: Record<string, string> = {};
        data.forEach((coin: { id: string; symbol: string }) => {
          mapping[coin.symbol.toLowerCase()] = coin.id;
        });
        setSymbolToId(mapping);
      } catch {}
    };
    fetchCoinList();
  }, []);

  // Helper to get CoinGecko token logo URL
  const getTokenLogo = (token: TokenData) => {
    const id = symbolToId[token.symbol.toLowerCase()];
    if (id) {
      return `https://assets.coingecko.com/coins/images/${id}/large.png`;
    }
    return '';
  };

  // Fetch chart data from CoinGecko
  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedToken) return;
      setChartLoading(true);
      setChartError(null);
      setChartData([]);
      try {
        // Map timeframe to CoinGecko API params
        let days = '1';
        let interval = 'minutely';
        if (chartTimeframe === '15m') { days = '1'; interval = 'minutely'; }
        if (chartTimeframe === '1h') { days = '1'; interval = 'minutely'; }
        if (chartTimeframe === '1d') { days = '1'; interval = 'hourly'; }
        if (chartTimeframe === '1w') { days = '7'; interval = 'hourly'; }
        if (chartTimeframe === '6mo') { days = '180'; interval = 'daily'; }
        
        // Expanded mapping for popular tokens
        const tokenIdMap: Record<string, string> = {
          'eth': 'ethereum',
          'btc': 'bitcoin',
          'usdt': 'tether',
          'usdc': 'usd-coin',
          'sol': 'solana',
          'bnb': 'binancecoin',
          'matic': 'matic-network',
          'arb': 'arbitrum',
          'op': 'optimism',
          'avax': 'avalanche-2',
          'ftm': 'fantom',
          'link': 'chainlink',
          'uni': 'uniswap',
          'aave': 'aave',
          'comp': 'compound-governance-token',
          'sushi': 'sushi',
          'crv': 'curve-dao-token',
          '1inch': '1inch',
          'dai': 'dai',
          'wbtc': 'wrapped-bitcoin',
        };
        
        const symbol = selectedToken.symbol.toLowerCase();
        const id = tokenIdMap[symbol] || symbolToId[symbol];
        
        if (!id) {
          throw new Error(`Chart data not available for ${selectedToken.symbol}. Try ETH, BTC, USDT, or other major tokens.`);
        }
        
        const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch chart data');
        const data = await res.json();
        // Format data for recharts
        const formatted = (data.prices || []).map((d: [number, number]) => ({
          time: new Date(d[0]).toLocaleString(),
          price: d[1],
        }));
        setChartData(formatted);
      } catch (err) {
        setChartError(err instanceof Error ? err.message : 'Failed to load chart');
      } finally {
        setChartLoading(false);
      }
    };
    if (modalOpen && selectedToken) fetchChartData();
  }, [modalOpen, selectedToken, chartTimeframe, symbolToId]);

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    }
    if (modalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modalOpen]);

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
    <div className="min-h-screen p-4 md:p-8 mt-24">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Explore Tokens</h1>
        <div className="flex gap-4 flex-wrap items-center">
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
          <div className="relative" ref={filterRef}>
            <button
              className="px-4 py-2 rounded-lg bg-cosmic-500 text-white font-semibold hover:bg-cosmic-600 transition-colors"
              onClick={() => setFilterDropdownOpen((v) => !v)}
              type="button"
            >
              Filter
            </button>
            <AnimatePresence>
              {filterDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-[#232347] border border-cosmic-500 rounded-xl shadow-lg z-50 p-4 flex flex-col gap-2"
                >
                  {filterOptions.map(option => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeFilters.includes(option)}
                        onChange={() => {
                          setActiveFilters(f =>
                            f.includes(option)
                              ? f.filter(x => x !== option)
                              : [...f, option]
                          );
                        }}
                        className="accent-cosmic-500 w-5 h-5"
                      />
                      <span className="text-white font-medium">{option}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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

      <AnimatePresence>
        {modalOpen && selectedToken && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-[#232347] rounded-2xl p-8 w-full max-w-2xl shadow-xl border border-cosmic-500 relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-white text-2xl hover:text-cosmic-500"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {getTokenLogo(selectedToken) ? (
                    <Image
                      src={getTokenLogo(selectedToken)}
                      alt={`${selectedToken.symbol} logo`}
                      className="w-12 h-12"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#bbb] text-white font-bold text-2xl">
                      {selectedToken.symbol[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedToken.name}</h2>
                  <p className="text-lg text-gray-400">{selectedToken.symbol}</p>
                </div>
              </div>
              <div className="mb-4 flex gap-2">
                {(['15m', '1h', '1d', '1w', '6mo'] as const).map(tf => (
                  <button
                    key={tf}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${chartTimeframe === tf ? 'bg-cosmic-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    onClick={() => setChartTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
              <div className="h-72 w-full">
                {chartLoading ? (
                  <div className="flex items-center justify-center h-full text-white">Loading chart...</div>
                ) : chartError ? (
                  <div className="flex items-center justify-center h-full text-red-400">{chartError}</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff007a" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ff007a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="time" stroke="#ffffff60" fontSize={12} tickLine={false} hide={chartTimeframe === '15m' || chartTimeframe === '1h'} />
                      <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} domain={['auto', 'auto']} tickFormatter={v => `$${v.toFixed(2)}`} />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px', color: '#ffffff' }} formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']} />
                      <Area type="monotone" dataKey="price" stroke="#ff007a" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#181830] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredTokens.map((token, idx) => (
            <motion.div
              key={token.address + '-' + idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#232347] rounded-xl p-4 hover:bg-[#2a2a52] transition-colors cursor-pointer"
              onClick={() => { setSelectedToken(token); setModalOpen(true); }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {getTokenLogo(token) && !imageError[token.symbol] ? (
                    <Image
                      src={getTokenLogo(token)}
                      alt={`${token.symbol} logo`}
                      className="w-8 h-8"
                      width={32}
                      height={32}
                      onError={() => setImageError(prev => ({ ...prev, [token.symbol]: true }))}
                    />
                  ) : (
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#bbb] text-white font-bold text-lg">
                      {token.symbol[0]}
                    </span>
                  )}
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
