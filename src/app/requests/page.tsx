
"use client";

import { RequestList } from '@/components/requests/request-list';
import { useAuth } from '@/context/auth-context';

export default function RequestsPage() {
  const { user } = useAuth();

  if (!user) {
    return null; // AuthProvider handles redirect
  }

  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Swap Requests</h1>
        <p className="text-muted-foreground">Manage your incoming and outgoing skill swap proposals.</p>
      </header>
      <RequestList />
    </div>
  );
}
