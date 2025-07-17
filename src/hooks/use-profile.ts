"use client"

import { useState, useEffect, useCallback } from "react"
import type { Profile } from "@/lib/types"

const STORAGE_KEY = "barttle-profile"

// A default profile to give new users a starting point and showcase features.
const defaultProfile: Profile = {
  name: "Alex Doe",
  profilePicture: "",
  shortBio: "Creative developer with a passion for building beautiful and functional web applications. I'm skilled in React and looking to trade my expertise for some help with illustration and UI design.",
  skillsOffered: ["React", "Next.js", "TypeScript"],
  skillsDesired: ["Illustration", "UI Design", "Figma"],
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    // This effect runs once on the client after hydration.
    let storedProfile: Profile | null = null;
    try {
      const item = window.localStorage.getItem(STORAGE_KEY)
      if (item) {
        storedProfile = JSON.parse(item)
      }
    } catch (error) {
      console.error("Failed to parse profile from localStorage", error)
    }
    setProfile(storedProfile || defaultProfile)
  }, [])

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setProfile(prevProfile => {
      // Ensure previous profile is not null before spreading.
      const newProfile = { ...(prevProfile || defaultProfile), ...updates }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile))
      } catch (error) {
        console.error("Failed to save profile to localStorage", error)
      }
      return newProfile
    })
  }, [])
  
  return { profile, updateProfile, isLoaded: profile !== null }
}
