
"use client";

import React, { useEffect, useState } from "react";
import { ArrowRightLeft, Heart, Loader2, User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { useProfile } from "@/hooks/use-profile";
import { handleFindMatches } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { RequestSwapDialog } from "../requests/request-swap-dialog";
import type { FindSkillMatchesOutput } from "@/ai/flows/find-skill-matches";
import type { Profile } from "@/lib/types";

type MatchedUser = FindSkillMatchesOutput['matches'][0];

const MatchCardSkeleton = () => (
    <div className="flex flex-col space-y-4 p-4 rounded-lg border bg-card">
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
    const { profile: currentUserProfile, isLoaded: isProfileLoaded } = useProfile();
    const [matches, setMatches] = useState<MatchedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTargetUser, setSelectedTargetUser] = useState<Profile | null>(null);


    useEffect(() => {
        const findMatches = async () => {
            if (!currentUserProfile || !currentUserProfile?.skillsOffered?.length || !currentUserProfile?.skillsDesired?.length || !currentUserProfile?.name) {
                setIsLoading(false);
                setMatches([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const result = await handleFindMatches({
                    skillsOffered: currentUserProfile.skillsOffered,
                    skillsDesired: currentUserProfile.skillsDesired,
                    currentUserName: currentUserProfile.name,
                });

                if (result.success && result.matches) {
                    setMatches(result.matches);
                } else {
                    setError(result.error || "Could not fetch matches.");
                }
            } catch(e: any) {
                 setError(e.message || "An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        if(isProfileLoaded){
            findMatches();
        }
    }, [currentUserProfile, isProfileLoaded]);

    const handleRequestSwap = (user: MatchedUser) => {
        const targetUserProfile: Profile = {
            uid: user.uid,
            name: user.name,
            shortBio: user.bio,
            skillsOffered: user.skillsOffered,
            skillsDesired: user.skillsDesired,
        };
        setSelectedTargetUser(targetUserProfile);
        setIsDialogOpen(true);
    };

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Potential Swaps</CardTitle>
                <CardDescription>
                    Here are some people you might want to connect with, powered by AI.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MatchCardSkeleton />
                        <MatchCardSkeleton />
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error Finding Matches</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : matches.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {matches.map((user) => (
                            <div key={user.uid} className="flex flex-col space-y-4 p-4 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-12 w-12 border">
                                        <AvatarFallback>
                                            <UserIcon className="h-6 w-6 text-muted-foreground" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold text-primary">{user.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 flex-grow">
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
                                     <Button className="flex-1" onClick={() => handleRequestSwap(user)}>
                                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                                        Request Swap
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Heart className="h-4 w-4" />
                                        <span className="sr-only">Endorse</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                        <p className="font-semibold">No matches found right now.</p>
                        <p className="text-sm">Try adding more skills to your profile to see potential swaps!</p>
                    </div>
                )}
            </CardContent>
        </Card>
        {currentUserProfile && selectedTargetUser && (
             <RequestSwapDialog
                currentUser={currentUserProfile}
                targetUser={selectedTargetUser}
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
            />
        )}
        </>
    );
}
