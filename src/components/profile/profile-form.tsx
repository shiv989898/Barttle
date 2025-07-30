
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { Loader2, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateBio } from "@/app/actions";
import { SkillInput } from "./skill-input";
import { Skeleton } from "../ui/skeleton";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  shortBio: z.string().max(300, {
    message: "Bio must not be longer than 300 characters.",
  }).optional(),
  skillsOffered: z.array(z.string()).optional(),
  skillsDesired: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { profile, updateProfile, isLoaded } = useProfile();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      shortBio: "",
      skillsOffered: [],
      skillsDesired: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (profile) {
      form.reset(profile);
    }
  }, [profile, form]);

  function onSubmit(data: ProfileFormValues) {
    updateProfile(data);
    toast({
      title: "Profile Saved",
      description: "Your profile has been updated successfully.",
    });
  }

  const generateBio = async () => {
    setIsGenerating(true);
    const formData = form.getValues();
    const result = await handleGenerateBio({
        name: formData.name,
        shortBio: formData.shortBio,
        skillsOffered: formData.skillsOffered || [],
        skillsDesired: formData.skillsDesired || [],
    });
    if (result.success && result.bio) {
        form.setValue("shortBio", result.bio, { shouldValidate: true, shouldDirty: true });
        toast({
            title: "Bio Generated!",
            description: "Your new bio has been created.",
        });
    } else {
        toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
        });
    }
    setIsGenerating(false);
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-6 space-y-8">
            <div className="flex items-center gap-6">
                <Avatar 
                    className="h-24 w-24 border-2"
                >
                  <AvatarFallback className="bg-secondary">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <p className="text-lg font-semibold">Profile Picture</p>
                    <p className="text-sm text-muted-foreground">Your profile picture is automatically synced <br/> from your Google account.</p>
                </div>
              </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Alex Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortBio"
              render={({ field }) => (
                <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Short Bio</FormLabel>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={generateBio}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4 text-yellow-400" />
                            )}
                            Generate with AI
                        </Button>
                    </div>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself and what you're looking for..."
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillsOffered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills You Offer</FormLabel>
                  <FormControl>
                    <SkillInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Add a skill you can teach or trade..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skillsDesired"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills You Want to Learn</FormLabel>
                  <FormControl>
                    <SkillInput
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Add a skill you're interested in..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={!form.formState.isDirty}>
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
