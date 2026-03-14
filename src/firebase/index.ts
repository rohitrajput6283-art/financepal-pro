'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    let firebaseApp;
    try {
      firebaseApp = initializeApp(firebaseConfig);
    } catch (e) {
      console.warn('Firebase initialization failed. Check your config.', e);
      // Fallback app to avoid total crash
      firebaseApp = initializeApp({ apiKey: "invalid", projectId: "invalid" }, "fallback");
    }

    return getSdks(firebaseApp);
  }

  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  let auth: Auth | null = null;
  let firestore: Firestore | null = null;

  try {
    auth = getAuth(firebaseApp);
  } catch (e) {
    console.warn("Auth initialization failed", e);
  }

  try {
    firestore = getFirestore(firebaseApp);
  } catch (e) {
    console.warn("Firestore initialization failed", e);
  }

  return {
    firebaseApp,
    auth,
    firestore
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
