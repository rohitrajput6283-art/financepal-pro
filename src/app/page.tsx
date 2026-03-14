"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState<number | string>(500000);
  const [rate, setRate] = useState<number | string>(8.5);
  const [tenure, setTenure] = useState<number | string>(20);

  const calculations = useMemo(() => {
    const P = Number(principal) || 0;
    const r = (Number(rate) || 0) / (12 * 100);
    const n = (Number(tenure) || 0) * 12;

    if (P === 0 || r === 0 || n === 0) {
      return { monthlyEMI: 0, totalInterest: 0, totalPayment: 0 };
    }

    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      monthlyEMI: emi,
      totalInterest,
      totalPayment
    };
  }, [principal, rate, tenure]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-6">
      <Card className="card-shadow border-none">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground font-medium text-xs uppercase tracking-widest">Loan Amount (₹)</Label>
            <Input 
              type="number" 
              value={principal} 
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="Enter amount"
              className="h-12 text-lg font-bold bg-muted/20 border-none focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground font-medium text-xs uppercase tracking-widest">Interest Rate (% p.a.)</Label>
            <Input 
              type="number" 
              step="0.1"
              value={rate} 
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter rate"
              className="h-12 text-lg font-bold bg-muted/20 border-none focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground font-medium text-xs uppercase tracking-widest">Loan Tenure (Years)</Label>
            <Input 
              type="number" 
              value={tenure} 
              onChange={(e) => setTenure(e.target.value)}
              placeholder="Enter years"
              className="h-12 text-lg font-bold bg-muted/20 border-none focus-visible:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Monthly EMI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(calculations.monthlyEMI)}</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Interest</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-secondary">{formatCurrency(calculations.totalInterest)}</div>
            </CardContent>
          </Card>
          <Card className="border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-primary">{formatCurrency(calculations.totalPayment)}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
