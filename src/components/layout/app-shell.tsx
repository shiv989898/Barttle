
"use client";

import { useAuth } from "@/context/auth-context";
import { SidebarNav } from "./sidebar-nav";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    
    // If loading or no user, we are on a public page (login/signup) or in a loading state.
    // In these cases, we don't want to show the app shell.
    if (loading || !user) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <SidebarNav />
            <div className="flex flex-col flex-1">
                <Header />
                <main className="flex-1 p-4 sm:p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
