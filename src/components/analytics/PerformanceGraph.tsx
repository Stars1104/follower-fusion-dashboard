
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

// Mock data generator
const generateData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      followers: Math.floor(Math.random() * 500) + 1000,
      likes: Math.floor(Math.random() * 800) + 1500,
      views: Math.floor(Math.random() * 1200) + 3000,
      comments: Math.floor(Math.random() * 200) + 300,
    });
  }
  
  return data;
};

interface TimeRange {
  label: string;
  value: string;
}

const timeRanges: TimeRange[] = [
  { label: '7 Days', value: '7d' },
  { label: '30 Days', value: '30d' },
  { label: '3 Months', value: '3m' },
  { label: 'All Time', value: 'all' }
];

export const PerformanceGraph = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState<string>('7d');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Colors for each metric
  const colors = {
    followers: '#3b82f6',  // Blue
    likes: '#ef4444',      // Red
    views: '#8b5cf6',      // Purple
    comments: '#10b981',   // Green
  };

  useEffect(() => {
    // Simulate API call to fetch data
    setIsLoading(true);
    
    setTimeout(() => {
      setData(generateData());
      setIsLoading(false);
    }, 1000);
  }, [selectedRange]);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Performance Overview</h3>
            <div className="flex space-x-1 bg-secondary rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedRange === range.value
                      ? 'bg-white shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => handleRangeChange(range.value)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin-slow w-10 h-10 rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#888' }}
                    tickLine={false}
                    axisLine={{ stroke: '#f0f0f0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#888' }}
                    tickLine={false}
                    axisLine={{ stroke: '#f0f0f0' }}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '10px'
                    }}
                    labelStyle={{ marginBottom: '5px', fontWeight: 600 }}
                    itemStyle={{ padding: '2px 0' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="followers"
                    stroke={colors.followers}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                    dot={{ stroke: colors.followers, strokeWidth: 2, fill: 'white', r: 4 }}
                    name="Followers"
                  />
                  <Line
                    type="monotone"
                    dataKey="likes"
                    stroke={colors.likes}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                    dot={{ stroke: colors.likes, strokeWidth: 2, fill: 'white', r: 4 }}
                    name="Likes"
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke={colors.views}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                    dot={{ stroke: colors.views, strokeWidth: 2, fill: 'white', r: 4 }}
                    name="Views"
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke={colors.comments}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                    dot={{ stroke: colors.comments, strokeWidth: 2, fill: 'white', r: 4 }}
                    name="Comments"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
