
import { motion } from "framer-motion";
import { X, Bell, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "New order received",
    message: "You have received a new order #ORD-1234 from @user_432",
    time: "Just now",
    read: false,
    link: "/orders/ORD-1234"
  },
  {
    id: 2,
    type: "system",
    title: "System update",
    message: "The system will undergo maintenance tonight at 2 AM UTC",
    time: "2 hours ago",
    read: false,
    link: ""
  },
  {
    id: 3,
    type: "payment",
    title: "Payment received",
    message: "You received a payment of $500 for order #ORD-5678",
    time: "Yesterday",
    read: true,
    link: "/orders/ORD-5678"
  },
  {
    id: 4,
    type: "order",
    title: "Order completed",
    message: "Order #ORD-9101 has been completed successfully",
    time: "2 days ago",
    read: true,
    link: "/orders/ORD-9101"
  }
];

type NotificationPanelProps = {
  onClose: () => void;
};

export const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "order":
        return <Bell size={16} className="text-blue-500" />;
      case "system":
        return <Bell size={16} className="text-purple-500" />;
      case "payment":
        return <Bell size={16} className="text-green-500" />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="absolute right-4 top-16 w-80 md:w-96 bg-background border rounded-lg shadow-lg z-20"
    >
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium">Notifications</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary transition-colors"
            aria-label="Close notifications"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <Link 
              to={notification.link} 
              key={notification.id}
              className="block"
              onClick={notification.link ? onClose : undefined}
            >
              <div 
                className={`p-4 border-b hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
              >
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Bell size={24} className="mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t">
        <Link 
          to="/notifications" 
          className="flex items-center justify-center text-xs text-muted-foreground hover:text-primary transition-colors"
          onClick={onClose}
        >
          View all notifications
          <ArrowRight size={12} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
};
