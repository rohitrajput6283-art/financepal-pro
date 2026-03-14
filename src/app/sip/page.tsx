
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [tenure, setTenure] = useState(10);

  const calculations = useMemo(() => {
    const P = monthly || 0;
    const i = (rate || 0) / (12 * 100);
    const n = (tenure || 0) * 12;

    if (P === 0 || i === 0 || n === 0) {
      return { maturityValue: 0, investedAmount: 0, returns: 0 };
    }

    const maturityValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const investedAmount = P * n;
    const returns = maturityValue - investedAmount;

    return {
      maturityValue,
      investedAmount,
      returns
    };
  }, [monthly, rate, tenure]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <Card className="card-shadow border-none">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground font-medium text-xs uppercase tracking-widest">Monthly Investment (₹)</Label>
            <Input 
              type="number" 
              value={monthly} 
              onChange={(e) => setMonthly(Number(e.target.value))}
              placeholder="Enter monthly amount"
              className="h-12 text-lg font-bold bg-muted/20 border-none focus-visible:ring-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground font-medium text-xs uppercase tracking-widest">Expected Return Rate (% p.a.)</Label>
            <Input 
              type="number" 
              step="0.5"
              value={rate} 
              onChange={(e) => setRate(Number(e.target.value))}
              placeholder="Enter expected rate"
              className="h-12 text-lg font-bold bg-muted/20 border-none focus-visible:ring-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground font-medium text-xs uppercase tracking-widest">Time Period (Years)</Label>
            <Input 
              type="number" 
              value={tenure} 
              onChange={(e) => setTenure(Number(e.target.value))}
              placeholder="Enter years"
              className="h-12 text-lg font-bold bg-muted/20 border-none focus-visible:ring-secondary"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-secondary text-secondary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Estimated Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(calculations.maturityValue)}</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Invested Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-muted-foreground">{formatCurrency(calculations.investedAmount)}</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wealth Gained</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-secondary">{formatCurrency(calculations.returns)}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
