"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GSTCalculator() {
  const [amount, setAmount] = useState<string>('10000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);

  const calculate = () => {
    const amt = parseFloat(amount) || 0;
    let gstAmount = 0;
    let netAmount = 0;
    let totalAmount = 0;

    if (isInclusive) {
      totalAmount = amt;
      netAmount = totalAmount / (1 + gstRate / 100);
      gstAmount = totalAmount - netAmount;
    } else {
      netAmount = amt;
      gstAmount = netAmount * (gstRate / 100);
      totalAmount = netAmount + gstAmount;
    }

    return {
      gstAmount,
      netAmount,
      totalAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2
    };
  };

  const results = calculate();
  const format = (val: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-6">
      <Card className="card-shadow border-none">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <Tabs defaultValue="exclusive" onValueChange={(val) => setIsInclusive(val === 'inclusive')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="exclusive">GST Exclusive</TabsTrigger>
                <TabsTrigger value="inclusive">GST Inclusive</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Amount</span>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg font-bold py-6"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[5, 12, 18, 28].map((rate) => (
              <Button 
                key={rate}
                variant={gstRate === rate ? "default" : "outline"}
                onClick={() => setGstRate(rate)}
                className="font-bold py-6"
              >
                {rate}%
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-wider">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{format(results.totalAmount)}</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-2 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground font-medium">Net Amount</span>
            <span className="font-bold">{format(results.netAmount)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground font-medium">GST Amount</span>
            <span className="font-bold text-primary">{format(results.gstAmount)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground font-medium">CGST ({(gstRate/2).toFixed(1)}%)</span>
            <span className="font-medium">{format(results.cgst)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-muted-foreground font-medium">SGST ({(gstRate/2).toFixed(1)}%)</span>
            <span className="font-medium">{format(results.sgst)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
