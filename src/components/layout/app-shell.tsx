"use client";

import React from 'react';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { AdBanner } from '@/components/ui/ads';
import { usePathname } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Menu } from 'lucide-react';
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
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-background shadow-2xl relative overflow-hidden border-x">
      {!isLoginPage && (
        <header className="px-6 py-4 bg-white border-b flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">F</div>
            <h1 className="text-lg font-bold text-foreground truncate max-w-[150px]">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center space-x-2">
            {!loading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/10">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback className="bg-primary/5 text-primary"><User size={18} /></AvatarFallback>
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
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 focus:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" size="sm" onClick={handleLogin} className="text-primary border-primary/20 hover:bg-primary/5 h-9">
                  <LogIn size={16} className="mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              )
            )}
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
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
