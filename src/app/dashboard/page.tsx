import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Boxes, BarChart, Clock, LogOut, Package } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Package className="h-6 w-6" />
            <span className="sr-only">Attire Store</span>
          </Link>
          <Link href="/dashboard" className="text-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/inventory" className="text-muted-foreground transition-colors hover:text-foreground">
            Inventory
          </Link>
           <Link href="/sales" className="text-muted-foreground transition-colors hover:text-foreground">
            Sales
          </Link>
          <Link href="/analytics" className="text-muted-foreground transition-colors hover:text-foreground">
            Analytics
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
             {/* Can add search bar here later */}
          </div>
          <Link href="/" passHref>
             <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
             </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
               <Link href="/sales" className="mt-4 inline-block">
                <Button>View Sales</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory</CardTitle>
              <Boxes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120 Items</div>
              <p className="text-xs text-muted-foreground">5 low stock alerts</p>
              <Link href="/inventory" className="mt-4 inline-block">
                <Button>Manage Inventory</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Reports</div>
              <p className="text-xs text-muted-foreground">View performance & trends</p>
               <Link href="/analytics" className="mt-4 inline-block">
                <Button>View Analytics</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Tracking</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">Sales Staff</div>
               <p className="text-xs text-muted-foreground">Manage employee shifts</p>
              <div className="flex gap-2 mt-4">
                <Button>Clock In</Button>
                <Button variant="outline">Clock Out</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
