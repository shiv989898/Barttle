
'use server';

/**
 * @fileOverview A flow to find potential skill swap matches for a user.
 *
 * - findSkillMatches - Finds users with complementary skills.
 * - FindSkillMatchesInput - Input for the findSkillMatches flow.
 * - FindSkillMatchesOutput - Output for the findSkillMatches flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getUsers, type UserProfile} from '@/lib/users';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const FindSkillMatchesInputSchema = z.object({
  skillsOffered: z.array(z.string()).describe("A list of skills the current user offers."),
  skillsDesired: z.array(z.string()).describe("A list of skills the current user desires."),
  currentUserName: z.string().describe("The name of the current user to exclude from matches."),
});
export type FindSkillMatchesInput = z.infer<typeof FindSkillMatchesInputSchema>;

const MatchedUserSchema = z.object({
  uid: z.string(),
  name: z.string(),
  bio: z.string(),
  skillsOffered: z.array(z.string()),
  skillsDesired: z.array(z.string()),
  profilePicture: z.string().optional(),
  avatar: z.string().describe("A data URI of a generated avatar for the user. Expected format: 'data:image/png;base64,<encoded_data>'."),
  aiHint: z.string().describe("A 2-word hint for the AI to generate an avatar. e.g. 'man smiling', 'woman glasses'"),
});

const FindSkillMatchesOutputSchema = z.object({
  matches: z.array(MatchedUserSchema).describe("A list of users who are a good skill-swap match."),
});
export type FindSkillMatchesOutput = z.infer<typeof FindSkillMatchesOutputSchema>;


const getAllUsersTool = ai.defineTool(
    {
        name: 'getAllUsers',
        description: 'Get a list of all available users in the system to find matches.',
        outputSchema: z.array(z.custom<UserProfile & {uid: string}>()),
    },
    async () => {
        // Now fetching from Firestore
        const profilesSnapshot = await getDocs(collection(db, "profiles"));
        const users: (UserProfile & {uid: string})[] = [];
        profilesSnapshot.forEach(doc => {
            const data = doc.data();
            users.push({
                uid: doc.id,
                name: data.name || 'Anonymous',
                bio: data.shortBio || '',
                skillsOffered: data.skillsOffered || [],
                skillsDesired: data.skillsDesired || [],
                profilePicture: data.profilePicture || '',
                // aiHint is not in Firestore, so we provide a default
                aiHint: "person smiling",
            });
        });
        return users;
    }
);

// We define an exported wrapper function that we can call from our server actions.
export async function findSkillMatches(input: FindSkillMatchesInput): Promise<FindSkillMatchesOutput> {
  return findSkillMatchesFlow(input);
}

const findSkillMatchesFlow = ai.defineFlow(
  {
    name: 'findSkillMatchesFlow',
    inputSchema: FindSkillMatchesInputSchema,
    outputSchema: FindSkillMatchesOutputSchema,
    system: `You are a skill-matching expert for a skill-swapping platform.
Your goal is to find the best potential matches for the current user based on the skills they offer and the skills they desire.
A good match is someone who desires skills the user offers, and offers skills the user desires.
You will be provided with a list of all users. You must filter this list to find the best matches.
Do not include the current user in the matches.
For each match, you MUST generate a unique avatar image based on their name and a simple aiHint.
Do NOT use the same aiHint for multiple users. Be creative. Example aiHints: "man smiling", "woman with glasses", "person with curly hair".
Return up to 6 best matches.`,
    tools: [getAllUsersTool]
  },
  async (input) => {

    const llmResponse = await ai.generate({
      prompt: `Find skill matches for ${input.currentUserName}.
      User offers: ${input.skillsOffered.join(', ')}
      User wants: ${input.skillsDesired.join(', ')}`,
      tools: [getAllUsersTool],
      model: 'googleai/gemini-pro'
    });
    
    // We expect the LLM to call our tool to get the user list
    const toolResponse = await llmResponse.toolRequest()?.runInContext();
    if (!toolResponse) {
       return { matches: [] };
    }

    const { output: allUsers } = toolResponse[0];

    // Basic matching logic
    const matches = allUsers
        .filter((user: any) => user.name !== input.currentUserName) // Exclude current user
        .filter((user: any) => {
            const userOffersWhatIWant = user.skillsOffered.some((skill: string) => input.skillsDesired.includes(skill));
            const userWantsWhatIOffer = user.skillsDesired.some((skill: string) => input.skillsOffered.includes(skill));
            return userOffersWhatIWant && userWantsWhatIOffer;
        })
        .slice(0, 6); // Limit to 6 matches

    // Generate avatars for the matched users in parallel
    const matchesWithAvatars = await Promise.all(
        matches.map(async (user: any) => {
            const { media } = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: `A profile picture of a person named ${user.name}. ${user.aiHint || 'person smiling'}.`,
                config: {
                    responseModalities: ['IMAGE'],
                },
            });

            return {
                ...user,
                avatar: media.url,
            };
        })
    );

    return { matches: matchesWithAvatars };
  }
);
