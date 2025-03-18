
import { OrderStatus, ServiceType } from '@/components/orders/detail/types';

export type { OrderStatus, ServiceType };

export interface Order {
  id: string;
  username: string;
  serviceType: ServiceType;
  quantity: number;
  price: number;
  status: OrderStatus;
  date: string;
}

export interface OrdersTableProps {
  initialOrders?: Order[];
}

export interface OrderRowProps {
  order: Order;
  onRowClick: (orderId: string) => void;
  serviceIcons: Record<ServiceType, JSX.Element>;
  statusVariants: Record<OrderStatus, string>;
}

export interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: OrderStatus | 'all';
  setStatusFilter: (status: OrderStatus | 'all') => void;
  typeFilter: ServiceType | null;
}

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  isMobile: boolean;
}
