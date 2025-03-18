
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthGuard';
import { useToast } from '@/hooks/use-toast';
import { FaInstagram } from "react-icons/fa";
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (!success) {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Try admin@example.com / password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-6 md:p-8 shadow-lg border">
          <div className="text-center mb-6 md:mb-8">
            <div className="mb-4 inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10">
              <FaInstagram className="h-7 w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <h1 className="text-xl md:text-2xl font-semibold mb-1 text-muted-foreground">LikesIO Admin</h1>
            <p className="text-sm md:text-base text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium  text-muted-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 md:h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium  text-muted-foreground">
                  Password
                </label>
                <a href="#" className="text-xs md:text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 md:h-11"
              />
            </div>

            <Button type="submit" className="w-full h-10 md:h-11 mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
