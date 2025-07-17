'use server';

import { generateUserBio, type GenerateUserBioInput } from '@/ai/flows/generate-user-bio';

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
