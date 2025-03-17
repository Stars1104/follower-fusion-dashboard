
export type OrderStatus = 'pending' | 'completed' | 'rejected';
export type ServiceType = 'followers' | 'likes' | 'views' | 'comments';

export interface Order {
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
