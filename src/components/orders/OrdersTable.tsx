
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Instagram, Heart, Eye, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Order, OrderStatus, ServiceType } from './types';
import { OrderRow } from './OrderRow';
import { SearchFilterBar } from './SearchFilterBar';
import { TablePagination } from './TablePagination';
import { OrdersTableHeader } from './OrdersTableHeader';
import { generateOrders } from './mockData';
import { OrderLoading } from './detail/OrderLoading';

export const OrdersTable = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<keyof Order>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const ordersPerPage = 10;
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get('type') as ServiceType | null;
  const isMobile = useIsMobile();
  
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
      // Use the mockData generator which returns the correct type
      const generatedOrders = generateOrders(45); 
      setAllOrders(generatedOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Sort and filter orders
  useEffect(() => {
    let filtered = [...allOrders];
    
    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(order => order.serviceType === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term) || 
        order.username.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // For numerical fields
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }
    });
    
    // Calculate total pages
    const total = Math.ceil(filtered.length / ordersPerPage);
    setTotalPages(total > 0 ? total : 1);
    
    // Ensure current page is within bounds after filtering
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
    
    // Apply pagination
    const startIndex = (currentPage - 1) * ordersPerPage;
    const paginatedOrders = filtered.slice(startIndex, startIndex + ordersPerPage);
    
    setDisplayedOrders(paginatedOrders);
  }, [allOrders, typeFilter, statusFilter, searchTerm, currentPage, sortField, sortDirection]);

  const handleRowClick = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const handleSort = (field: keyof Order) => {
    if (field === sortField) {
      // Toggle direction if same field is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending order
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (isLoading) {
    return <OrderLoading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
        />
        
        <div className="overflow-x-auto">
          <Table>
            <OrdersTableHeader 
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableBody>
              {displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="h-32 text-center">
                    No orders found
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order) => (
                  <OrderRow 
                    key={order.id}
                    order={order}
                    onRowClick={handleRowClick}
                    serviceIcons={serviceIcons}
                    statusVariants={statusVariants}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          totalItems={allOrders.length}
          itemsPerPage={ordersPerPage}
          isMobile={isMobile}
        />
      </Card>
    </motion.div>
  );
};
