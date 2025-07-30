
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import type { SwapRequest, SwapRequestStatus, Profile } from "@/lib/types";
import { useToast } from "./use-toast";

export function useRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [incomingRequests, setIncomingRequests] = useState<SwapRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      setIncomingRequests([]);
      setOutgoingRequests([]);
      return;
    }

    setIsLoading(true);

    const requestsRef = collection(db, "requests");

    const incomingQuery = query(requestsRef, where("requestedId", "==", user.uid));
    const outgoingQuery = query(requestsRef, where("requesterId", "==", user.uid));

    const unsubIncoming = onSnapshot(incomingQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SwapRequest));
      setIncomingRequests(requests);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching incoming requests:", err);
      setError("Failed to load incoming requests.");
      setIsLoading(false);
    });

    const unsubOutgoing = onSnapshot(outgoingQuery, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SwapRequest));
      setOutgoingRequests(requests);
    }, (err) => {
      console.error("Error fetching outgoing requests:", err);
      setError("Failed to load outgoing requests.");
    });

    return () => {
      unsubIncoming();
      unsubOutgoing();
    };
  }, [user]);

  const createRequest = useCallback(async (
    targetUser: Profile,
    skillsOffered: string[],
    skillsDesired: string[],
    currentUserProfile: Profile
  ) => {
    if (!user || !currentUserProfile) {
      toast({ title: "You must be logged in to send a request.", variant: "destructive" });
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        requesterId: user.uid,
        requestedId: targetUser.uid,
        requesterProfile: {
          name: currentUserProfile.name,
        },
        requestedProfile: {
          name: targetUser.name,
        },
        skillsOffered,
        skillsDesired,
        status: "pending",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      toast({ title: "Swap Request Sent!", description: `Your request to ${targetUser.name} has been sent.` });
    } catch (err) {
      console.error("Error creating swap request:", err);
      toast({ title: "Error Sending Request", description: "Could not send the swap request. Please try again.", variant: "destructive" });
    }
  }, [user, toast]);

  const updateRequestStatus = useCallback(async (requestId: string, status: SwapRequestStatus) => {
    const requestRef = doc(db, "requests", requestId);
    try {
      await updateDoc(requestRef, {
        status,
        updatedAt: Timestamp.now(),
      });
      toast({ title: "Request Updated", description: `The swap request has been ${status}.` });
    } catch (err) {
      console.error("Error updating request status:", err);
      toast({ title: "Error", description: "Could not update the request. Please try again.", variant: "destructive" });
    }
  }, [toast]);

  return {
    incomingRequests,
    outgoingRequests,
    isLoading,
    error,
    createRequest,
    updateRequestStatus,
  };
}
