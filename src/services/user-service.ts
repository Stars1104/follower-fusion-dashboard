
// This is a mock service for user management
// In a real application, this would connect to your backend API

export type UserRole = 'user' | 'admin' | 'moderator';
export type UserStatus = 'active' | 'blocked' | 'pending';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  lastActive: string;
  ordersCount: number;
  totalSpent: number;
}

// Mock users data
let mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'user',
    status: 'active',
    joinedAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
    lastActive: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    ordersCount: 5,
    totalSpent: 120.50
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'user',
    status: 'active',
    joinedAt: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    lastActive: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    ordersCount: 2,
    totalSpent: 45.99
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    joinedAt: new Date(Date.now() - 86400000 * 60).toISOString(), // 60 days ago
    lastActive: new Date().toISOString(), // now
    ordersCount: 0,
    totalSpent: 0
  },
  {
    id: '4',
    email: 'blocked.user@example.com',
    name: 'Blocked User',
    role: 'user',
    status: 'blocked',
    joinedAt: new Date(Date.now() - 86400000 * 45).toISOString(), // 45 days ago
    lastActive: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    ordersCount: 1,
    totalSpent: 19.99
  },
  {
    id: '5',
    email: 'moderator@example.com',
    name: 'Moderator User',
    role: 'moderator',
    status: 'active',
    joinedAt: new Date(Date.now() - 86400000 * 25).toISOString(), // 25 days ago
    lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    ordersCount: 3,
    totalSpent: 75.25
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const UserService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    await delay(800);
    return [...mockUsers];
  },
  
  // Get user by ID
  getUserById: async (userId: string): Promise<User | null> => {
    await delay(500);
    const user = mockUsers.find(u => u.id === userId);
    return user || null;
  },
  
  // Update user status (block/unblock)
  updateUserStatus: async (userId: string, status: UserStatus): Promise<User | null> => {
    await delay(700);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      status
    };
    
    return mockUsers[userIndex];
  },
  
  // Delete user
  deleteUser: async (userId: string): Promise<boolean> => {
    await delay(1000);
    
    const initialLength = mockUsers.length;
    mockUsers = mockUsers.filter(u => u.id !== userId);
    
    return mockUsers.length < initialLength;
  },
  
  // Search users
  searchUsers: async (query: string): Promise<User[]> => {
    await delay(600);
    
    if (!query) return [...mockUsers];
    
    query = query.toLowerCase();
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
};
