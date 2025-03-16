
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Settings, Instagram, Heart, Eye, MessageCircle, TrendingUp, Wallet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, setIsOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <motion.aside
        initial={{ width: isOpen ? 256 : 80, x: 0 }}
        animate={{ 
          width: isOpen ? 256 : 80, 
          x: isMobile && !isOpen ? -80 : 0 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed top-0 left-0 h-full z-20"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center overflow-hidden"
          >
            <Instagram className="text-primary" size={28} />
            <span className="ml-2 font-semibold text-xl">Growth Admin</span>
          </motion.div>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Instagram className="text-primary" size={28} />
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isOpen} />
          <NavItem to="/orders" icon={<Package size={20} />} label="Orders" isOpen={isOpen} />
          
          {/* Service types group - only visible when sidebar is open */}
          {isOpen && (
            <div className="mt-6 mb-4">
              <p className="text-xs uppercase font-medium text-sidebar-foreground/60 mb-2 px-3">Services</p>
              <ServiceNavItem 
                to="/orders?type=followers" 
                icon={<Instagram size={16} />} 
                label="Followers" 
                color="blue"
              />
              <ServiceNavItem 
                to="/orders?type=likes" 
                icon={<Heart size={16} />} 
                label="Likes" 
                color="red"
              />
              <ServiceNavItem 
                to="/orders?type=views" 
                icon={<Eye size={16} />} 
                label="Views" 
                color="purple"
              />
              <ServiceNavItem 
                to="/orders?type=comments" 
                icon={<MessageCircle size={16} />} 
                label="Comments" 
                color="green"
              />
            </div>
          )}

          <NavItem to="/analytics" icon={<TrendingUp size={20} />} label="Analytics" isOpen={isOpen} />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" isOpen={isOpen} />
          
          {/* Balance section for collapsed sidebar */}
          {!isOpen && (
            <div className="mt-6 flex justify-center">
              <div className="p-2 rounded-md bg-primary/10">
                <Wallet size={20} className="text-primary" />
              </div>
            </div>
          )}
          
          {/* Balance section for expanded sidebar */}
          {isOpen && (
            <div className="mt-6 p-4 bg-primary/5 rounded-md border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={16} className="text-primary" />
                <p className="text-sm font-medium">Current Balance</p>
              </div>
              <p className="text-2xl font-bold text-primary">$25,000</p>
              <p className="text-xs text-muted-foreground mt-1">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          )}
        </nav>
      </motion.aside>
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const NavItem = ({ to, icon, label, isOpen }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center p-3 rounded-md mb-1 transition-all
        ${isActive 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
          : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
        }
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isOpen && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          transition={{ duration: 0.2 }}
          className="ml-3 whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
      )}
    </NavLink>
  );
};

interface ServiceNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  color: 'blue' | 'red' | 'green' | 'purple';
}

const ServiceNavItem = ({ to, icon, label, color }: ServiceNavItemProps) => {
  // Define color variants
  const colorVariants = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
  };

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center p-2 rounded-md mb-1 ml-6
        ${isActive 
          ? `${colorVariants[color]} font-medium` 
          : `hover:bg-sidebar-accent/50 text-sidebar-foreground/80`
        }
      `}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="ml-2 text-sm">{label}</span>
    </NavLink>
  );
};
