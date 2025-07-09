"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowDown, ArrowUp, ArrowLeftRight, Send, Download, Upload } from 'lucide-react';

export interface TokenCardProps {
  symbol: string;
  price: number;
  change: number;
  balance: number;
  logo: string;
}

export function TokenCard({ symbol, price, change, balance, logo }: TokenCardProps) {
  return (
    <div className="bg-[#181830] rounded-2xl shadow-lg p-6 max-w-md mx-auto text-white">
      <div>
        <h2 className="text-lg font-semibold">{symbol}</h2>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">${price.toFixed(2)}</span>
          <span className={change >= 0 ? "text-green-400 text-sm" : "text-red-400 text-sm"}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
        </div>
        {/* Optionally, add a timestamp or other info here */}
      </div>
      {/* Chart placeholder, can be replaced with real chart data if available */}
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={[] /* Pass real chart data if available */} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          {/* <Line type="monotone" dataKey="price" stroke="#fff" strokeWidth={2} dot={false} /> */}
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip contentStyle={{ background: '#232347', border: 'none', borderRadius: '8px', color: '#fff' }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-4">
        <button className="flex flex-col items-center">
          <ArrowDown className="w-6 h-6" />
          <span className="text-xs">Buy/Sell</span>
        </button>
        <button className="flex flex-col items-center">
          <ArrowLeftRight className="w-6 h-6" />
          <span className="text-xs">Swap</span>
        </button>
        <button className="flex flex-col items-center">
          <Upload className="w-6 h-6" />
          <span className="text-xs">Bridge</span>
        </button>
        <button className="flex flex-col items-center">
          <Send className="w-6 h-6" />
          <span className="text-xs">Send</span>
        </button>
        <button className="flex flex-col items-center">
          <Download className="w-6 h-6" />
          <span className="text-xs">Receive</span>
        </button>
      </div>
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt={symbol} className="w-6 h-6" />
          <span>{symbol}</span>
          <span className={change >= 0 ? "text-green-400 text-xs" : "text-red-400 text-xs"}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
        </div>
        <div className="text-gray-300 text-sm">{balance.toFixed(4)}</div>
      </div>
    </div>
  );
} 