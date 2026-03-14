"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Sparkles, Trash2, Wallet, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { generateSpendingTips, GenerateSpendingTipsOutput } from '@/ai/flows/generate-spending-tips-flow';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

interface Entry {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  categoryId: string;
  createdAt: any;
}

export default function BudgetTracker() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTips, setAiTips] = useState<GenerateSpendingTipsOutput | null>(null);

  // Use 'transactions' collection to match backend.json and security rules
  const entriesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'transactions'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: entries = [], isLoading: entriesLoading } = useCollection<Entry>(entriesQuery);

  const addEntry = (type: 'income' | 'expense') => {
    const numAmount = parseFloat(amount);
    if (!description || isNaN(numAmount) || !firestore || !user) return;
    
    const entryData = {
      userId: user.uid,
      description,
      amount: numAmount,
      type,
      date: new Date().toISOString().split('T')[0],
      categoryId: 'default',
      createdAt: serverTimestamp(),
    };

    const collectionRef = collection(firestore, 'users', user.uid, 'transactions');
    
    addDoc(collectionRef, entryData)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: entryData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });

    setDescription('');
    setAmount('');
  };

  const removeEntry = (id: string) => {
    if (!firestore || !user) return;
    const docRef = doc(firestore, 'users', user.uid, 'transactions', id);
    deleteDoc(docRef)
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete',
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const totals = useMemo(() => {
    return entries.reduce((acc, entry) => {
      if (entry.type === 'income') acc.income += entry.amount;
      else acc.expense += entry.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [entries]);

  const balance = totals.income - totals.expense;

  const handleAiTips = async () => {
    if (!entries || entries.length === 0) return;
    setIsAiLoading(true);
    try {
      const incomeEntries = entries.filter(e => e.type === 'income').map(e => ({ description: e.description, amount: e.amount }));
      const expenseEntries = entries.filter(e => e.type === 'expense').map(e => ({ description: e.description, amount: e.amount }));
      
      const result = await generateSpendingTips({
        incomeEntries,
        expenseEntries
      });
      setAiTips(result);
    } catch (error) {
      console.error("AI Insights failed", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const format = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  if (userLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-muted-foreground text-sm">Verifying account...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
        <CardContent className="pt-10 pb-10 text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Wallet size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Secure Wallet</h3>
            <p className="text-muted-foreground text-sm">Please sign in using the top-right button to track your transactions and unlock AI insights.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-shadow border-none bg-primary text-white overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 opacity-80 mb-1">
            <Wallet size={16} />
            <span className="text-xs uppercase font-bold tracking-widest">Total Balance</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">{format(balance)}</h2>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span>Income: {format(totals.income)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span>Expense: {format(totals.expense)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">New Entry</label>
            <Input 
              placeholder="What was this for?" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted/30 border-none h-12"
            />
          </div>
          <div className="space-y-2">
            <Input 
              type="number" 
              placeholder="Amount (₹)" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-muted/30 border-none h-12 font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => addEntry('income')} variant="outline" className="h-12 text-secondary border-secondary/50 hover:bg-secondary/10">
              <Plus size={18} className="mr-2" /> Income
            </Button>
            <Button onClick={() => addEntry('expense')} variant="outline" className="h-12 text-red-500 border-red-200 hover:bg-red-50">
              <Minus size={18} className="mr-2" /> Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest">Transaction History</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary text-[10px] font-bold h-8"
            disabled={entries.length === 0 || isAiLoading}
            onClick={handleAiTips}
          >
            {isAiLoading ? <Loader2 className="mr-1 animate-spin" size={12} /> : <><Sparkles size={12} className="mr-1" /> Get AI Insights</>}
          </Button>
        </div>

        {aiTips && (
          <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader className="py-3">
              <CardTitle className="text-xs font-bold flex items-center text-primary uppercase tracking-wider">
                <Sparkles size={14} className="mr-2" /> AI Assistant Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p className="font-medium text-foreground leading-relaxed">{aiTips.summary}</p>
              <ul className="space-y-2">
                {aiTips.tips.map((tip, i) => (
                  <li key={i} className="flex items-start space-x-2 text-muted-foreground text-[11px] leading-tight">
                    <div className="mt-1 min-w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <Button size="sm" variant="ghost" className="text-[10px] p-0 h-auto hover:bg-transparent text-muted-foreground" onClick={() => setAiTips(null)}>Dismiss insights</Button>
            </CardContent>
          </Card>
        )}

        {entriesLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-muted-foreground opacity-50" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm italic bg-white/30 rounded-2xl border border-dashed border-muted">
            Your wallet is empty. Start tracking!
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-transparent hover:border-muted transition-all group">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${entry.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-500'}`}>
                    {entry.type === 'income' ? <Plus size={18} /> : <Minus size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{entry.description}</p>
                    <div className="flex items-center text-[10px] text-muted-foreground mt-0.5">
                      <CalendarIcon size={10} className="mr-1" />
                      {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString() : 'Syncing...'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className={`font-bold text-base ${entry.type === 'income' ? 'text-secondary' : 'text-red-500'}`}>
                    {entry.type === 'income' ? '+' : '-'}{format(entry.amount)}
                  </p>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500" onClick={() => removeEntry(entry.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
