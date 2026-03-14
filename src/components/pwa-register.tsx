"use client";

import { useEffect } from 'react';

/**
 * Registers the Service Worker for PWA functionality.
 * This runs only on the client side.
 */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.error('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return null;
}