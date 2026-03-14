"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Calculator, 
  TrendingUp, 
  ReceiptText, 
  Wallet, 
  Globe 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'EMI', icon: Calculator, href: '/' },
  { label: 'SIP', icon: TrendingUp, href: '/sip' },
  { label: 'GST', icon: ReceiptText, href: '/gst' },
  { label: 'Budget', icon: Wallet, href: '/budget' },
  { label: 'Currency', icon: Globe, href: '/currency' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-lg border-t flex items-center justify-around px-2 pb-safe z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1.5 flex-1 h-full transition-all duration-200 active:scale-95",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              isActive ? "bg-primary/10 scale-110 shadow-sm" : "bg-transparent"
            )}>
              <Icon 
                size={22} 
                className={cn(
                  "transition-all duration-300",
                  isActive ? "stroke-[2.5px]" : "stroke-[2px]"
                )} 
              />
            </div>
            <span className={cn(
              "text-[10px] font-bold tracking-tight uppercase transition-all duration-300",
              isActive ? "opacity-100" : "opacity-70"
            )}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
