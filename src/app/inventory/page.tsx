import { InventoryPage } from '@/components/inventory-page';
import { products } from '@/lib/data';

export default function Inventory() {
  return (
    <main>
      <InventoryPage initialProducts={products} />
    </main>
  );
}
