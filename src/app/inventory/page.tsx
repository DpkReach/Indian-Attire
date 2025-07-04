import { InventoryPage } from '@/components/inventory-page';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function Inventory() {
  return (
    <DashboardLayout>
      <InventoryPage />
    </DashboardLayout>
  );
}
