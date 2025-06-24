import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import Image from 'next/image';

interface Token {
  symbol: string;
  name: string;
  icon: string;
}

const mockTokens: Token[] = [
  { symbol: 'USDT', name: 'Tether', icon: '/usdt.png' },
  { symbol: 'BTC', name: 'Bitcoin', icon: '/btc.png' },
  { symbol: 'ETH', name: 'Ethereum', icon: '/eth.png' },
  { symbol: 'SOL', name: 'Solana', icon: '/sol.png' },
];

interface TokenSelectorProps {
  selected: Token | null;
  onSelect: (token: Token) => void;
  disabled?: boolean;
}

export function TokenSelector({ selected, onSelect, disabled = false }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = mockTokens.filter(t => t.symbol.toLowerCase().includes(search.toLowerCase()) || t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative">
      <button
        className={`w-full flex items-center justify-between bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-lg text-white font-orbitron focus:outline-none focus:ring-2 focus:ring-cosmic-500 transition-all ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        type="button"
      >
        <span className="flex items-center gap-2">
          <Image src={selected?.icon || '/usdt.png'} alt={selected?.symbol || '--'} width={24} height={24} className="w-6 h-6 rounded-full" />
          <span className="font-bold">{selected?.symbol || '--'}</span>
        </span>
        <ChevronDown className="w-5 h-5 text-cosmic-400" />
      </button>
      <AnimatePresence>
        {open && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 bg-[#181f2a] border border-[#232c3a] rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto"
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
              <Search className="w-4 h-4 text-cosmic-400" />
              <input
                type="text"
                placeholder="Search Coin Name"
                className="w-full px-2 py-1 bg-transparent text-white font-orbitron outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div>
              {filtered.map(token => (
                <button
                  key={token.symbol}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-cosmic-500/10 transition-colors cursor-pointer"
                  onClick={() => { onSelect(token); setOpen(false); setSearch(''); }}
                  type="button"
                >
                  <Image src={token.icon} alt={token.symbol} width={24} height={24} className="w-6 h-6 rounded-full" />
                  <span className="font-bold text-white">{token.symbol}</span>
                  <span className="text-xs text-gray-400">{token.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 