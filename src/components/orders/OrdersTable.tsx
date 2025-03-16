
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Instagram, Heart, Eye, MessageCircle, ArrowUpDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

// Mock data types
type OrderStatus = 'pending' | 'completed' | 'rejected';
type ServiceType = 'followers' | 'likes' | 'views' | 'comments';

interface Order {
  id: string;
  username: string;
  serviceType: ServiceType;
  quantity: number;
  price: number;
  status: OrderStatus;
  date: string;
}

// Generate mock data
const generateOrders = (count: number): Order[] => {
  const orders: Order[] = [];
  const serviceTypes: ServiceType[] = ['followers', 'likes', 'views', 'comments'];
  const statuses: OrderStatus[] = ['pending', 'completed', 'rejected'];
  
  for (let i = 0; i < count; i++) {
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const quantity = Math.floor(Math.random() * 1000) + 100;
    const price = (quantity * (Math.random() * 0.05 + 0.01)).toFixed(2);
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    orders.push({
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      username: `user_${Math.floor(Math.random() * 1000)}`,
      serviceType,
      quantity,
      price: parseFloat(price),
      status,
      date: date.toISOString().split('T')[0],
    });
  }
  
  return orders;
};

export const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get('type') as ServiceType | null;
  
  // Service type icons
  const serviceIcons = {
    followers: <Instagram size={16} className="text-blue-500" />,
    likes: <Heart size={16} className="text-red-500" />,
    views: <Eye size={16} className="text-purple-500" />,
    comments: <MessageCircle size={16} className="text-green-500" />
  };
  
  // Status badge variants
  const statusVariants = {
    pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    completed: 'bg-green-100 text-green-800 hover:bg-green-200',
    rejected: 'bg-red-100 text-red-800 hover:bg-red-200'
  };

  useEffect(() => {
    // Simulate API call to fetch orders
    setIsLoading(true);
    setTimeout(() => {
      const generatedOrders = generateOrders(20);
      setOrders(generatedOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter orders based on search term and type filter
    let filtered = [...orders];
    
    if (typeFilter) {
      filtered = filtered.filter(order => order.serviceType === typeFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term) || 
        order.username.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, typeFilter]);

  const handleRowClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-60 flex items-center justify-center">
          <div className="animate-spin-slow w-10 h-10 rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search orders or usernames..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {typeFilter && (
              <Badge variant="outline" className="py-1.5">
                {serviceIcons[typeFilter]}
                <span className="ml-1 capitalize">{typeFilter}</span>
              </Badge>
            )}
            
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm">New Order</Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Order ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <span>Service Type</span>
                    <ArrowUpDown size={14} className="opacity-50" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(order.id)}
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>@{order.username}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {serviceIcons[order.serviceType]}
                        <span className="capitalize">{order.serviceType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{order.quantity}</TableCell>
                    <TableCell className="text-right">${order.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className={`${statusVariants[order.status]} capitalize`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
