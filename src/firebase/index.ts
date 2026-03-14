'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore'

export function initializeFirebase() {
  let app: FirebaseApp;
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (e) {
      console.warn('Firebase initialization failed. Using fallback.', e);
      app = initializeApp({ apiKey: "invalid", projectId: "invalid" }, "fallback");
    }
  } else {
    app = getApp();
  }

  return getSdks(app);
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
