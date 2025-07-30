
"use client";

import { ProfileForm } from '@/components/profile/profile-form';
import { Portfolio } from '@/components/profile/portfolio';
import { useAuth } from '@/context/auth-context';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null; // AuthProvider handles redirect
  }

  return (
    <div className="w-full space-y-8">
        <div>
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-primary">Your Profile</h1>
                <p className="text-muted-foreground">This information will be visible to others.</p>
            </header>
            <div className="max-w-4xl">
                <ProfileForm />
            </div>
        </div>

        <Separator />
        
        <div>
            <header className="mb-4">
                <h2 className="text-2xl font-bold">Portfolio</h2>
                <p className="text-muted-foreground">Showcase your best work to attract swaps.</p>
            </header>
             <div className="max-w-6xl">
                <Portfolio />
            </div>
        </div>
    </div>
  );
}
