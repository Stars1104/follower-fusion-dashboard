
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Instagram, 
  Heart, 
  Eye, 
  MessageCircle, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  Check, 
  X, 
  AlertTriangle,
  Loader2,
  Send,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isSendingToSupplier, setIsSendingToSupplier] = useState(false);
  const [supplierResponse, setSupplierResponse] = useState<{success: boolean; message?: string}>(); 
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const serviceDetails = {
    followers: { icon: <Instagram size={20} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    likes: { icon: <Heart size={20} />, color: 'text-red-500', bg: 'bg-red-50' },
    views: { icon: <Eye size={20} />, color: 'text-purple-500', bg: 'bg-purple-50' },
    comments: { icon: <MessageCircle size={20} />, color: 'text-green-500', bg: 'bg-green-50' }
  };
  
  const statusVariants = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
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
    setIsRejectDialogOpen(false);
    
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

  const handleSendToSupplier = async () => {
    if (!order) return;
    
    setIsSendingToSupplier(true);
    
    try {
      const { SupplierService } = await import('@/services/supplier-service');
      
      const supplierOrderData = {
        orderId: order.id,
        serviceType: order.serviceType,
        quantity: order.quantity,
        target: order.serviceType === 'followers' ? order.instagramHandle : order.postUrl || order.instagramHandle,
        customerEmail: order.customerEmail
      };
      
      const result = await SupplierService.sendOrderToSupplier(supplierOrderData);
      
      setSupplierResponse({
        success: result.success,
        message: result.success 
          ? `Order sent to supplier successfully. Reference: ${result.reference}` 
          : result.message || 'Failed to send order to supplier'
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Order sent to supplier successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send order to supplier",
          variant: "destructive",
        });
      }
      
    } catch (error) {
      console.error('Error sending order to supplier:', error);
      setSupplierResponse({
        success: false,
        message: 'An error occurred while sending the order to the supplier'
      });
      toast({
        title: "Error",
        description: "Error sending order to supplier",
        variant: "destructive",
      });
    } finally {
      setIsSendingToSupplier(false);
    }
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
              <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full sm:w-auto"
                    disabled={isProcessing || isSendingToSupplier}
                  >
                    <X size={16} className="mr-2" />
                    Reject Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject this order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The customer will be notified and the order will be marked as rejected.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Reject Order
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button 
                className="w-full sm:w-auto"
                onClick={handleApprove}
                disabled={isProcessing || isSendingToSupplier}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={16} className="mr-2" />
                    Approve Order
                  </>
                )}
              </Button>
            </>
          )}
          
          {order.status === 'completed' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  disabled={isProcessing || isSendingToSupplier}
                >
                  <X size={16} className="mr-2" />
                  Mark as Rejected
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Change order status to rejected?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark this completed order as rejected. The customer will be notified of this change.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {order.status === 'rejected' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  disabled={isProcessing || isSendingToSupplier}
                >
                  <Check size={16} className="mr-2" />
                  Mark as Completed
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Change order status to completed?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark this rejected order as completed. The customer will be notified of this change.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApprove}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {order.status === 'completed' && (
            <Button 
              onClick={handleSendToSupplier}
              disabled={isSendingToSupplier}
              className="w-full sm:w-auto"
            >
              {isSendingToSupplier ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send to Supplier
                </>
              )}
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
            
            {supplierResponse && (
              <div className={`mb-6 p-4 rounded-md ${supplierResponse.success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                <div className="flex items-center gap-2">
                  {supplierResponse.success ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertTriangle size={18} />
                  )}
                  <p>{supplierResponse.message}</p>
                </div>
              </div>
            )}
            
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
