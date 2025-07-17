
export type Profile = {
  uid: string;
  name: string;
  profilePicture: string; // Stored as a data URL (base64)
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
  createdAt: number; // as timestamp
  updatedAt: number; // as timestamp
};
