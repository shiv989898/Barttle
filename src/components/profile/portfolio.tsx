
"use client";

import React, { useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioFormDialog } from "./portfolio-form-dialog";
import type { PortfolioItem } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";


const PortfolioCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-20 w-full" />
        </CardContent>
        <CardFooter className="justify-end gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
        </CardFooter>
    </Card>
);

export function Portfolio() {
    const { profile, updateProfile, isLoaded } = useProfile();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

    const handleAddItem = () => {
        setEditingItem(null);
        setIsDialogOpen(true);
    };

    const handleEditItem = (item: PortfolioItem) => {
        setEditingItem(item);
        setIsDialogOpen(true);
    };

    const handleDeleteItem = (itemId: string) => {
        const updatedPortfolio = profile?.portfolio?.filter(p => p.id !== itemId) || [];
        updateProfile({ portfolio: updatedPortfolio });
    };

    if (!isLoaded) {
        return (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PortfolioCardSkeleton />
                <PortfolioCardSkeleton />
             </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile?.portfolio?.map(item => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <CardDescription className="line-clamp-3">{item.description}</CardDescription>
                        </CardContent>
                        <CardFooter className="justify-end gap-2">
                             <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your project from your portfolio.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))}

                <button
                    onClick={handleAddItem}
                    className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                    <PlusCircle className="h-8 w-8" />
                    <span className="font-medium">Add New Project</span>
                </button>
            </div>


            <PortfolioFormDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                item={editingItem}
            />
        </div>
    )
}
