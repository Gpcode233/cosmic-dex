"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowDown, ArrowUp, Swap, Send, Download, Upload } from 'lucide-react';

// Example price data (replace with real data as needed)
const data = [
  { time: '9:00', price: 18.2 },
  { time: '10:00', price: 18.5 },
  { time: '11:00', price: 18.83 },
  { time: '12:00', price: 18.5 },
  { time: '13:00', price: 18.0 },
  { time: '14:00', price: 17.9 },
  { time: '15:00', price: 17.87 },
];

export function TokenCard() {
  return (
    <div className="bg-[#181830] rounded-2xl shadow-lg p-6 max-w-md mx-auto text-white">
      <div>
        <h2 className="text-lg font-semibold">AVAX</h2>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">$17.93</span>
          <span className="text-red-400 text-sm">-4.25%</span>
        </div>
        <div className="text-gray-400 text-xs">~ $0.796 (Jul 4, 3:36 PM)</div>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <Line type="monotone" dataKey="price" stroke="#fff" strokeWidth={2} dot={false} />
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
          <Swap className="w-6 h-6" />
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
          <img src="/avax-logo.png" alt="AVAX" className="w-6 h-6" />
          <span>AVAX</span>
          <span className="text-red-400 text-xs">-4.22%</span>
        </div>
        <div className="text-gray-300 text-sm">$0.00</div>
      </div>
    </div>
  );
} 