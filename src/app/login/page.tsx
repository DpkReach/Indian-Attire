
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

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    try {
        const storedUsers = localStorage.getItem('attire-users');
        const users = storedUsers ? (JSON.parse(storedUsers) as User[]) : initialUsers;
    
        const user = users.find((u) => u.email === email && u.password === password);

        if (user) {
          // In a real app, you'd use a more secure session management.
          // For this prototype, localStorage is sufficient.
          localStorage.setItem('attire-user', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
          router.push('/dashboard');
        } else {
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid email or password.',
          });
        }
    } catch (error) {
        console.error("Login error:", error);
        toast({
            variant: 'destructive',
            title: 'An Error Occurred',
            description: 'Could not complete login.',
        });
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
