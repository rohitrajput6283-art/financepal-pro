"use client";

import React from 'react';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { AdBanner } from '@/components/ui/ads';
import { usePathname } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const auth = useAuth();
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

  const handleLogin = () => {
    if (!auth) return;
    signInWithPopup(auth, new GoogleAuthProvider());
  };

  const handleLogout = () => {
    if (!auth) return;
    signOut(auth);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background shadow-2xl relative overflow-hidden">
      {!isLoginPage && (
        <header className="px-6 py-4 bg-white border-b flex items-center justify-between z-10">
          <h1 className="text-xl font-bold font-headline text-primary">{getPageTitle()}</h1>
          <div className="flex items-center space-x-2">
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback><User size={16} /></AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" onClick={handleLogin} className="text-primary">
                  <LogIn size={20} />
                </Button>
              )
            )}
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
