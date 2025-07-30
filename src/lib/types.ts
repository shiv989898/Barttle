
import type { Timestamp } from "firebase/firestore";
import { z } from "zod";

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  aiHint: string; // To help regenerate or refine the image
};

export type Profile = {
  uid: string;
  name: string;
  profilePicture: string; // Stored as a URL from Google
  shortBio: string;
  skillsOffered: string[];
  skillsDesired: string[];
  portfolio?: PortfolioItem[];
};

export type SwapRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export type SwapRequest = {
  id: string;
  requesterId: string;
  requestedId: string;
  requesterProfile: Pick<Profile, 'name' | 'profilePicture'>;
  requestedProfile: Pick<Profile, 'name' | 'profilePicture'>;
  skillsOffered: string[];
  skillsDesired: string[];
  status: SwapRequestStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};


// Schema for generating a portfolio image
export const GeneratePortfolioImageInputSchema = z.object({
  title: z.string().describe('The title of the portfolio project.'),
  description: z.string().describe('The description of the portfolio project.'),
  aiHint: z.string().describe("A simple 2-word hint for the image generation. e.g. 'abstract painting', 'website mockup'"),
});
export type GeneratePortfolioImageInput = z.infer<typeof GeneratePortfolioImageInputSchema>;

export const GeneratePortfolioImageOutputSchema = z.object({
  imageUrl: z.string().describe("A data URI of the generated image. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GeneratePortfolioImageOutput = z.infer<typeof GeneratePortfolioImageOutputSchema>;
