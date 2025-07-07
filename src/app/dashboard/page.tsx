
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Boxes, BarChart, Clock } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import Image from 'next/image';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User, TimeEntry } from '@/types';
import { users as initialUsers } from '@/lib/users';

export default function DashboardPage() {
  const { toast } = useToast();
  const [user, setUser] = React.useState<User | null>(null);
  const [isClockedIn, setIsClockedIn] = React.useState(false);

  React.useEffect(() => {
    const storedUserJSON = localStorage.getItem('attire-user');
    if (storedUserJSON) {
      const currentUser = JSON.parse(storedUserJSON);
      setUser(currentUser);

      const timeEntriesJSON = localStorage.getItem('attire-time-entries');
      const timeEntries = timeEntriesJSON ? (JSON.parse(timeEntriesJSON) as TimeEntry[]) : [];
      const openEntry = timeEntries.find(
        (entry) => entry.userId === currentUser.id && !entry.clockOut
      );
      setIsClockedIn(!!openEntry);
    }
  }, []);

  const handleClockIn = () => {
    if (!user) return;

    const timeEntriesJSON = localStorage.getItem('attire-time-entries');
    const timeEntries = timeEntriesJSON ? (JSON.parse(timeEntriesJSON) as TimeEntry[]) : [];

    const newEntry: TimeEntry = {
      id: `time-${new Date().getTime()}`,
      userId: user.id,
      clockIn: new Date().toISOString(),
    };

    localStorage.setItem('attire-time-entries', JSON.stringify([...timeEntries, newEntry]));
    setIsClockedIn(true);
    toast({ title: 'Clocked In', description: 'Your shift has started.' });
  };

  const handleClockOut = () => {
    if (!user) return;

    // 1. Find and update the time entry
    const timeEntriesJSON = localStorage.getItem('attire-time-entries');
    let timeEntries = timeEntriesJSON ? (JSON.parse(timeEntriesJSON) as TimeEntry[]) : [];
    const openEntryIndex = timeEntries.findIndex(
      (entry) => entry.userId === user.id && !entry.clockOut
    );

    if (openEntryIndex === -1) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No open shift found to clock out from.',
      });
      return;
    }

    const openEntry = timeEntries[openEntryIndex];
    const clockInTime = new Date(openEntry.clockIn);
    const clockOutTime = new Date();
    const durationHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

    timeEntries[openEntryIndex] = { ...openEntry, clockOut: clockOutTime.toISOString() };
    localStorage.setItem('attire-time-entries', JSON.stringify(timeEntries));

    // 2. Find and update the user's total hours
    const storedUsersJSON = localStorage.getItem('attire-users');
    let storedUsers = storedUsersJSON ? (JSON.parse(storedUsersJSON) as User[]) : [];

    const usersMap = new Map<string, User>();
    initialUsers.forEach(u => usersMap.set(u.id, u));
    storedUsers.forEach(u => usersMap.set(u.id, u)); // Overwrite with stored data

    const userToUpdate = usersMap.get(user.id);
    if (!userToUpdate) return;

    const newTotalHours = (userToUpdate.totalHours || 0) + durationHours;
    
    // Now, update the list that will be saved to storage
    const storedUserIndex = storedUsers.findIndex(u => u.id === user.id);
    if (storedUserIndex !== -1) {
      storedUsers[storedUserIndex].totalHours = newTotalHours;
    } else {
      // User must be from the initial list, add them to storage
      const initialUserRecord = initialUsers.find(u => u.id === user.id);
      if (initialUserRecord) {
        storedUsers.push({ ...initialUserRecord, totalHours: newTotalHours });
      }
    }
    localStorage.setItem('attire-users', JSON.stringify(storedUsers));
    
    // 3. Update UI
    setIsClockedIn(false);
    toast({
      title: 'Clocked Out',
      description: `Shift ended. You worked ${durationHours.toFixed(2)} hours.`,
    });
  };

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
                <Button onClick={handleClockIn} disabled={isClockedIn}>Clock In</Button>
                <Button variant="outline" onClick={handleClockOut} disabled={!isClockedIn}>Clock Out</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
