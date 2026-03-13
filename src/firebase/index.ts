'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

export function initializeFirebase(): { app: FirebaseApp | null, firestore: Firestore | null, auth: Auth | null } {
  // Check if we have at least an API key to avoid crashing initialization
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === '') {
    console.warn("Firebase API Key is missing. Please check your .env file.");
    return { app: null, firestore: null, auth: null };
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const auth = getAuth(app);
    return { app, firestore, auth };
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    return { app: null, firestore: null, auth: null };
  }
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
