'use server';

import { generateUserBio, type GenerateUserBioInput } from '@/ai/flows/generate-user-bio';
import { findSkillMatches, type FindSkillMatchesInput } from '@/ai/flows/find-skill-matches';

export async function handleGenerateBio(input: GenerateUserBioInput) {
  try {
    const result = await generateUserBio(input);
    return { success: true, bio: result.bio };
  } catch (error) {
    console.error('Error generating bio:', error);
    // It's better to return a generic error message to the client.
    return { success: false, error: 'An unexpected error occurred while generating the bio. Please try again.' };
  }
}

export async function handleFindMatches(input: FindSkillMatchesInput) {
    try {
        const result = await findSkillMatches(input);
        return { success: true, matches: result.matches };
    } catch (error) {
        console.error('Error finding matches:', error);
        return { success: false, error: 'An unexpected error occurred while finding matches.' };
    }
}
