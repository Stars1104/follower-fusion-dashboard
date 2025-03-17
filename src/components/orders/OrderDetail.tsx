
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Import our new components
import { OrderHeader } from './detail/OrderHeader';
import { OrderActions } from './detail/OrderActions';
import { OrderStatusBadge } from './detail/OrderStatusBadge';
import { ServiceIcon } from './detail/ServiceIcon';
import { OrderSupplierResponse } from './detail/OrderSupplierResponse';
import { OrderDetailsSection } from './detail/OrderDetailsSection';
import { OrderSummary } from './detail/OrderSummary';
import { OrderLoading } from './detail/OrderLoading';
import { OrderNotFound } from './detail/OrderNotFound';
import { Order } from './detail/types';

export const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingToSupplier, setIsSendingToSupplier] = useState(false);
  const [supplierResponse, setSupplierResponse] = useState<{success: boolean; message?: string}>();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockOrder: Order = {
        id: orderId || `ORD-${Math.floor(Math.random() * 10000)}`,
        username: `user_${Math.floor(Math.random() * 1000)}`,
        serviceType: ['followers', 'likes', 'views', 'comments'][Math.floor(Math.random() * 4)] as Order['serviceType'],
        quantity: Math.floor(Math.random() * 5000) + 100,
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        status: ['pending', 'completed', 'rejected'][Math.floor(Math.random() * 3)] as Order['status'],
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
    return <OrderLoading />;
  }

  if (!order) {
    return <OrderNotFound />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <OrderHeader title="Order Details" />
        
        <OrderActions 
          status={order.status}
          onApprove={handleApprove}
          onReject={handleReject}
          onSendToSupplier={handleSendToSupplier}
          isProcessing={isProcessing}
          isSendingToSupplier={isSendingToSupplier}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <ServiceIcon serviceType={order.serviceType} />
                <div>
                  <h3 className="text-lg font-medium">{order.id}</h3>
                  <p className="text-muted-foreground">{order.instagramHandle}</p>
                </div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            
            <OrderSupplierResponse supplierResponse={supplierResponse} />
            
            <OrderDetailsSection 
              serviceType={order.serviceType}
              quantity={order.quantity}
              instagramHandle={order.instagramHandle}
              postUrl={order.postUrl}
              notes={order.notes}
              customerEmail={order.customerEmail}
              paymentMethod={order.paymentMethod}
            />
          </div>
        </Card>
        
        <OrderSummary 
          createdAt={order.createdAt}
          status={order.status}
          price={order.price}
        />
      </div>
    </motion.div>
  );
};
