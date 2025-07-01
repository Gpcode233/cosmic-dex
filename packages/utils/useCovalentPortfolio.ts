import { useState, useEffect, useCallback } from 'react';

// Types for Covalent API responses
export interface TokenBalance {
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  logo_url: string;
  balance: string;
  quote: number;
  quote_24h: number;
  quote_rate: number;
  quote_rate_24h: number;
  decimals: number;
  nft_data?: unknown[];
}

export interface PortfolioData {
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: TokenBalance[];
  pagination: unknown;
}

export interface HistoricalData {
  date: string;
  value: number;
}

const COVALENT_API_KEY = 'cqt_rQy6F44wTJ7x3y4KMkW6K9PKJPyj';

export const useCovalentPortfolio = (address: string | undefined) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate mock historical data for charts
  const generateMockHistoricalData = useCallback((timeframe: '1D' | '7D' | '1M' | '3M' | '1Y' = '7D') => {
    const days = timeframe === '1D' ? 24 : 
                 timeframe === '7D' ? 7 : 
                 timeframe === '1M' ? 30 : 
                 timeframe === '3M' ? 90 : 365;
    
    const data: HistoricalData[] = [];
    let baseValue = portfolioData?.items?.reduce((sum, token) => sum + token.quote, 0) || 10000;
    
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 0.1; // ±5% daily change
      baseValue *= (1 + change);
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: Math.round(baseValue * 100) / 100
      });
    }
    
    setHistoricalData(data);
  }, [portfolioData]);

  // Fetch portfolio data from Covalent
  const fetchPortfolioData = useCallback(async () => {
    if (!address) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://api.covalenthq.com/v1/1/address/${address}/balances_v3/?key=${COVALENT_API_KEY}&with-uncached=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }
      
      const data = await response.json();
      setPortfolioData(data.data);
      
      // Generate mock historical data for demonstration
      generateMockHistoricalData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  }, [address, generateMockHistoricalData]);

  // Calculate portfolio statistics
  const getPortfolioStats = () => {
    if (!portfolioData?.items) return null;
    
    const totalValue = portfolioData.items.reduce((sum, token) => sum + token.quote, 0);
    const totalValue24h = portfolioData.items.reduce((sum, token) => sum + (token.quote_24h || 0), 0);
    const change24h = totalValue - totalValue24h;
    const changePercent = totalValue24h > 0 ? (change24h / totalValue24h) * 100 : 0;
    
    return {
      totalValue,
      change24h,
      changePercent,
      tokenCount: portfolioData.items.length
    };
  };

  useEffect(() => {
    if (address) {
      fetchPortfolioData();
    }
  }, [address, fetchPortfolioData]);

  return {
    portfolioData,
    historicalData,
    loading,
    error,
    fetchPortfolioData,
    generateMockHistoricalData,
    getPortfolioStats
  };
}; 