import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function SalesPage() {
  return (
    <DashboardLayout>
      <Card>
          <CardHeader>
              <CardTitle>Sales</CardTitle>
              <CardDescription>This is where sales information will be displayed.</CardDescription>
          </CardHeader>
          <CardContent>
              <p>Sales page is under construction.</p>
          </CardContent>
      </Card>
    </DashboardLayout>
  );
}
