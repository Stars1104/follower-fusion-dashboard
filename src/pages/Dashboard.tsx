
import { MetricCard } from '@/components/analytics/MetricCard';
import { PerformanceGraph } from '@/components/analytics/PerformanceGraph';
import { AnalyticsCard } from '@/components/analytics/AnalyticsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useBreakpoint } from '@/hooks/use-mobile';

// Mock recent orders data
const recentOrders = [
  { id: 'ORD-1234', username: 'user_432', service: 'followers', quantity: 500, status: 'pending' },
  { id: 'ORD-5678', username: 'influencer99', service: 'likes', quantity: 1200, status: 'completed' },
  { id: 'ORD-9101', username: 'brand_official', service: 'views', quantity: 3000, status: 'completed' },
  { id: 'ORD-1121', username: 'creator_studio', service: 'comments', quantity: 150, status: 'rejected' },
  { id: 'ORD-3141', username: 'social_guru', service: 'followers', quantity: 750, status: 'pending' },
];

// Status badge variants
const statusVariants = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const Dashboard = () => {
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  
  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <MetricCard
          title="Total Followers"
          value="24.5K"
          change={7.2}
          type="followers"
          delay={0.1}
        />
        <MetricCard
          title="Total Likes"
          value="152.3K"
          change={-2.1}
          type="likes"
          delay={0.2}
        />
        <MetricCard
          title="Total Views"
          value="3.4M"
          change={12.4}
          type="views"
          delay={0.3}
        />
        <MetricCard
          title="Total Comments"
          value="63.8K"
          change={4.8}
          type="comments"
          delay={0.4}
        />
      </div>
      
      {/* Performance Graph */}
      <PerformanceGraph />
      
      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsCard title="Recent Orders" className="lg:col-span-2" delay={0.3}>
          <div className="overflow-x-auto -mx-5 px-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead className={isMobile ? "hidden" : ""}>Username</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow 
                    key={order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>@{order.username}</TableCell>
                    <TableCell className="capitalize">{order.service}</TableCell>
                    <TableCell className="text-right">{order.quantity.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusVariants[order.status as keyof typeof statusVariants]} capitalize whitespace-nowrap`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
              View All Orders
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </AnalyticsCard>
        
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
      </div>
    </div>
  );
};

export default Dashboard;
