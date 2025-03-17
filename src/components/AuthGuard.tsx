
import { useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@example.com' && (password === 'password' || password === '12345678')) {
          localStorage.setItem('admin_token', 'mock-jwt-token');
          setIsAuthenticated(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800); // Simulate network delay
    });
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
};

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && location.pathname !== '/login') {
      // Redirect to login page if not authenticated
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin-slow w-12 h-12 rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If on login page and authenticated, redirect to dashboard
  if (isAuthenticated && location.pathname === '/login') {
    navigate('/dashboard', { replace: true });
    return null;
  }

  // If not authenticated and not on login page, children will not render (redirected in useEffect)
  // If authenticated or on login page, render children
  return <>{children}</>;
};

export { useAuth };
