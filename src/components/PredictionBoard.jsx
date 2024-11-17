import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PastRounds from './PastRounds';
import RoundManager from './RoundManager';
import PredictionCard from './PredictionCard';
import useTokenPrice from '../hooks/useTokenPrice';
import useRoundData from '../hooks/useRoundData';
import { TrendingUp, Clock, Trophy, ChevronUp, ChevronDown } from 'lucide-react';

// Live Price Chart Component
const LivePriceChart = ({ currentPrice }) => {
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    if (currentPrice) {
      setPriceHistory(prev => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        });

        const newHistory = [...prev, {
          time: timeStr,
          price: currentPrice,
          isUp: prev.length > 0 ? currentPrice > prev[prev.length - 1].price : true
        }].slice(-20);

        return newHistory;
      });
    }
  }, [currentPrice]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1b1f] border border-[#2a2b2f] rounded-lg p-2 shadow-lg">
          <p className="text-gray-400 text-xs">{payload[0].payload.time}</p>
          <p className="text-white font-medium">
            ${payload[0].value.toFixed(4)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0D1117] rounded-xl border border-[#2a2b2f] p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-white font-medium">Live Tezos Price</div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={priceHistory}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="time"
              stroke="#4B5563"
              tick={{ fill: '#4B5563', fontSize: 12 }}
            />
            <YAxis 
              domain={['auto', 'auto']}
              stroke="#4B5563"
              tick={{ fill: '#4B5563', fontSize: 12 }}
              width={60}
              tickFormatter={value => value.toFixed(4)}
            />
            <Tooltip content={<CustomTooltip />} />
            {priceHistory.map((entry, index) => {
              if (index === 0) return null;
              const prevEntry = priceHistory[index - 1];
              const isUp = entry.price >= prevEntry.price;
              
              return (
                <Line
                  key={entry.time}
                  type="monotone"
                  dataKey="price"
                  stroke={isUp ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: isUp ? '#10B981' : '#EF4444',
                    stroke: isUp ? '#059669' : '#DC2626'
                  }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-[#1a1b1f] p-6 rounded-xl border border-[#2a2b2f] hover:border-[#ff3366]/50 transition-colors">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <span className={`text-sm ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      <div className="text-[#ff3366]">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

// Main PredictionBoard Component
const PredictionBoard = () => {
    const tokenPrice = useTokenPrice();
    const [currentPrice, setCurrentPrice] = useState(null);
    const { roundInfo } = useRoundData();

    useEffect(() => {
        if (tokenPrice) {
            setCurrentPrice(tokenPrice);
        }
    }, [tokenPrice]);

    return (
        <div className="min-h-screen bg-[#0a0b0f] p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Market Prediction Board
                    </h1>
                    <p className="text-gray-400">
                        Predict SOL's price movement and earn rewards
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                        title="Current Price"
                        value={`$${currentPrice ? currentPrice.toFixed(4) : '---'}`}
                        icon={TrendingUp}
                        trend={2.5}
                    />
                    <StatsCard
                        title="Round"
                        value={`#${roundInfo?.currentEpoch || '---'}`}
                        icon={Clock}
                    />
                    <StatsCard
                        title="Prize Pool"
                        value={`${roundInfo?.totalPrizePool || '0.00'} ETH`}
                        icon={Trophy}
                        trend={5.2}
                    />
                </div>

                {/* Live Chart */}
                <div className="w-full">
                    <LivePriceChart currentPrice={currentPrice} />
                </div>

                {/* Round Manager */}
                <div>
                    <RoundManager currentPrice={currentPrice} roundInfo={roundInfo} />
                </div>

                {/* Prediction Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Prediction Card */}
                    <div className="bg-[#1a1b1f]/80 backdrop-blur-sm rounded-xl border border-[#2a2b2f] overflow-hidden">
                        <PredictionCard currentPrice={currentPrice} roundInfo={roundInfo} />
                    </div>

                    {/* Additional Info or Stats could go here */}
                    <div className="bg-[#1a1b1f]/80 backdrop-blur-sm rounded-xl border border-[#2a2b2f] p-6">
                        <h3 className="text-white font-medium mb-4">Position Stats</h3>
                        {/* Add position statistics here */}
                    </div>
                </div>

                {/* Past Rounds */}
                <div>
                    <PastRounds />
                </div>
            </div>

            {/* Optional: Floating Action Button for mobile */}
            <button className="fixed bottom-6 right-6 md:hidden bg-gradient-to-r from-[#ff3366] to-[#ff6699] p-4 rounded-full shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
            </button>
        </div>
    );
};

export default PredictionBoard;