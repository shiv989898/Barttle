
"use client"

import { useState, useEffect, useCallback } from "react"
import type { Profile } from "@/lib/types"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

// A default profile to give new users a starting point and showcase features.
const defaultProfile: Omit<Profile, 'uid' | 'name'> = {
  shortBio: "Creative developer with a passion for building beautiful and functional web applications. I'm skilled in React and looking to trade my expertise for some help with illustration and UI design.",
  skillsOffered: ["React", "Next.js", "TypeScript"],
  skillsDesired: ["Illustration", "UI Design", "Figma"],
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setIsLoaded(true);
      return;
    };

    setIsLoaded(false);
    const profileDocRef = doc(db, "profiles", user.uid);
    try {
      const docSnap = await getDoc(profileDocRef);
      if (docSnap.exists()) {
        setProfile({ uid: user.uid, ...docSnap.data() } as Profile);
      } else {
        // If no profile exists, create one with default values
        const newProfile: Profile = {
          uid: user.uid,
          name: user.displayName || 'New User',
          ...defaultProfile,
        };
        await setDoc(profileDocRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Error fetching or creating profile:", error);
      // Handle error appropriately
    } finally {
        setIsLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);


  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    const newProfile = { ...profile, ...updates };
    const profileDocRef = doc(db, "profiles", user.uid);
    try {
      await setDoc(profileDocRef, newProfile, { merge: true });
      setProfile(newProfile);
    } catch (error) {
      console.error("Failed to save profile to Firestore", error)
    }
  }, [user, profile])
  
  return { profile, updateProfile, isLoaded }
}
