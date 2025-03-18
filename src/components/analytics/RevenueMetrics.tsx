
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, CreditCard, ShoppingBag } from 'lucide-react';

const RevenueMetrics = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50 text-green-600">
            <DollarSign size={20} />
          </div>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 flex items-center">
            <TrendingUp size={14} />
            <span className="ml-1">+8.2%</span>
          </span>
        </div>
        
        <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
        <div className="mt-1 flex items-baseline">
          <p className="text-2xl font-semibold">$128,430</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          From 1,520 orders
        </p>
      </Card>
      
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
            <ShoppingBag size={20} />
          </div>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 flex items-center">
            <TrendingUp size={14} />
            <span className="ml-1">+12.5%</span>
          </span>
        </div>
        
        <h3 className="text-sm font-medium text-muted-foreground">Today's Sales</h3>
        <div className="mt-1 flex items-baseline">
          <p className="text-2xl font-semibold">$5,240</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          From 85 orders today
        </p>
      </Card>
      
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
            <CreditCard size={20} />
          </div>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 flex items-center">
            <TrendingUp size={14} />
            <span className="ml-1">+4.3%</span>
          </span>
        </div>
        
        <h3 className="text-sm font-medium text-muted-foreground">Avg. Order Value</h3>
        <div className="mt-1 flex items-baseline">
          <p className="text-2xl font-semibold">$84.50</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Increased from $81.00
        </p>
      </Card>
      
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 text-orange-600">
            <TrendingUp size={20} />
          </div>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 flex items-center">
            <TrendingUp size={14} />
            <span className="ml-1">+6.7%</span>
          </span>
        </div>
        
        <h3 className="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
        <div className="mt-1 flex items-baseline">
          <p className="text-2xl font-semibold">32.8%</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          From visitors to customers
        </p>
      </Card>
    </motion.div>
  );
};

export default RevenueMetrics;
