
import { Card } from '@/components/ui/card';
import { AnalyticsCard } from '@/components/analytics/AnalyticsCard';
import { motion } from 'framer-motion';

const ServiceDistribution = () => {
  return (
    <AnalyticsCard title="Service Distribution" delay={0.4}>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Followers</span>
            <span className="text-sm font-medium">45%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Likes</span>
            <span className="text-sm font-medium">30%</span>
          </div>
          <div className="w-full bg-red-100 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Views</span>
            <span className="text-sm font-medium">15%</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Comments</span>
            <span className="text-sm font-medium">10%</span>
          </div>
          <div className="w-full bg-green-100 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
          </div>
        </div>
      </div>
      
      <Card className="mt-6 p-4 bg-muted/50">
        <h4 className="text-sm font-medium mb-2">Quick Summary</h4>
        <p className="text-sm text-muted-foreground">
          Followers services account for almost half of all orders, followed by likes at 30%.
        </p>
      </Card>
      
      {/* Services Growth */}
      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-medium">Monthly Growth</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-md border">
            <div className="text-sm text-muted-foreground">Followers</div>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-lg font-semibold">+12.5%</span>
              <span className="text-xs text-green-500 mb-0.5">↑</span>
            </div>
          </div>
          
          <div className="p-3 rounded-md border">
            <div className="text-sm text-muted-foreground">Likes</div>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-lg font-semibold">+8.3%</span>
              <span className="text-xs text-green-500 mb-0.5">↑</span>
            </div>
          </div>
          
          <div className="p-3 rounded-md border">
            <div className="text-sm text-muted-foreground">Views</div>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-lg font-semibold">+17.2%</span>
              <span className="text-xs text-green-500 mb-0.5">↑</span>
            </div>
          </div>
          
          <div className="p-3 rounded-md border">
            <div className="text-sm text-muted-foreground">Comments</div>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-lg font-semibold">+5.8%</span>
              <span className="text-xs text-green-500 mb-0.5">↑</span>
            </div>
          </div>
        </div>
      </div>
    </AnalyticsCard>
  );
};

export default ServiceDistribution;
