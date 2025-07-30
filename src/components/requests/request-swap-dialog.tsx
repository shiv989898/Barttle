
"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { useRequests } from "@/hooks/use-requests";
import type { Profile } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface RequestSwapDialogProps {
  currentUser: Profile;
  targetUser: Profile;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function RequestSwapDialog({ currentUser, targetUser, isOpen, setIsOpen }: RequestSwapDialogProps) {
  const [selectedSkillsOffered, setSelectedSkillsOffered] = useState<string[]>([]);
  const [selectedSkillsDesired, setSelectedSkillsDesired] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createRequest } = useRequests();

  const handleSkillToggle = (list: string[], setList: (list: string[]) => void, skill: string) => {
    setList(list.includes(skill) ? list.filter(s => s !== skill) : [...list, skill]);
  };

  const handleSubmit = async () => {
    if (selectedSkillsOffered.length === 0 || selectedSkillsDesired.length === 0) {
      setError("Please select at least one skill to offer and one skill to receive.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    await createRequest(targetUser, selectedSkillsOffered, selectedSkillsDesired, currentUser);
    setIsSubmitting(false);
    setIsOpen(false);
  };
  
  // Reset state when the dialog closes or the target user changes
  useEffect(() => {
    if (!isOpen) {
      setSelectedSkillsOffered([]);
      setSelectedSkillsDesired([]);
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Find the intersection of skills
  const skillsUserCanOffer = currentUser.skillsOffered?.filter(skill => targetUser.skillsDesired?.includes(skill)) || [];
  const skillsUserCanReceive = targetUser.skillsOffered?.filter(skill => currentUser.skillsDesired?.includes(skill)) || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Request a Skill Swap with {targetUser.name}</DialogTitle>
          <DialogDescription>
            Select the skills you want to offer and the skills you're interested in learning.
          </DialogDescription>
        </DialogHeader>

        {error && (
            <Alert variant="destructive" className="my-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
                <h4 className="font-semibold text-primary">You Offer</h4>
                <div className="space-y-2 p-4 rounded-md border h-48 overflow-y-auto">
                    {skillsUserCanOffer.length > 0 ? skillsUserCanOffer.map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                             <Checkbox 
                                id={`offer-${skill}`} 
                                checked={selectedSkillsOffered.includes(skill)}
                                onCheckedChange={() => handleSkillToggle(selectedSkillsOffered, setSelectedSkillsOffered, skill)}
                            />
                            <Label htmlFor={`offer-${skill}`} className="flex-1 cursor-pointer">{skill}</Label>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center pt-4">You don't have any skills that {targetUser.name} is looking for.</p>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="font-semibold text-primary">You Receive</h4>
                 <div className="space-y-2 p-4 rounded-md border h-48 overflow-y-auto">
                    {skillsUserCanReceive.length > 0 ? skillsUserCanReceive.map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                             <Checkbox 
                                id={`receive-${skill}`}
                                checked={selectedSkillsDesired.includes(skill)}
                                onCheckedChange={() => handleSkillToggle(selectedSkillsDesired, setSelectedSkillsDesired, skill)}
                            />
                            <Label htmlFor={`receive-${skill}`} className="flex-1 cursor-pointer">{skill}</Label>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center pt-4">{targetUser.name} doesn't offer any skills you're looking for.</p>
                    )}
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || skillsUserCanOffer.length === 0 || skillsUserCanReceive.length === 0}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
