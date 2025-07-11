import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

// Replace with your deployed contract addresses
const DEX_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const TOKEN_A_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const TOKEN_B_ADDRESS = '0x...'; // Fill in if you deployed TokenB

const DEX_ABI = [
  'function addLiquidity(uint amount0, uint amount1) external',
  'function removeLiquidity(uint amount0, uint amount1) external',
  'function swapToken0ForToken1(uint amountIn) external',
  'function swapToken1ForToken0(uint amountIn) external',
  'function getReserves() external view returns (uint112, uint112)',
  'event LiquidityAdded(address indexed provider, uint amount0, uint amount1)',
  'event LiquidityRemoved(address indexed provider, uint amount0, uint amount1)',
  'event Swapped(address indexed user, address tokenIn, uint amountIn, address tokenOut, uint amountOut)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
];

export function useDexPair(provider: ethers.BrowserProvider | null, signer: ethers.Signer | null) {
  const [reserves, setReserves] = useState<[string, string]>(['0', '0']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dex = provider && new ethers.Contract(DEX_ADDRESS, DEX_ABI, signer || provider);
  const tokenA = provider && new ethers.Contract(TOKEN_A_ADDRESS, ERC20_ABI, signer || provider);
  const tokenB = provider && new ethers.Contract(TOKEN_B_ADDRESS, ERC20_ABI, signer || provider);

  const fetchReserves = useCallback(async () => {
    if (!dex) return;
    setLoading(true);
    try {
      const [r0, r1] = await dex.getReserves();
      setReserves([r0.toString(), r1.toString()]);
    } catch (e) {
      setError('Failed to fetch reserves');
    } finally {
      setLoading(false);
    }
  }, [dex]);

  const addLiquidity = useCallback(async (amount0: string, amount1: string) => {
    if (!dex || !tokenA || !tokenB || !signer) return;
    setLoading(true);
    try {
      await tokenA.approve(DEX_ADDRESS, amount0);
      await tokenB.approve(DEX_ADDRESS, amount1);
      const tx = await dex.addLiquidity(amount0, amount1);
      await tx.wait();
      await fetchReserves();
    } catch (e) {
      setError('Add liquidity failed');
    } finally {
      setLoading(false);
    }
  }, [dex, tokenA, tokenB, signer, fetchReserves]);

  const swapToken0ForToken1 = useCallback(async (amountIn: string) => {
    if (!dex || !tokenA || !signer) return;
    setLoading(true);
    try {
      await tokenA.approve(DEX_ADDRESS, amountIn);
      const tx = await dex.swapToken0ForToken1(amountIn);
      await tx.wait();
      await fetchReserves();
    } catch (e) {
      setError('Swap failed');
    } finally {
      setLoading(false);
    }
  }, [dex, tokenA, signer, fetchReserves]);

  const swapToken1ForToken0 = useCallback(async (amountIn: string) => {
    if (!dex || !tokenB || !signer) return;
    setLoading(true);
    try {
      await tokenB.approve(DEX_ADDRESS, amountIn);
      const tx = await dex.swapToken1ForToken0(amountIn);
      await tx.wait();
      await fetchReserves();
    } catch (e) {
      setError('Swap failed');
    } finally {
      setLoading(false);
    }
  }, [dex, tokenB, signer, fetchReserves]);

  const removeLiquidity = useCallback(async (amount0: string, amount1: string) => {
    if (!dex || !signer) return;
    setLoading(true);
    try {
      const tx = await dex.removeLiquidity(amount0, amount1);
      await tx.wait();
      await fetchReserves();
    } catch (e) {
      setError('Remove liquidity failed');
    } finally {
      setLoading(false);
    }
  }, [dex, signer, fetchReserves]);

  return {
    reserves,
    loading,
    error,
    fetchReserves,
    addLiquidity,
    swapToken0ForToken1,
    swapToken1ForToken0,
    removeLiquidity,
    tokenA,
    tokenB,
  };
} 