import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Boxes, BarChart, Clock } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="relative -m-4 flex-1 md:-m-8">
        <Image
          src="/Indian_attire1.jpg"
          alt="Indian attire background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative z-10 grid gap-4 p-4 md:grid-cols-2 md:gap-8 md:p-8 lg:grid-cols-4">
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
      </div>
    </DashboardLayout>
  );
}
