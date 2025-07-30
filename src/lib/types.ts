
import type { Timestamp } from "firebase/firestore";

export type Profile = {
  uid: string;
  name: string;
  profilePicture: string; // Stored as a URL from Google
  shortBio: string;
  skillsOffered: string[];
  skillsDesired: string[];
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
