
"use client";

import React, { useEffect, useState } from "react";
import { ArrowRightLeft, Heart, Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useProfile } from "@/hooks/use-profile";
import { handleFindMatches } from "@/app/actions";
import type { UserProfile } from "@/lib/users";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";


type MatchedUser = UserProfile & { avatar: string };

const MatchCardSkeleton = () => (
    <div className="flex flex-col space-y-4 p-4 rounded-lg border bg-secondary/30">
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
        </div>
        <div className="space-y-3">
            <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <div className="flex gap-1">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                </div>
            </div>
            <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <div className="flex gap-1">
                    <Skeleton className="h-5 w-28 rounded-full" />
                </div>
            </div>
        </div>
        <div className="flex gap-2 pt-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
        </div>
    </div>
);


export function SkillMatches() {
    const { profile } = useProfile();
    const [matches, setMatches] = useState<MatchedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (profile?.skillsOffered && profile?.skillsDesired && profile?.name) {
            const findMatches = async () => {
                setIsLoading(true);
                setError(null);
                const result = await handleFindMatches({
                    skillsOffered: profile.skillsOffered,
                    skillsDesired: profile.skillsDesired,
                    currentUserName: profile.name,
                });

                if (result.success && result.matches) {
                    setMatches(result.matches as MatchedUser[]);
                } else {
                    setError(result.error || "Could not fetch matches.");
                }
                setIsLoading(false);
            };

            findMatches();
        }
    }, [profile]);


  return (
    <Card className="shadow-lg border-border/60">
      <CardHeader>
        <CardTitle>Potential Swaps</CardTitle>
        <CardDescription>
          Here are some people you might want to connect with.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
            <>
                <MatchCardSkeleton />
                <MatchCardSkeleton />
                <MatchCardSkeleton />
            </>
        ) : error ? (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : matches.length > 0 ? (
          matches.map((user) => (
            <div key={user.name} className="flex flex-col space-y-4 p-4 rounded-lg border bg-secondary/30">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.aiHint} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-primary">{user.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
                </div>
              </div>
              <div className="space-y-2">
                  <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Offers</h4>
                      <div className="flex flex-wrap gap-1">
                          {user.skillsOffered.map((skill) => (
                              <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                      </div>
                  </div>
                  <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Wants</h4>
                      <div className="flex flex-wrap gap-1">
                          {user.skillsDesired.map((skill) => (
                              <Badge key={skill} variant="outline">{skill}</Badge>
                          ))}
                      </div>
                  </div>
              </div>
              <div className="flex gap-2 pt-2">
                  <Button className="flex-1">
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      Request Swap
                  </Button>
                  <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Endorse</span>
                  </Button>
              </div>
            </div>
          ))
        ) : (
            <div className="text-center text-muted-foreground p-8">
                <p>No matches found right now.</p>
                <p className="text-sm">Try adding more skills to your profile!</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
