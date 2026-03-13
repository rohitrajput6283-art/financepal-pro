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
    <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-2 pb-safe z-20">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 flex-1 h-full transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-full transition-all duration-200",
              isActive ? "bg-primary/10" : "bg-transparent"
            )}>
              <Icon size={20} className={isActive ? "fill-primary/20" : ""} />
            </div>
            <span className="text-[10px] font-medium tracking-tight uppercase">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
