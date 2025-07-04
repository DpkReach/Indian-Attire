import { InventoryPage } from '@/components/inventory-page';
import { products } from '@/lib/data';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function Inventory() {
  return (
    <DashboardLayout>
      <InventoryPage initialProducts={products} />
    </DashboardLayout>
  );
}
