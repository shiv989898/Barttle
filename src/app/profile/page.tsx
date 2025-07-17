
"use client";

import { ProfileForm } from '@/components/profile/profile-form';
import { useAuth } from '@/context/auth-context';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null; // AuthProvider handles redirect
  }

  return (
    <div className="w-full">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Your Profile</h1>
            <p className="text-muted-foreground">This information will be visible to others.</p>
        </header>
        <div className="max-w-4xl">
            <ProfileForm />
        </div>
    </div>
  );
}
