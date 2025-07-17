
export type Profile = {
  uid: string;
  name: string;
  profilePicture: string; // Stored as a data URL (base64)
  shortBio: string;
  skillsOffered: string[];
  skillsDesired: string[];
};
