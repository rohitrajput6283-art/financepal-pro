"use client";

import React, { useState } from 'react';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { AdBanner } from '@/components/ui/ads';
import { usePathname } from 'next/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  const getPageTitle = () => {
    switch (pathname) {
      case '/': return 'EMI Calculator';
      case '/sip': return 'SIP Calculator';
      case '/gst': return 'GST Calculator';
      case '/budget': return 'Budget Tracker';
      case '/currency': return 'Currency Converter';
      default: return 'FinancePal Pro';
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background shadow-2xl relative overflow-hidden">
      {!isLoginPage && (
        <header className="px-6 py-4 bg-white border-b flex items-center justify-between z-10">
          <h1 className="text-xl font-bold font-headline text-primary">{getPageTitle()}</h1>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            FP
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto pb-32">
        {!isLoginPage && <AdBanner position="top" />}
        <div className="p-4 space-y-4">
          {children}
        </div>
        {!isLoginPage && <AdBanner position="bottom" />}
      </main>

      {!isLoginPage && <BottomNav />}
    </div>
  );
}
