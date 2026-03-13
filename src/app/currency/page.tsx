"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.25 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 151.40 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
];

export default function CurrencyConverter() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [amount, setAmount] = useState('1');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fromCurrency = currencies.find(c => c.code === from)!;
  const toCurrency = currencies.find(c => c.code === to)!;

  const result = (parseFloat(amount) || 0) * (toCurrency.rate / fromCurrency.rate);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const format = (val: number, cur: typeof fromCurrency) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: cur.code, currencyDisplay: 'narrowSymbol' }).format(val);

  return (
    <div className="space-y-6">
      <Card className="card-shadow border-none bg-white">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{fromCurrency.symbol}</span>
              <Input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-xl font-bold py-6 bg-muted/20 border-none focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">From</label>
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="w-full py-6 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center -my-2 z-10">
              <Button variant="outline" size="icon" className="rounded-full shadow-md bg-white border-primary/20 text-primary hover:bg-primary/5" onClick={swap}>
                <ArrowUpDown size={18} />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">To</label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="w-full py-6 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c.code} value={c.code}>{c.code} - {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground border-none">
        <CardContent className="pt-6 text-center space-y-2">
          <p className="text-sm opacity-80 font-medium">
            {amount} {fromCurrency.code} =
          </p>
          <h2 className="text-4xl font-bold">{format(result, toCurrency)}</h2>
          <div className="pt-4 flex items-center justify-center space-x-1 opacity-70 text-[10px] uppercase font-bold tracking-widest">
            <RefreshCw size={10} className="animate-spin-slow" />
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">1 {from} to {to}</p>
          <p className="font-bold text-lg">{(toCurrency.rate / fromCurrency.rate).toFixed(4)}</p>
          <div className="flex items-center text-secondary text-[10px] font-bold">
            <TrendingUp size={12} className="mr-1" /> +0.02%
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">1 {to} to {from}</p>
          <p className="font-bold text-lg">{(fromCurrency.rate / toCurrency.rate).toFixed(4)}</p>
          <div className="flex items-center text-red-500 text-[10px] font-bold">
            <TrendingDown size={12} className="mr-1" /> -0.01%
          </div>
        </div>
      </div>
    </div>
  );
}
