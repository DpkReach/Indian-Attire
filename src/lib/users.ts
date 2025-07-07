
import type { User } from '@/types';

// In a real application, this data would come from a database.
// Passwords should be hashed, never stored in plain text.
export const users: User[] = [
  {
    id: 'user-001',
    name: 'Admin User',
    email: 'deepakadimoolam1412@gmail.com',
    password: 'Deepak1412',
    role: 'admin',
  },
  {
    id: 'user-002',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'password123',
    role: 'sales',
  },
  {
    id: 'user-003',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    password: 'password123',
    role: 'sales',
  },
  {
    id: 'user-004',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    password: 'password123',
    role: 'sales',
  },
];
