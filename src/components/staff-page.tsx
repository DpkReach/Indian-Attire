
'use client';

import * as React from 'react';
import { users as initialUsers } from '@/lib/users';
import type { User, UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User as UserIcon } from 'lucide-react';

export function StaffPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const loadAndSetUsers = React.useCallback(() => {
    try {
      const storedUsersJSON = localStorage.getItem('attire-users');
      const storedUsers = storedUsersJSON ? (JSON.parse(storedUsersJSON) as User[]) : [];

      // Combine initial users and stored users, with stored users taking precedence.
      const uniqueUsersMap = new Map<string, User>();
      
      // Add initial users first as a base
      initialUsers.forEach(u => uniqueUsersMap.set(u.id, u));
      
      // Update/add users from storage, as they are more current
      storedUsers.forEach(u => uniqueUsersMap.set(u.id, u));
      
      const combinedUsers = Array.from(uniqueUsersMap.values());
      setUsers(combinedUsers);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers(initialUsers); // Fallback to initial users
    }
  }, []);

  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem('attire-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        setCurrentUser(parsedUser);
      } else {
        router.push('/login');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }
    loadAndSetUsers();
  }, [router, loadAndSetUsers]);
  
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const storedUsersJSON = localStorage.getItem('attire-users');
    const storedUsers = storedUsersJSON ? (JSON.parse(storedUsersJSON) as User[]) : [];

    // Only update the dynamic users list in localStorage
    const updatedStoredUsers = storedUsers.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    );

    // If the user being changed wasn't in storedUsers, add them.
    if (!updatedStoredUsers.some(u => u.id === userId)) {
        const userFromInitial = users.find(u => u.id === userId);
        if(userFromInitial) {
            updatedStoredUsers.push({ ...userFromInitial, role: newRole });
        }
    }

    localStorage.setItem('attire-users', JSON.stringify(updatedStoredUsers));
    
    // Refresh the user list in the component state to show the change
    loadAndSetUsers();
    
    toast({
      title: 'Role Updated',
      description: `User role has been successfully changed to ${newRole}.`,
    });
  };

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Management</CardTitle>
        <CardDescription>View and manage staff roles for the application.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[180px]">Total Hours Worked</TableHead>
              <TableHead className="w-[150px]">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{(user.totalHours || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(newRole: UserRole) => handleRoleChange(user.id, newRole)}
                    // Disable role change for the current admin and the hardcoded admin
                    disabled={user.id === currentUser.id || user.email === 'deepakadimoolam1412@gmail.com'}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-primary" /> Admin
                        </div>
                      </SelectItem>
                      <SelectItem value="sales">
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground" /> Sales
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
