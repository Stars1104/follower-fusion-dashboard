
import { useState, useEffect } from 'react';
import { UserService, User, UserStatus } from '@/services/user-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Ban, 
  CheckCircle, 
  Trash2, 
  Filter, 
  UserCog,
  SortAsc,
  SortDesc,
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [sortField, setSortField] = useState<keyof User>('lastActive');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await UserService.getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...users];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => user.name.toLowerCase().includes(query) || 
                user.email.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' 
          ? fieldA - fieldB 
          : fieldB - fieldA;
      }
      
      return 0;
    });
    
    setFilteredUsers(result);
  }, [users, statusFilter, searchQuery, sortField, sortDirection]);

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsProcessing(true);
    try {
      const success = await UserService.deleteUser(userToDelete.id);
      if (success) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete.id));
        toast.success(`User ${userToDelete.email} deleted successfully`);
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An error occurred while deleting the user');
    } finally {
      setIsProcessing(false);
      setUserToDelete(null);
    }
  };

  // Handle user status update
  const handleUpdateStatus = async (userId: string, newStatus: UserStatus) => {
    setIsProcessing(true);
    try {
      const updatedUser = await UserService.updateUserStatus(userId, newStatus);
      if (updatedUser) {
        setUsers(prevUsers => 
          prevUsers.map(user => user.id === userId ? updatedUser : user)
        );
        toast.success(`User status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('An error occurred while updating the user');
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle sort direction
  const toggleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render status badge
  const renderStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Blocked</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">View and manage user accounts</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Active Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('blocked')}>
                Blocked Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                Pending Users
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Card>
        <CardHeader className="p-4">
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            {filteredUsers.length} users found
            {statusFilter !== 'all' && ` (filtered by ${statusFilter})`}
            {searchQuery && ` matching "${searchQuery}"`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => toggleSort('name')}
                      >
                        Name
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="w-[200px]">
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => toggleSort('email')}
                      >
                        Email
                        {sortField === 'email' && (
                          sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => toggleSort('role')}
                      >
                        Role
                        {sortField === 'role' && (
                          sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => toggleSort('joinedAt')}
                      >
                        Joined
                        {sortField === 'joinedAt' && (
                          sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => toggleSort('lastActive')}
                      >
                        Last Active
                        {sortField === 'lastActive' && (
                          sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => toggleSort('ordersCount')}
                      >
                        Orders
                        {sortField === 'ordersCount' && (
                          sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button 
                        className="flex items-center gap-1"
                        onClick={() => toggleSort('totalSpent')}
                      >
                        Total Spent
                        {sortField === 'totalSpent' && (
                          sortDirection === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{renderStatusBadge(user.status)}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                        <TableCell>{user.ordersCount}</TableCell>
                        <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <UserCog size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(user.id, 'blocked')}
                                  disabled={isProcessing || user.role === 'admin'}
                                >
                                  <Ban size={14} className="mr-2" />
                                  Block User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateStatus(user.id, 'active')}
                                  disabled={isProcessing}
                                >
                                  <CheckCircle size={14} className="mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setUserToDelete(user);
                                    }}
                                    disabled={isProcessing || user.role === 'admin'}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 size={14} className="mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the user account for {user.email}. 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={handleDeleteUser}
                                    >
                                      {isProcessing ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Deleting...
                                        </>
                                      ) : (
                                        <>Delete</>
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
