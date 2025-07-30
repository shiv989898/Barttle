
'use server';

/**
 * @fileOverview A flow to generate an image for a user's portfolio item.
 *
 * - generatePortfolioImage - A function that generates an image based on a title and description.
 */

import {ai} from '@/ai/genkit';
import { GeneratePortfolioImageInputSchema, GeneratePortfolioImageOutputSchema, type GeneratePortfolioImageInput, type GeneratePortfolioImageOutput } from '@/lib/types';


export async function generatePortfolioImage(input: GeneratePortfolioImageInput): Promise<GeneratePortfolioImageOutput> {
  return generatePortfolioImageFlow(input);
}


const generatePortfolioImageFlow = ai.defineFlow(
  {
    name: 'generatePortfolioImageFlow',
    inputSchema: GeneratePortfolioImageInputSchema,
    outputSchema: GeneratePortfolioImageOutputSchema,
  },
  async (input) => {
    
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `An image representing a project titled "${input.title}". The project is about: ${input.description}. Style hint: ${input.aiHint}.`,
        config: {
            responseModalities: ['IMAGE'],
        },
    });

    if (!media || !media.url) {
        throw new Error('Image generation failed.');
    }
    
    return { imageUrl: media.url };
  }
);
