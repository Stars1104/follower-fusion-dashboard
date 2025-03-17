
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { OrderRowProps } from './types';

export const OrderRow = ({ 
  order, 
  onRowClick, 
  serviceIcons, 
  statusVariants 
}: OrderRowProps) => {
  return (
    <TableRow 
      key={order.id} 
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onRowClick(order.id)}
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
  );
};
