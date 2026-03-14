'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * Hook specifically for accessing the authenticated user's state.
 * This version is compatible with components expecting { user, loading }.
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(auth?.currentUser || null);
  const [loading, setLoading] = useState(!auth?.currentUser);

  useEffect(() => {
    // Safety check to prevent "Cannot read properties of null" errors
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
