
'use client';
import Link from 'next/link';
import { Package, LogOut, Users, LineChart, ShoppingCart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as React from 'react';
import type { User } from '@/types';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem('attire-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      router.push('/login');
    }
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('attire-user');
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { href: '/inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
    { href: '/sales', label: 'Sales', icon: <ShoppingCart className="h-4 w-4" /> },
    { href: '/analytics', label: 'Analytics', icon: <LineChart className="h-4 w-4" /> },
    { href: '/staff', label: 'Staff', icon: <Users className="h-4 w-4" />, adminOnly: true },
  ];
  
  if (!user) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Package className="h-6 w-6" />
            <span className="sr-only">Attire Store</span>
          </Link>
          {navLinks.map((link) => (
             !link.adminOnly || (link.adminOnly && user?.role === 'admin') ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 transition-colors hover:text-foreground",
                    pathname === link.href ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ) : null
          ))}
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline-block">Welcome, {user.name} ({user.role})</span>
          </div>
           <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
           </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
    </div>
  );
}
