import Image from "next/image";
import { ArrowRightLeft, Heart } from "lucide-react";

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

const mockUsers = [
  {
    name: "Samantha Bee",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "woman smiling",
    bio: "Graphic designer who loves to bake sourdough bread. Looking for a coding tutor.",
    skillsOffered: ["Logo Design", "Illustration", "Baking"],
    skillsDesired: ["Python", "JavaScript"],
  },
  {
    name: "Tom Wang",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "man glasses",
    bio: "Musician and producer. I can teach you guitar or piano in exchange for photography lessons.",
    skillsOffered: ["Guitar", "Music Production", "Piano"],
    skillsDesired: ["Photography", "Photo Editing"],
  },
  {
    name: "Elena Rodriguez",
    avatar: "https://placehold.co/100x100.png",
    aiHint: "woman long hair",
    bio: "I'm a marketing strategist who wants to learn how to knit!",
    skillsOffered: ["SEO", "Content Strategy", "Social Media"],
    skillsDesired: ["Knitting", "Crochet"],
  },
];

export function SkillMatches() {
  return (
    <Card className="shadow-lg border-border/60">
      <CardHeader>
        <CardTitle>Potential Swaps</CardTitle>
        <CardDescription>
          Here are some people you might want to connect with.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockUsers.map((user) => (
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
        ))}
      </CardContent>
    </Card>
  );
}
