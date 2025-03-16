
import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { useAuth } from './AuthGuard';
import { useLocation } from 'react-router-dom';
import { Bell, User, Wallet } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const isMobile = useIsMobile();
  
  // Set sidebar closed by default on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('dashboard')) {
      setPageTitle('Dashboard');
    } else if (path.includes('orders')) {
      setPageTitle('Orders');
    } else if (path.includes('settings')) {
      setPageTitle('Settings');
    } else {
      setPageTitle('Instagram Growth Admin');
    }
  }, [location]);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-20'}`}>
        {/* Header */}
        <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b glassmorphism sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {isSidebarOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
            <h1 className="text-xl font-medium">{pageTitle}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Balance display */}
            <div className="hidden md:flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
              <Wallet size={16} className="text-primary" />
              <span className="text-sm font-medium">$25,000</span>
            </div>
            
            <button className="p-2 rounded-full hover:bg-secondary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User size={16} />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <button 
                  onClick={logout}
                  className="text-xs text-muted-foreground text-left hover:text-primary transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <AnimatePresence mode="wait">
          <motion.main 
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminLayout;
