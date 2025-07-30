
import type { Timestamp } from "firebase/firestore";

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
};

export type Profile = {
  uid: string;
  name: string;
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
  requesterProfile: Pick<Profile, 'name'>;
  requestedProfile: Pick<Profile, 'name'>;
  skillsOffered: string[];
  skillsDesired: string[];
  status: SwapRequestStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
