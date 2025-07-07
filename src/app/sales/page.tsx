
'use client';

import * as React from 'react';
import {
  DollarSign,
  CreditCard,
  Users,
  MoreHorizontal,
  Truck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { DashboardLayout } from '@/components/dashboard-layout';
import { sales as initialSalesData } from '@/lib/sales-data';
import type { Sale, SaleStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const statusColors: Record<SaleStatus, string> = {
  Fulfilled: 'bg-green-100 text-green-800 border-green-200',
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function SalesPage() {
  const [sales, setSales] = React.useState<Sale[]>(initialSalesData);
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const { toast } = useToast();
  
  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsSheetOpen(true);
  };
  
  const handleUpdateStatus = (saleId: string, newStatus: SaleStatus) => {
    setSales(sales.map(s => s.id === saleId ? { ...s, status: newStatus } : s));
    toast({
        title: "Status Updated",
        description: `Order ${saleId} has been marked as ${newStatus}.`
    });
  }

  const salesSummary = React.useMemo(() => {
    const fulfilledSales = sales.filter(s => s.status === 'Fulfilled');
    const totalRevenue = fulfilledSales.reduce((acc, sale) => acc + sale.total, 0);
    const avgSale = fulfilledSales.length > 0 ? totalRevenue / fulfilledSales.length : 0;
    return {
      totalRevenue,
      avgSale,
      totalOrders: sales.length,
    }
  }, [sales]);

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(salesSummary.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">From fulfilled orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{salesSummary.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All-time sales records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(salesSummary.avgSale)}
            </div>
            <p className="text-xs text-muted-foreground">Based on fulfilled orders</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>An overview of the most recent sales.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(sale.date)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(sale.total)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn("text-xs", statusColors[sale.status])} variant="outline">
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(sale)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(sale.id, 'Fulfilled')}>
                          Mark as Fulfilled
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(sale.id, 'Pending')}>
                          Mark as Pending
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw]">
          {selectedSale && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle className="font-headline">Order Details</SheetTitle>
                <SheetDescription>
                  Details for order {selectedSale.id}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">Customer Information</h3>
                    <p className="text-sm text-muted-foreground">{selectedSale.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedSale.customerEmail}</p>
                </div>
                <Separator />
                <div>
                    <h3 className="font-semibold text-lg">Order Summary</h3>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Order Date:</span>
                        <span>{formatDate(selectedSale.date)}</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span>{selectedSale.status}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                        <span >Total:</span>
                        <span>{formatCurrency(selectedSale.total)}</span>
                    </div>
                </div>
                <Separator />
                <div>
                    <h3 className="font-semibold text-lg">Items Purchased</h3>
                    <div className="space-y-2">
                        {selectedSale.items.map(item => (
                            <div key={item.productId} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.productName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {item.quantity} x {formatCurrency(item.price)}
                                    </p>
                                </div>
                                <p className="font-medium">
                                    {formatCurrency(item.quantity * item.price)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
