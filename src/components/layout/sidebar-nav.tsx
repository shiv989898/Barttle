
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightLeft, Bell, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/requests", icon: Bell, label: "Requests" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <ArrowRightLeft className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Barttle</span>
        </Link>
        <TooltipProvider>
            {navItems.map(({ href, icon: Icon, label }) => {
                 const isActive = pathname.startsWith(href);
                 return (
                    <Tooltip key={href}>
                        <TooltipTrigger asChild>
                        <Link
                            href={href}
                            className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                                isActive && "bg-accent text-accent-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="sr-only">{label}</span>
                        </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{label}</TooltipContent>
                    </Tooltip>
                 )
            })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
