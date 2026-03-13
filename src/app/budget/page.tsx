"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Sparkles, Trash2, Wallet } from 'lucide-react';
import { generateSpendingTips, GenerateSpendingTipsOutput } from '@/ai/flows/generate-spending-tips-flow';
import { Progress } from '@/components/ui/progress';

interface Entry {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: Date;
}

export default function BudgetTracker() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTips, setAiTips] = useState<GenerateSpendingTipsOutput | null>(null);

  const addEntry = (type: 'income' | 'expense') => {
    if (!description || !amount) return;
    const newEntry: Entry = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date(),
    };
    setEntries([newEntry, ...entries]);
    setDescription('');
    setAmount('');
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const totals = entries.reduce((acc, entry) => {
    if (entry.type === 'income') acc.income += entry.amount;
    else acc.expense += entry.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const balance = totals.income - totals.expense;

  const handleAiTips = async () => {
    if (entries.length === 0) return;
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
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const format = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-6">
      <Card className="card-shadow border-none bg-primary text-white overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 opacity-80 mb-1">
            <Wallet size={16} />
            <span className="text-xs uppercase font-bold tracking-widest">Available Balance</span>
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
          <Input 
            placeholder="What's it for?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input 
            type="number" 
            placeholder="Amount" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => addEntry('income')} variant="outline" className="text-secondary border-secondary/50 hover:bg-secondary/10">
              <Plus size={16} className="mr-2" /> Income
            </Button>
            <Button onClick={() => addEntry('expense')} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
              <Minus size={16} className="mr-2" /> Expense
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-muted-foreground uppercase text-xs tracking-widest">Recent Activity</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary text-xs font-bold"
            disabled={entries.length === 0 || isAiLoading}
            onClick={handleAiTips}
          >
            {isAiLoading ? 'Analyzing...' : <><Sparkles size={14} className="mr-1" /> Get AI Insights</>}
          </Button>
        </div>

        {aiTips && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="py-3">
              <CardTitle className="text-xs font-bold flex items-center text-primary uppercase">
                <Sparkles size={14} className="mr-2" /> AI Financial Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <p className="font-medium text-foreground">{aiTips.summary}</p>
              <ul className="space-y-2">
                {aiTips.tips.map((tip, i) => (
                  <li key={i} className="flex items-start space-x-2 text-muted-foreground text-xs">
                    <div className="mt-1 min-w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <Button size="sm" variant="ghost" className="text-xs p-0 h-auto" onClick={() => setAiTips(null)}>Dismiss</Button>
            </CardContent>
          </Card>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm italic">
            No entries yet. Start tracking your budget!
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm group">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${entry.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-500'}`}>
                    {entry.type === 'income' ? <Plus size={16} /> : <Minus size={16} />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{entry.description}</p>
                    <p className="text-[10px] text-muted-foreground">{entry.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className={`font-bold ${entry.type === 'income' ? 'text-secondary' : 'text-red-500'}`}>
                    {entry.type === 'income' ? '+' : '-'}{format(entry.amount)}
                  </p>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeEntry(entry.id)}>
                    <Trash2 size={14} className="text-muted-foreground" />
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
