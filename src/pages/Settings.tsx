
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  User, 
  KeyRound, 
  Bell, 
  Shield, 
  CreditCard, 
  Wallet, 
  Check 
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileValues, setProfileValues] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    username: 'admin_user',
  });
  const [balanceValues, setBalanceValues] = useState({
    currentBalance: 25000,
    minimumBalance: 5000,
    autoRecharge: true,
    autoRechargeAmount: 10000,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    balanceAlerts: true,
    marketingEmails: false,
    systemAlerts: true,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPasswordValues({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    }, 1000);
  };

  const handleNotificationToggle = (key: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Balance Settings Updated",
        description: "Your balance preferences have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <KeyRound size={16} />
            <span className="hidden md:inline">Password</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <Wallet size={16} />
            <span className="hidden md:inline">Balance & Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <p className="text-muted-foreground">
                Update your account profile information and email address.
              </p>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profileValues.name}
                    onChange={e => setProfileValues({...profileValues, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={profileValues.username}
                    onChange={e => setProfileValues({...profileValues, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={profileValues.email}
                    onChange={e => setProfileValues({...profileValues, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-muted-foreground">
                Ensure your account is using a secure password.
              </p>
              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                    value={passwordValues.currentPassword}
                    onChange={e => setPasswordValues({...passwordValues, currentPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                    value={passwordValues.newPassword}
                    onChange={e => setPasswordValues({...passwordValues, newPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={passwordValues.confirmPassword}
                    onChange={e => setPasswordValues({...passwordValues, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Notification Settings</h3>
              <p className="text-muted-foreground">
                Configure how you receive notifications and alerts.
              </p>
              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about order status changes
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.orderUpdates}
                    onCheckedChange={() => handleNotificationToggle('orderUpdates')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Balance Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your balance is low
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.balanceAlerts}
                    onCheckedChange={() => handleNotificationToggle('balanceAlerts')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new features and promotions
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Important system notifications and updates
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={() => handleNotificationToggle('systemAlerts')}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <form onSubmit={handleBalanceSubmit} className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Balance & Billing Settings</h3>
              <p className="text-muted-foreground">
                Manage your balance, recharge settings and payment methods.
              </p>
              <Separator />

              <div className="bg-primary/5 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Balance</h4>
                <p className="text-3xl font-bold text-primary">
                  ${balanceValues.currentBalance.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="min-balance">Minimum Balance Alert</Label>
                  <Input 
                    id="min-balance" 
                    type="number"
                    value={balanceValues.minimumBalance}
                    onChange={e => setBalanceValues({
                      ...balanceValues, 
                      minimumBalance: parseInt(e.target.value)
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll be notified when balance falls below this amount
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-recharge">Auto Recharge</Label>
                    <Switch 
                      id="auto-recharge"
                      checked={balanceValues.autoRecharge}
                      onCheckedChange={(checked) => setBalanceValues({
                        ...balanceValues,
                        autoRecharge: checked
                      })}
                    />
                  </div>
                  <Input 
                    id="recharge-amount" 
                    type="number"
                    value={balanceValues.autoRechargeAmount}
                    onChange={e => setBalanceValues({
                      ...balanceValues, 
                      autoRechargeAmount: parseInt(e.target.value)
                    })}
                    disabled={!balanceValues.autoRecharge}
                  />
                  <p className="text-xs text-muted-foreground">
                    Amount to add when balance falls below minimum
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Payment Methods</h4>
                <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-10 w-10 p-2 bg-primary/10 text-primary rounded-md" />
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-green-500" />
                    <span className="text-sm font-medium">Default</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full md:w-auto">
                  Add Payment Method
                </Button>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
