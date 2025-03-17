
// This is a mock service for supplier panel integration
// In a real application, this would connect to your supplier's API

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface SupplierOrderRequest {
  orderId: string;
  serviceType: 'followers' | 'likes' | 'views' | 'comments';
  quantity: number;
  target: string; // Instagram handle or post URL
  customerEmail?: string;
}

export interface SupplierOrderResponse {
  success: boolean;
  reference?: string;
  estimatedCompletionTime?: string;
  message?: string;
  status?: OrderStatus;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SupplierService = {
  // Send order to supplier panel
  sendOrderToSupplier: async (orderData: SupplierOrderRequest): Promise<SupplierOrderResponse> => {
    // In a real implementation, this would be an API call to your supplier
    console.log('Sending order to supplier:', orderData);
    await delay(1500); // Simulate API delay
    
    // Mock success response (95% success rate)
    if (Math.random() > 0.05) {
      return {
        success: true,
        reference: `SUP-${Math.floor(Math.random() * 100000)}`,
        estimatedCompletionTime: new Date(Date.now() + 3600000 * 24).toISOString(), // 24 hours
        status: 'processing'
      };
    } else {
      // Mock failure
      return {
        success: false,
        message: 'Service temporarily unavailable from supplier'
      };
    }
  },
  
  // Check order status from supplier
  checkOrderStatus: async (referenceId: string): Promise<SupplierOrderResponse> => {
    console.log('Checking order status for:', referenceId);
    await delay(800);
    
    // Random status for demo purposes
    const statuses: OrderStatus[] = ['pending', 'processing', 'completed', 'rejected'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      success: true,
      reference: referenceId,
      status: randomStatus,
      message: randomStatus === 'completed' ? 'Order fulfilled successfully' : 
               randomStatus === 'rejected' ? 'Unable to fulfill order' : 
               'Order is being processed'
    };
  },
  
  // Cancel order with supplier
  cancelOrder: async (referenceId: string): Promise<SupplierOrderResponse> => {
    console.log('Cancelling order:', referenceId);
    await delay(1000);
    
    // 80% chance of successful cancellation
    if (Math.random() > 0.2) {
      return {
        success: true,
        message: 'Order cancelled successfully'
      };
    } else {
      return {
        success: false,
        message: 'Order already in processing and cannot be cancelled'
      };
    }
  },
  
  // Configure API connection settings (in a real app, this would save API credentials)
  configureApiSettings: async (apiKey: string, apiEndpoint: string): Promise<boolean> => {
    console.log('Configuring supplier API with:', { apiKey, apiEndpoint });
    await delay(500);
    
    // Simple validation
    if (apiKey.length < 10 || !apiEndpoint.startsWith('https://')) {
      return false;
    }
    
    // In a real implementation, you'd store these securely
    localStorage.setItem('supplier_api_key', apiKey);
    localStorage.setItem('supplier_api_endpoint', apiEndpoint);
    
    return true;
  }
};
