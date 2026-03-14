'use client';

import { useFirebase } from '../provider';

/**
 * Hook specifically for accessing the authenticated user's state.
 * This version is robust against null Firebase services.
 */
export function useUser() {
  const firebase = useFirebase();

  // Handle cases where the hook might be called outside of provider context or before init
  if (!firebase) {
    return {
      user: null,
      loading: true,
      error: null
    };
  }

  const { user, isUserLoading, userError } = firebase;

  return { 
    user, 
    loading: isUserLoading, 
    error: userError 
  };
}
