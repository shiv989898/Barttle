
'use server';

/**
 * @fileOverview A flow to generate a user bio using AI based on profile data.
 *
 * - generateUserBio - A function that generates a user bio.
 * - GenerateUserBioInput - The input type for the generateUserBio function.
 * - GenerateUserBioOutput - The return type for the generateUserBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUserBioInputSchema = z.object({
  name: z.string().describe('The user\'s name.'),
  shortBio: z.string().describe('The user\'s existing short bio.').optional(),
  skillsOffered: z.array(z.string()).describe('A list of skills the user offers.'),
  skillsDesired: z.array(z.string()).describe('A list of skills the user desires.'),
});
export type GenerateUserBioInput = z.infer<typeof GenerateUserBioInputSchema>;

const GenerateUserBioOutputSchema = z.object({
  bio: z.string().describe('The generated user bio.'),
});
export type GenerateUserBioOutput = z.infer<typeof GenerateUserBioOutputSchema>;

export async function generateUserBio(input: GenerateUserBioInput): Promise<GenerateUserBioOutput> {
  return generateUserBioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUserBioPrompt',
  input: {schema: GenerateUserBioInputSchema},
  output: {schema: GenerateUserBioOutputSchema},
  prompt: `You are a friendly and helpful AI assistant specializing in writing compelling short bios for user profiles.

  Given the following information about a user, write a short bio that is engaging and highlights their skills and interests. The bio should be no more than 100 words.

  Name: {{{name}}}
  {{#if shortBio}}
  Existing Bio: {{{shortBio}}}
  {{/if}}
  Skills Offered: {{#each skillsOffered}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Skills Desired: {{#each skillsDesired}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  `,
});

const generateUserBioFlow = ai.defineFlow(
  {
    name: 'generateUserBioFlow',
    inputSchema: GenerateUserBioInputSchema,
    outputSchema: GenerateUserBioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
