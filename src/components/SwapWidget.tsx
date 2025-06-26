// src/components/SwapWidget.tsx
"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { ArrowUpDown, Settings, ChevronDown } from "lucide-react";
import TokenSelector from "./TokenSelector";

export default function SwapWidget() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Default fallback tokens (in case fetch fails)
  const fallbackTokens = [
    { symbol: "ETH", name: "Ethereum", icon: "/eth.svg", balance: 1.23 },
    { symbol: "USDC", name: "USD Coin", icon: "/usdc.svg", balance: 2500 },
    { symbol: "WETH", name: "Wrapped ETH", icon: "/weth.svg", balance: 0.5 },
  ];

  const { address } = useAccount();

  useEffect(() => {
    const fetchTokens = async () => {
      setLoadingTokens(true);
      setTokenError(null);
      try {
        let allTokens: any[] = [];
        for (let page = 1; page <= 5; page++) {
          const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}`
          );
          if (!res.ok) throw new Error("Failed to fetch tokens");
          const data = await res.json();
          allTokens = allTokens.concat(
            data.map((t: any) => ({
              symbol: t.symbol.toUpperCase(),
              name: t.name,
              icon: t.image,
              balance: 0, // Will be updated per wallet
              address: t.platforms?.ethereum || '', // for EVM tokens
              decimals: t.decimals || 18,
            }))
          );
        }
        setTokens(allTokens);
        setLoadingTokens(false);
      } catch (err) {
        setTokenError("Failed to load tokens. Showing fallback list.");
        setTokens(fallbackTokens);
        setLoadingTokens(false);
      }
    };
    fetchTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch balances for all tokens when tokens or address change
  useEffect(() => {
    const fetchBalances = async () => {
      if (!address || tokens.length === 0) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const updatedTokens = await Promise.all(
        tokens.map(async (token) => {
          // ETH balance
          if (token.symbol === "ETH") {
            try {
              const bal = await provider.getBalance(address);
              return { ...token, balance: parseFloat(ethers.utils.formatEther(bal)) };
            } catch {
              return token;
            }
          }
          // ERC20
          if (token.address && token.address !== "") {
            try {
              const erc20 = new ethers.Contract(
                token.address,
                ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"],
                provider
              );
              const bal = await erc20.balanceOf(address);
              // Use token.decimals if available, else try to fetch
              let decimals = token.decimals;
              if (!decimals) {
                try {
                  decimals = await erc20.decimals();
                } catch {
                  decimals = 18;
                }
              }
              return { ...token, balance: parseFloat(ethers.utils.formatUnits(bal, decimals)) };
            } catch {
              return token;
            }
          }
          return token;
        })
      );
      setTokens(updatedTokens);
    };
    fetchBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, tokens.length]);

  // Use the first two tokens as default selected
  const [fromToken, setFromToken] = useState(fallbackTokens[0]);
  const [toToken, setToToken] = useState(fallbackTokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Swap quote state
  const [quote, setQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [swapSuccess, setSwapSuccess] = useState<string | null>(null);

  // Helper to get 0x API token address (ETH = 0xeeee...)
  const get0xAddress = (token: any) => {
    if (!token.address || token.symbol === "ETH") return "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    return token.address;
  };

  // Get Quote from 0x API
  const handleGetQuote = async () => {
    setQuoteLoading(true);
    setQuoteError(null);
    setQuote(null);
    try {
      const sellToken = get0xAddress(fromToken);
      const buyToken = get0xAddress(toToken);
      const amount = ethers.utils.parseUnits(fromAmount || "0", fromToken.decimals || 18).toString();
      const url = `https://api.0x.org/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${amount}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch quote");
      const data = await res.json();
      setQuote(data);
      setToAmount(ethers.utils.formatUnits(data.buyAmount, toToken.decimals || 18));
    } catch (e: any) {
      setQuoteError(e.message || "Failed to get quote");
    } finally {
      setQuoteLoading(false);
    }
  };

  // Execute Swap
  const handleSwap = async () => {
    if (!quote || !address) return;
    setSwapLoading(true);
    setSwapError(null);
    setSwapSuccess(null);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // If ERC20, approve first
      if (fromToken.symbol !== "ETH" && fromToken.address) {
        const erc20 = new ethers.Contract(
          fromToken.address,
          ["function approve(address spender, uint256 amount) public returns (bool)"],
          signer
        );
        const approveTx = await erc20.approve(quote.allowanceTarget, quote.sellAmount);
        await approveTx.wait();
      }
      // Send swap tx
      const tx = await signer.sendTransaction({
        to: quote.to,
        data: quote.data,
        value: fromToken.symbol === "ETH" ? quote.value : undefined,
        gasLimit: quote.gas || undefined,
      });
      await tx.wait();
      setSwapSuccess("Swap successful!");
    } catch (e: any) {
      setSwapError(e.message || "Swap failed");
    } finally {
      setSwapLoading(false);
    }
  };

  useEffect(() => {
    if (tokens.length > 1) {
      setFromToken(tokens[0]);
      setToToken(tokens[1]);
    }
  }, [tokens]);

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/10 backdrop-blur-md rounded-[1rem] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)] border border-[#2D2D30] min-w-[360px] max-w-[500px] mx-auto flex flex-col gap-4 font-orbitron"
    >
      {/* Header with Settings */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-bold text-white tracking-wide">Swap</span>
        <button
          className="p-2 rounded-[0.75rem] border border-[#ff007a] text-[#ff007a] hover:bg-[rgba(255,0,122,0.1)] transition"
          onClick={() => setShowSettings((s) => !s)}
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white/10 backdrop-blur-md rounded-[1rem] p-6 border border-[#2D2D30] mb-2"
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[#bbbbbb] text-sm mb-1 font-inter">Slippage</label>
              <input
                type="number"
                className="bg-[#2A2A2E] text-white text-base px-4 py-3 rounded-[0.75rem] border border-[#2D2D30] w-full font-inter placeholder:text-[#777777]"
                placeholder="0.5"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-[#bbbbbb] text-sm mb-1 font-inter">Deadline (minutes)</label>
              <input
                type="number"
                className="bg-[#2A2A2E] text-white text-base px-4 py-3 rounded-[0.75rem] border border-[#2D2D30] w-full font-inter placeholder:text-[#777777]"
                placeholder="20"
                min="1"
              />
            </div>
            {/* Add more settings as needed */}
          </div>
        </motion.div>
      )}

      {/* From Token Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <TokenSelector
            selectedToken={fromToken}
            onSelect={setFromToken}
            tokens={tokens}
            side="from"
          />
          <span className="text-xs text-[#bbbbbb] font-inter">
            Balance: {fromToken.balance}
          </span>
        </div>
        <input
          type="number"
          className="bg-[#2A2A2E] text-white text-base px-4 py-3 rounded-[0.75rem] border border-[#2D2D30] font-inter placeholder:text-[#777777] outline-none"
          placeholder="0.0"
          value={fromAmount}
          onChange={(e) => setFromAmount(e.target.value)}
        />
        {/* Get Quote Button */}
        {address && (
          <button
            className="mt-2 px-4 py-2 bg-cosmic-500 text-white rounded-xl font-bold hover:bg-cosmic-400 transition disabled:opacity-50"
            onClick={handleGetQuote}
            disabled={quoteLoading || !fromAmount || parseFloat(fromAmount) <= 0 || !fromToken || !toToken}
            type="button"
          >
            {quoteLoading ? "Getting Quote..." : "Get Quote"}
          </button>
        )}
        {quoteError && <div className="text-red-500 text-xs mt-1">{quoteError}</div>}
      </div>

      {/* Flip Button */}
      <div className="flex justify-center my-2">
        <button
          className="bg-transparent border border-[#ff007a] text-[#ff007a] p-2 rounded-full hover:bg-[rgba(255,0,122,0.1)] transition"
          onClick={handleFlip}
          aria-label="Flip tokens"
        >
          <ArrowUpDown size={20} />
        </button>
      </div>

      {/* To Token Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <TokenSelector
            selectedToken={toToken}
            onSelect={setToToken}
            tokens={tokens}
            side="to"
          />
          <span className="text-xs text-[#bbbbbb] font-inter">
            Balance: {toToken.balance}
          </span>
        </div>
        <input
          type="number"
          className="bg-[#2A2A2E] text-white text-base px-4 py-3 rounded-[0.75rem] border border-[#2D2D30] font-inter placeholder:text-[#777777] outline-none"
          placeholder="0.0"
          value={toAmount}
          onChange={(e) => setToAmount(e.target.value)}
          disabled
        />
      </div>

      {/* Quote & Swap Controls */}
      {address && quote && (
        <div className="bg-[#23232a] rounded-xl p-4 mt-4 border border-cosmic-400/20">
          <div className="flex flex-col gap-2 text-sm text-white">
            <div className="flex justify-between"><span>Expected Output</span><span>{ethers.utils.formatUnits(quote.buyAmount, toToken.decimals || 18)} {toToken.symbol}</span></div>
            <div className="flex justify-between"><span>Minimum Received</span><span>{ethers.utils.formatUnits(quote.guaranteedPrice ? (BigInt(quote.buyAmount) * BigInt(Math.floor(Number(quote.guaranteedPrice) * 1e6)) / BigInt(1e6)).toString() : quote.buyAmount, toToken.decimals || 18)} {toToken.symbol}</span></div>
            <div className="flex justify-between"><span>Estimated Gas</span><span>{quote.estimatedGas || quote.gas || "-"}</span></div>
            <div className="flex justify-between"><span>Price Impact</span><span>{quote.estimatedPriceImpact ? `${(Number(quote.estimatedPriceImpact) * 100).toFixed(2)}%` : '-'}</span></div>
          </div>
          <button
            className="mt-4 w-full px-4 py-2 bg-cosmic-500 text-white rounded-xl font-bold hover:bg-cosmic-400 transition disabled:opacity-50"
            onClick={handleSwap}
            disabled={swapLoading}
            type="button"
          >
            {swapLoading ? "Swapping..." : "Swap"}
          </button>
          {swapError && <div className="text-red-500 text-xs mt-2">{swapError}</div>}
          {swapSuccess && <div className="text-green-500 text-xs mt-2">{swapSuccess}</div>}
        </div>
      )}
    </motion.div>
  );
}