import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/40">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Gem className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-4xl">Attire Store Management</CardTitle>
          <CardDescription className="pt-2">
            Your all-in-one solution for managing your traditional attire business.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/login" passHref>
            <Button className="w-full" size="lg">Login</Button>
          </Link>
          <Link href="/register" passHref>
            <Button className="w-full" size="lg" variant="outline">Register</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
