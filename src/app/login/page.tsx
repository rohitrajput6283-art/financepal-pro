"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, useUser } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { LogIn, UserPlus, Chrome, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back!", description: "Logged in successfully." });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Login failed", 
        description: error.message || "Invalid email or password."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: "Account created!", description: "Welcome to FinancePal Pro." });
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Sign up failed", 
        description: error.message || "Could not create account."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Google login failed", 
        description: error.message || "Popup was closed or blocked."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-muted-foreground text-sm font-medium animate-pulse">Initializing Security...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/20">
      <Link 
        href="/" 
        className="absolute top-6 left-6 text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
      >
        <ArrowLeft size={16} /> Back
      </Link>
      
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto shadow-xl shadow-primary/20 transform rotate-3 hover:rotate-0 transition-transform">F</div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">FinancePal Pro</h1>
            <p className="text-muted-foreground text-sm">Secure wealth management with AI insights</p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 p-1 bg-white shadow-sm border">
            <TabsTrigger value="login" className="font-bold uppercase tracking-wide">Login</TabsTrigger>
            <TabsTrigger value="signup" className="font-bold uppercase tracking-wide">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-white pb-4">
                <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
                <CardDescription>Enter your email and password to access your dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="h-11 bg-muted/30 border-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="h-11 bg-muted/30 border-none"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/20" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <LogIn size={18} className="mr-2" />}
                    Sign In
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white px-3 text-muted-foreground">Or connect with</span></div>
                </div>
                
                <Button variant="outline" className="w-full h-12 font-bold border-2 hover:bg-muted/10" onClick={handleGoogleLogin}>
                  <Chrome size={18} className="mr-2 text-primary" /> Continue with Google
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-white pb-4">
                <CardTitle className="text-xl font-bold text-secondary">Join FinancePal</CardTitle>
                <CardDescription>Start tracking your expenses and investments today.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="h-11 bg-muted/30 border-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Choose Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="h-11 bg-muted/30 border-none"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold uppercase tracking-widest shadow-lg shadow-secondary/20" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <UserPlus size={18} className="mr-2" />}
                    Create My Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
