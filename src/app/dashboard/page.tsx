
"use client";

import { SkillMatches } from '@/components/profile/skill-matches';
import { useAuth } from '@/context/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null; // AuthProvider handles redirect
  }

  return (
    <div className="w-full">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Find talented people to swap skills with.</p>
        </header>
        <SkillMatches />
    </div>
  );
}
