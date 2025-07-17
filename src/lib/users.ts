
// This file mocks a database of users for the skill-swapping platform.
// In a real application, this data would come from a database like Firestore.
// The primary source of truth is now Firestore, this can be used for reference or seeding.
export type UserProfile = {
  name: string;
  aiHint: string;
  bio: string;
  skillsOffered: string[];
  skillsDesired: string[];
  profilePicture?: string;
};

const users: UserProfile[] = [
  {
    name: "Samantha Bee",
    aiHint: "woman smiling",
    bio: "Graphic designer who loves to bake sourdough bread. Looking for a coding tutor.",
    skillsOffered: ["Logo Design", "Illustration", "Baking"],
    skillsDesired: ["Python", "JavaScript", "Next.js"],
  },
  {
    name: "Tom Wang",
    aiHint: "man with glasses",
    bio: "Musician and producer. I can teach you guitar or piano in exchange for photography lessons.",
    skillsOffered: ["Guitar", "Music Production", "Piano"],
    skillsDesired: ["Photography", "Photo Editing", "Figma"],
  },
  {
    name: "Elena Rodriguez",
    aiHint: "woman with long hair",
    bio: "I'm a marketing strategist who wants to learn how to knit!",
    skillsOffered: ["SEO", "Content Strategy", "Social Media"],
    skillsDesired: ["Knitting", "Crochet", "Baking"],
  },
  {
    name: "Ben Carter",
    aiHint: "man with a beard",
    bio: "Software engineer specializing in Python and data science. I'd love to learn how to play the guitar.",
    skillsOffered: ["Python", "Data Analysis", "Machine Learning"],
    skillsDesired: ["Guitar", "Music Production"],
  },
  {
    name: "Aisha Khan",
    aiHint: "woman with a headscarf",
    bio: "I'm a professional photographer and editor. In my free time, I'm trying to launch a blog and need help with SEO.",
    skillsOffered: ["Photography", "Photo Editing", "Lightroom"],
    skillsDesired: ["SEO", "Content Strategy", "React"],
  },
  {
    name: "Carlos Gomez",
    aiHint: "man in a hat",
    bio: "Chef and food blogger. I can teach you how to cook anything! I need some design help for my new project.",
    skillsOffered: ["Cooking", "Baking", "Recipe Development"],
    skillsDesired: ["Logo Design", "Illustration", "Figma"],
  },
  {
    name: "Mei Lin",
    aiHint: "woman with short hair",
    bio: "Figma and UI design expert. I'm looking to pick up some coding skills to bring my designs to life.",
    skillsOffered: ["UI Design", "Figma", "Illustration"],
    skillsDesired: ["TypeScript", "Next.js", "React"],
  },
];

// This function is now deprecated in favor of fetching directly from Firestore.
export function getUsers(): UserProfile[] {
  // In a real app, you'd fetch this from a database.
  return users;
}
