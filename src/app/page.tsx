import { ProfileForm } from '@/components/profile/profile-form';
import { SkillMatches } from '@/components/profile/skill-matches';

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary/50">
      <header className="bg-background sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline text-primary">Barttle</h1>
            <p className="text-muted-foreground">Swap skills with talented people.</p>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 items-start">
          <div className="lg:col-span-2">
            <ProfileForm />
          </div>
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <SkillMatches />
          </div>
        </div>
      </main>
    </div>
  );
}
