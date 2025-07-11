"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useDexPair } from "@/hooks/useDexPair";

export default function DexPage() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");
  const [swapAmount, setSwapAmount] = useState("");
  const [swapDirection, setSwapDirection] = useState<"0to1" | "1to0">("0to1");

  const {
    reserves,
    loading,
    error,
    fetchReserves,
    addLiquidity,
    swapToken0ForToken1,
    swapToken1ForToken0,
  } = useDexPair(provider, signer);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      const signer = await browserProvider.getSigner();
      setProvider(browserProvider);
      setSigner(signer);
      setAccount(await signer.getAddress());
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    if (provider && signer) fetchReserves();
  }, [provider, signer, fetchReserves]);

  return (
    <div className="max-w-xl mx-auto mt-24 p-6 bg-[#181830] rounded-2xl shadow-lg text-white">
      <h1 className="text-2xl font-bold mb-4">Simple DEX Interface</h1>
      {!account ? (
        <button
          className="px-4 py-2 bg-cosmic-500 rounded-lg font-semibold mb-4"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mb-4 text-green-400">Connected: {account.slice(0, 6)}...{account.slice(-4)}</div>
      )}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Pool Reserves</h2>
        <div className="flex gap-4">
          <div>Token0: {reserves[0]}</div>
          <div>Token1: {reserves[1]}</div>
        </div>
        <button
          className="mt-2 px-3 py-1 bg-cosmic-500 rounded"
          onClick={fetchReserves}
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add Liquidity</h2>
        <input
          type="text"
          placeholder="Amount Token0"
          value={amount0}
          onChange={e => setAmount0(e.target.value)}
          className="px-2 py-1 rounded bg-[#232347] mr-2"
        />
        <input
          type="text"
          placeholder="Amount Token1"
          value={amount1}
          onChange={e => setAmount1(e.target.value)}
          className="px-2 py-1 rounded bg-[#232347] mr-2"
        />
        <button
          className="px-3 py-1 bg-cosmic-500 rounded"
          onClick={() => addLiquidity(amount0, amount1)}
          disabled={loading || !account}
        >
          Add
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Swap</h2>
        <select
          value={swapDirection}
          onChange={e => setSwapDirection(e.target.value as any)}
          className="px-2 py-1 rounded bg-[#232347] mr-2"
        >
          <option value="0to1">Token0 → Token1</option>
          <option value="1to0">Token1 → Token0</option>
        </select>
        <input
          type="text"
          placeholder="Amount"
          value={swapAmount}
          onChange={e => setSwapAmount(e.target.value)}
          className="px-2 py-1 rounded bg-[#232347] mr-2"
        />
        <button
          className="px-3 py-1 bg-cosmic-500 rounded"
          onClick={() =>
            swapDirection === "0to1"
              ? swapToken0ForToken1(swapAmount)
              : swapToken1ForToken0(swapAmount)
          }
          disabled={loading || !account}
        >
          Swap
        </button>
      </div>
      {error && <div className="text-red-400">{error}</div>}
      {loading && <div className="text-gray-400">Processing...</div>}
    </div>
  );
} 