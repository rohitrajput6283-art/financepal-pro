'use client';

import { useFirebase } from '../provider';

/**
 * Hook specifically for accessing the authenticated user's state.
 * This version is compatible with components expecting { user, loading }.
 */
export function useUser() {
  const { user, isUserLoading, userError } = useFirebase();

  return { 
    user, 
    loading: isUserLoading, 
    error: userError 
  };
}
