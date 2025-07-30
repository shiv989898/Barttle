
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";

import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { PortfolioItem } from "@/lib/types";

const portfolioFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;

interface PortfolioFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: PortfolioItem | null;
}

export function PortfolioFormDialog({ isOpen, setIsOpen, item }: PortfolioFormDialogProps) {
    const { profile, updateProfile } = useProfile();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PortfolioFormValues>({
        resolver: zodResolver(portfolioFormSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    useEffect(() => {
        if (item) {
            form.reset({
                title: item.title,
                description: item.description,
            });
        } else {
            form.reset({
                title: "",
                description: "",
            });
        }
    }, [item, form, isOpen]);


    const onSubmit = async (data: PortfolioFormValues) => {
        setIsSubmitting(true);
        try {
            let updatedPortfolio: PortfolioItem[];
            if (item) { // Editing existing item
                updatedPortfolio = profile?.portfolio?.map(p =>
                    p.id === item.id ? { ...item, ...data } : p
                ) || [];
            } else { // Adding new item
                const newItem: PortfolioItem = {
                    id: new Date().toISOString(), // simple unique id
                    ...data,
                };
                updatedPortfolio = [...(profile?.portfolio || []), newItem];
            }

            await updateProfile({ portfolio: updatedPortfolio });
            toast({ title: item ? "Project Updated" : "Project Added", description: "Your portfolio is looking great!" });
            setIsOpen(false);

        } catch (error) {
            console.error("Error submitting portfolio item:", error);
            toast({ title: "An Error Occurred", description: "Something went wrong. Please try again.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            Fill out the details below to showcase your work.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Personal Blog Website" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your project, the technologies used, and your role." {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {isSubmitting ? (item ? "Saving..." : "Creating...") : (item ? "Save Changes" : "Create Project")}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
