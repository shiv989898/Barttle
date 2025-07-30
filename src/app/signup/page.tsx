
"use client";

// This page is no longer needed as we are only using Google Sign-In.
// Users are redirected from here if they land on it.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return null;
}
