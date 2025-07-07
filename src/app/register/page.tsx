
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { users as initialUsers } from '@/lib/users';
import type { User } from '@/types';

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleRegister = (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const storedUsersJSON = localStorage.getItem('attire-users');
            const storedUsers = storedUsersJSON ? (JSON.parse(storedUsersJSON) as User[]) : [];
            
            // For validation, check against a combined list where initial users take precedence
            const initialUserEmails = new Set(initialUsers.map(u => u.email));
            const uniqueStoredUsers = storedUsers.filter(u => !initialUserEmails.has(u.email));
            const allUsersForValidation = [...initialUsers, ...uniqueStoredUsers];

            const existingUser = allUsersForValidation.find((u: User) => u.email === email);
            if (existingUser) {
                toast({
                    variant: 'destructive',
                    title: 'Registration Failed',
                    description: 'A user with this email already exists.',
                });
                return;
            }

            const newUser: User = {
                id: `user-${new Date().getTime()}`,
                name: fullName,
                email: email,
                password: password,
                role: 'sales', // New users default to 'sales' role
            };

            // Add the new user to the list that gets saved back to localStorage
            const updatedUsersToStore = [...storedUsers, newUser];
            localStorage.setItem('attire-users', JSON.stringify(updatedUsersToStore));
            
            // Also log the new user in
            localStorage.setItem('attire-user', JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }));
            
            toast({
                title: 'Registration Successful',
                description: "You're now logged in.",
            });
            
            router.push('/dashboard');
        } catch (error) {
            console.error("Registration error:", error);
            toast({
                variant: 'destructive',
                title: 'An Error Occurred',
                description: 'Could not complete registration.',
            });
        }
    };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Register</CardTitle>
          <CardDescription>Create an account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Max Robinson" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
