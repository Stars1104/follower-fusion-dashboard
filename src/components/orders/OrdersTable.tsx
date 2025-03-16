
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
import { Instagram, Heart, Eye, MessageCircle, ArrowUpDown, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

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
      const generatedOrders = generateOrders(45); // Generate more orders for pagination
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

  // Generate array of page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    // If fewer pages than max visible, show all
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Always include first page, last page, current page, and pages adjacent to current
    const firstPage = 1;
    const lastPage = totalPages;
    
    // Add current page and adjacent pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(lastPage - 1, currentPage + 1);
    
    // Adjust if at the beginning
    if (currentPage <= 2) {
      endPage = Math.min(lastPage - 1, maxVisiblePages - 1);
    }
    
    // Adjust if at the end
    if (currentPage >= lastPage - 1) {
      startPage = Math.max(2, lastPage - maxVisiblePages + 2);
    }
    
    // First page is always shown
    pages.push(firstPage);
    
    // Add ellipsis if there's a gap after first page
    if (startPage > 2) {
      pages.push(-1); // -1 represents ellipsis
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if there's a gap before last page
    if (endPage < lastPage - 1) {
      pages.push(-2); // -2 represents ellipsis (different key from the first one)
    }
    
    // Last page is always shown if not already included
    if (lastPage !== firstPage) {
      pages.push(lastPage);
    }
    
    return pages;
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
          
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {typeFilter && (
              <Badge variant="outline" className="py-1.5">
                {serviceIcons[typeFilter]}
                <span className="ml-1 capitalize">{typeFilter}</span>
              </Badge>
            )}
            
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Export
            </Button>
            <Button size="sm">New Order</Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('id')}>
                    <span>Order ID</span>
                    {sortField === 'id' && <ArrowUpDown size={14} className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                  </div>
                </TableHead>
                <TableHead>Username</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort('serviceType')}>
                    <span>Service Type</span>
                    {sortField === 'serviceType' && <ArrowUpDown size={14} className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                  </div>
                </TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSort('quantity')}>
                    <span>Quantity</span>
                    {sortField === 'quantity' && <ArrowUpDown size={14} className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                  </div>
                </TableHead>
                <TableHead className="text-right hidden sm:table-cell">
                  <div className="flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSort('price')}>
                    <span>Price</span>
                    {sortField === 'price' && <ArrowUpDown size={14} className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1 cursor-pointer" onClick={() => handleSort('status')}>
                    <span>Status</span>
                    {sortField === 'status' && <ArrowUpDown size={14} className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                  </div>
                </TableHead>
                <TableHead className="text-right hidden sm:table-cell">
                  <div className="flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSort('date')}>
                    <span>Date</span>
                    {sortField === 'date' && <ArrowUpDown size={14} className={`transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                displayedOrders.map((order) => (
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
                    <TableCell className="text-right hidden sm:table-cell">${order.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline"
                        className={`${statusVariants[order.status]} capitalize`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell">{order.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground order-2 sm:order-1">
              Showing {(currentPage - 1) * ordersPerPage + 1} to {Math.min(currentPage * ordersPerPage, allOrders.length)} of {allOrders.length} orders
            </p>
            
            <Pagination className="order-1 sm:order-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((page, i) => (
                  <PaginationItem key={`page-${page}-${i}`}>
                    {page < 0 ? (
                      <span className="px-4">...</span>
                    ) : (
                      <PaginationLink 
                        href="#" 
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
