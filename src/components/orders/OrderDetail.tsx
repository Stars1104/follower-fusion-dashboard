
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Instagram, Heart, Eye, MessageCircle, ArrowLeft, Calendar, Clock, DollarSign, Check, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Mock order type definitions
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
  instagramHandle: string;
  postUrl?: string;
  notes?: string;
  customerEmail: string;
  paymentMethod: string;
  createdAt: string;
}

export const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Service type icons and colors
  const serviceDetails = {
    followers: { icon: <Instagram size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    likes: { icon: <Heart size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
    views: { icon: <Eye size={20} />, color: 'text-purple-500', bg: 'bg-purple-50' },
    comments: { icon: <MessageCircle size={20} />, color: 'text-green-500', bg: 'bg-green-50' }
  };
  
  // Status badge variants
  const statusVariants = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  
  // Mock data for a single order
  useEffect(() => {
    // Simulate API call to fetch order details
    setIsLoading(true);
    
    setTimeout(() => {
      // Create a mock order
      const mockOrder: Order = {
        id: orderId || `ORD-${Math.floor(Math.random() * 10000)}`,
        username: `user_${Math.floor(Math.random() * 1000)}`,
        serviceType: ['followers', 'likes', 'views', 'comments'][Math.floor(Math.random() * 4)] as ServiceType,
        quantity: Math.floor(Math.random() * 5000) + 100,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        status: ['pending', 'completed', 'rejected'][Math.floor(Math.random() * 3)] as OrderStatus,
        date: new Date().toISOString().split('T')[0],
        instagramHandle: 'instagram_user',
        postUrl: 'https://instagram.com/p/example',
        notes: Math.random() > 0.5 ? 'Please process as soon as possible' : undefined,
        customerEmail: 'customer@example.com',
        paymentMethod: 'Credit Card',
        createdAt: new Date().toISOString(),
      };
      
      setOrder(mockOrder);
      setIsLoading(false);
    }, 1000);
  }, [orderId]);

  const handleApprove = () => {
    if (!order) return;
    
    setIsProcessing(true);
    
    // Simulate API call to approve order
    setTimeout(() => {
      setOrder({ ...order, status: 'completed' });
      setIsProcessing(false);
      
      toast({
        title: "Order Approved",
        description: `Order ${order.id} has been successfully approved.`,
        variant: "default",
      });
    }, 1500);
  };

  const handleReject = () => {
    if (!order) return;
    
    setIsProcessing(true);
    
    // Simulate API call to reject order
    setTimeout(() => {
      setOrder({ ...order, status: 'rejected' });
      setIsProcessing(false);
      
      toast({
        title: "Order Rejected",
        description: `Order ${order.id} has been rejected.`,
        variant: "destructive",
      });
    }, 1500);
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

  if (!order) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-warning mb-4" />
          <h3 className="text-lg font-medium mb-2">Order Not Found</h3>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/orders')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Orders
          </Button>
        </div>
      </Card>
    );
  }

  const serviceDetail = serviceDetails[order.serviceType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft size={16} />
          </Button>
          <h2 className="text-2xl font-semibold">Order Details</h2>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {order.status === 'pending' && (
            <>
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto"
                onClick={handleReject}
                disabled={isProcessing}
              >
                <X size={16} className="mr-2" />
                Reject Order
              </Button>
              <Button 
                className="w-full sm:w-auto"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                <Check size={16} className="mr-2" />
                Approve Order
              </Button>
            </>
          )}
          
          {order.status === 'completed' && (
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleReject}
              disabled={isProcessing}
            >
              <X size={16} className="mr-2" />
              Mark as Rejected
            </Button>
          )}
          
          {order.status === 'rejected' && (
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              <Check size={16} className="mr-2" />
              Mark as Completed
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-md ${serviceDetail.bg} ${serviceDetail.color}`}>
                  {serviceDetail.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{order.id}</h3>
                  <p className="text-muted-foreground">{order.instagramHandle}</p>
                </div>
              </div>
              <Badge 
                variant="outline"
                className={`${statusVariants[order.status]} capitalize px-3 py-1.5`}
              >
                {order.status}
              </Badge>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Order Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Service Type</p>
                    <p className="flex items-center gap-1.5">
                      {serviceDetail.icon}
                      <span className="capitalize">{order.serviceType}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p>{order.quantity.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Instagram Handle</p>
                    <p>@{order.instagramHandle}</p>
                  </div>
                  {order.postUrl && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Post URL</p>
                      <a 
                        href={order.postUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate block"
                      >
                        {order.postUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{order.customerEmail}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p>{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
              
              {order.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                    <p className="text-sm p-3 bg-secondary rounded-md">{order.notes}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="h-fit">
          <div className="p-6 space-y-6">
            <h3 className="font-medium">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} />
                <span className="text-sm">Ordered on {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={16} />
                <span className="text-sm">
                  {order.status === 'pending' ? 'Awaiting approval' : 
                   order.status === 'completed' ? 'Completed' : 'Rejected'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign size={16} />
                <span className="text-sm">Payment completed</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Fee</span>
                <span>$0.00</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2 font-medium">
                <span>Total</span>
                <span>${order.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};
