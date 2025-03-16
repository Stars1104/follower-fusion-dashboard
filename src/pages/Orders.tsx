
import { useEffect } from 'react';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { useParams } from 'react-router-dom';
import { OrderDetail } from '@/components/orders/OrderDetail';

const Orders = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  useEffect(() => {
    // Scroll to top when the component mounts or orderId changes
    window.scrollTo(0, 0);
  }, [orderId]);
  
  // Show order details if an orderId is provided, otherwise show the orders table
  return orderId ? <OrderDetail /> : <OrdersTable />;
};

export default Orders;
