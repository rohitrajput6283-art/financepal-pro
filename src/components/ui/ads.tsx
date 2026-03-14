"use client";

import React, { useEffect } from 'react';

interface AdBannerProps {
  position?: 'top' | 'bottom';
}

export function AdBanner({ position = 'top' }: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Ads might be blocked or still loading
      console.debug('AdMob: Ad could not be initialized yet.');
    }
  }, []);

  return (
    <div className={`w-full flex items-center justify-center overflow-hidden ${position === 'top' ? 'mb-2 border-b' : 'mt-4 border-t'}`}>
      <div className="w-full max-w-[320px] min-h-[50px] bg-muted/10 flex flex-col items-center justify-center">
        <ins className="adsbygoogle"
             style={{ display: 'block', textAlign: 'center' }}
             data-ad-client="ca-pub-7905780957116984"
             data-ad-slot="1206780897"
             data-ad-format="horizontal"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
}
