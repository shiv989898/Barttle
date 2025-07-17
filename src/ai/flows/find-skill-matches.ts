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

const FindSkillMatchesInputSchema = z.object({
  skillsOffered: z.array(z.string()).describe("A list of skills the current user offers."),
  skillsDesired: z.array(z.string()).describe("A list of skills the current user desires."),
  currentUserName: z.string().describe("The name of the current user to exclude from matches."),
});
export type FindSkillMatchesInput = z.infer<typeof FindSkillMatchesInputSchema>;

const MatchedUserSchema = z.object({
  name: z.string(),
  bio: z.string(),
  skillsOffered: z.array(z.string()),
  skillsDesired: z.array(z.string()),
  avatar: z.string().describe("A data URI of a generated avatar for the user. Expected format: 'data:image/png;base64,<encoded_data>'."),
  aiHint: z.string().describe("A 2-word hint for the AI to generate an avatar. e.g. 'man smiling', 'woman glasses'"),
});

const FindSkillMatchesOutputSchema = z.object({
  matches: z.array(MatchedUserSchema).describe("A list of users who are a good skill-swap match."),
});
export type FindSkillMatchesOutput = z.infer<typeof FindSkillMatchesOutputSchema>;


// Tool to get all users from our "database"
const getAllUsersTool = ai.defineTool(
    {
        name: 'getAllUsers',
        description: 'Get a list of all available users in the system to find matches.',
        outputSchema: z.array(z.custom<UserProfile>()),
    },
    async () => {
        return getUsers();
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
Return up to 3 best matches.`,
    tools: [getAllUsersTool]
  },
  async (input) => {

    const llmResponse = await ai.generate({
      prompt: `Find skill matches for ${input.currentUserName}.
      User offers: ${input.skillsOffered.join(', ')}
      User wants: ${input.skillsDesired.join(', ')}`,
      tools: [getAllUsersTool],
      model: 'googleai/gemini-2.0-flash'
    });
    
    const toolCalls = llmResponse.toolCalls();
    if (!toolCalls || toolCalls.length === 0) {
      return { matches: [] };
    }
    
    // In a real app you might have multiple tool calls, but we only have one.
    const allUsers = await getAllUsersTool();

    // Basic matching logic
    const matches = allUsers
        .filter(user => user.name !== input.currentUserName) // Exclude current user
        .filter(user => {
            const userOffersWhatIWant = user.skillsOffered.some(skill => input.skillsDesired.includes(skill));
            const userWantsWhatIOffer = user.skillsDesired.some(skill => input.skillsOffered.includes(skill));
            return userOffersWhatIWant && userWantsWhatIOffer;
        })
        .slice(0, 3); // Limit to 3 matches

    // Generate avatars for the matched users in parallel
    const matchesWithAvatars = await Promise.all(
        matches.map(async (user) => {
            const { media } = await ai.generate({
                model: 'googleai/gemini-2.0-flash-preview-image-generation',
                prompt: `A profile picture of a person named ${user.name}. ${user.aiHint}.`,
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
