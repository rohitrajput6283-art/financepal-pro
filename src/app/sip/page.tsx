"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState([5000]);
  const [rate, setRate] = useState([12]);
  const [tenure, setTenure] = useState([10]);

  const calculations = useMemo(() => {
    const P = monthly[0];
    const i = rate[0] / (12 * 100);
    const n = tenure[0] * 12;

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
        <CardContent className="pt-6 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground font-medium">Monthly Investment</Label>
              <span className="text-secondary font-bold">{formatCurrency(monthly[0])}</span>
            </div>
            <Slider 
              value={monthly} 
              onValueChange={setMonthly} 
              max={100000} 
              step={500} 
              className="py-4 text-secondary"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground font-medium">Expected Return Rate (p.a.)</Label>
              <span className="text-secondary font-bold">{rate[0]}%</span>
            </div>
            <Slider 
              value={rate} 
              onValueChange={setRate} 
              max={30} 
              step={0.5} 
              className="py-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground font-medium">Time Period (Years)</Label>
              <span className="text-secondary font-bold">{tenure[0]} yrs</span>
            </div>
            <Slider 
              value={tenure} 
              onValueChange={setTenure} 
              max={40} 
              step={1} 
              className="py-4"
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
