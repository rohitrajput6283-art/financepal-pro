"use client";

import React from 'react';

interface AdBannerProps {
  position?: 'top' | 'bottom';
}

export function AdBanner({ position = 'top' }: AdBannerProps) {
  return (
    <div className={`w-full bg-muted/30 flex items-center justify-center p-2 border-y ${position === 'top' ? 'mb-2' : 'mt-4'}`}>
      <div className="bg-gray-200 w-full max-w-[320px] h-[50px] flex flex-col items-center justify-center rounded border border-dashed border-gray-400">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sponsored</span>
        <span className="text-xs text-gray-500 font-medium italic">FinancePal Pro Ads</span>
      </div>
    </div>
  );
}
