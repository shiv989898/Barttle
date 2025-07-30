
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
import { type Profile } from '@/lib/types';
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
});

const FindSkillMatchesOutputSchema = z.object({
  matches: z.array(MatchedUserSchema).describe("A list of users who are a good skill-swap match."),
});
export type FindSkillMatchesOutput = z.infer<typeof FindSkillMatchesOutputSchema>;

type UserProfileWithId = Profile & { uid: string };

const getAllUsersTool = ai.defineTool(
    {
        name: 'getAllUsers',
        description: 'Get a list of all available users in the system to find matches.',
        outputSchema: z.array(z.custom<UserProfileWithId>()),
    },
    async () => {
        const profilesSnapshot = await getDocs(collection(db, "profiles"));
        const users: UserProfileWithId[] = [];
        profilesSnapshot.forEach(doc => {
            const data = doc.data() as Omit<Profile, 'uid'>;
            users.push({
                uid: doc.id,
                ...data
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
A good match is someone who desires skills the user offers, AND offers skills the user desires.
You will be provided with a list of all users via a tool. You must call this tool to get the data.
From the list of all users, filter out the current user.
Then, identify up to 6 of the best matches. A better match is one where there are more overlapping skills between what one user offers and another desires.
Return a list of these matched users.`,
    tools: [getAllUsersTool]
  },
  async (input) => {

    const llmResponse = await ai.generate({
      prompt: `Find skill matches for a user named ${input.currentUserName}.
      This user offers: ${input.skillsOffered.join(', ')}
      This user wants: ${input.skillsDesired.join(', ')}`,
      tools: [getAllUsersTool],
      model: 'googleai/gemini-pro',
      output: {
        schema: FindSkillMatchesOutputSchema
      }
    });

    const toolResponse = await llmResponse.toolRequest()?.runInContext();
    if (!toolResponse) {
       // If the model doesn't call the tool, maybe it can answer directly?
       // Or in this case, it's more likely an issue, so we check the output.
       const output = llmResponse.output;
       if (output?.matches) {
           return output;
       }
       throw new Error("The model did not call the user tool as expected.");
    }

    const { output: allUsers } = toolResponse[0];

    // After getting the users, we need to pass this info BACK to the model to reason over it.
    // The prompt already instructed it on how to match, now we provide the data.
    const finalResponse = await ai.generate({
         prompt: [
            {
                text: `Here is the list of all users. Now, fulfill the original request to find the best matches for ${input.currentUserName}.`,
            },
            {
                data: { allUsers }
            }
        ],
        output: { schema: FindSkillMatchesOutputSchema }
    });

    return finalResponse.output || { matches: [] };
  }
);
