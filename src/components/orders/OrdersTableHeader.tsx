
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';

interface OrdersTableHeaderProps {
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string) => void;
}

export const OrdersTableHeader = ({ 
  sortField, 
  sortDirection, 
  handleSort 
}: OrdersTableHeaderProps) => {
  return (
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
  );
};
