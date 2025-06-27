// src/components/TokenSelector.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  address: string;
  decimals: number;
}

interface TokenSelectorProps {
  selectedToken: Token;
  onSelect: (token: Token) => void;
  tokens: Token[];
  side: string;
}

export default function TokenSelector({ selectedToken, onSelect, tokens, side }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter tokens by search term (name or symbol)
  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase()) ||
      token.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        className="flex items-center bg-[#1e1e22] rounded-[0.75rem] px-4 py-2 min-w-[100px] border border-[#2D2D30] hover:bg-[#2A2A2E] transition"
        onClick={() => setOpen((o) => !o)}
        type="button"
        aria-label={`Select ${side} token`}
      >
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-[#2e2e33] p-1">
            <Image
              src={selectedToken.icon}
              alt={selectedToken.symbol}
              width={20}
              height={20}
              className="inline-block"
            />
          </span>
          <span className="font-orbitron font-bold text-white text-base">{selectedToken.symbol}</span>
        </span>
        <ChevronDown className="ml-2 text-[#bbbbbb]" size={20} />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 left-0 w-full bg-[#1e1e22] rounded-[0.75rem] border border-[#2D2D30] shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#23232a] text-white placeholder-gray-400 border border-[#2D2D30] mb-2 outline-none"
              autoFocus
            />
          </div>
          {filteredTokens.length === 0 ? (
            <div className="text-center py-4 text-gray-400 font-inter text-sm">No tokens found</div>
          ) : (
            filteredTokens.map((token) => (
              <button
                key={token.symbol + token.name}
                className="flex items-center w-full px-4 py-2 hover:bg-[#2A2A2E] transition text-white font-orbitron"
                onClick={() => {
                  onSelect(token);
                  setOpen(false);
                  setSearch("");
                }}
                type="button"
              >
                <span className="rounded-full bg-[#2e2e33] p-1 mr-2">
                  <Image
                    src={token.icon}
                    alt={token.symbol}
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                </span>
                <span>{token.symbol}</span>
                <span className="ml-2 text-[#bbbbbb] font-inter text-xs">{token.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}