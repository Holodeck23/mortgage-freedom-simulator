"use client";

import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DollarSign, Percent, Wallet, CreditCard, HardHat } from "lucide-react";
import { formatCurrency } from "@/lib/mortgage-calculator";

interface InputDashboardProps {
    principal: number;
    setPrincipal: (value: number) => void;
    interestRate: number;
    setInterestRate: (value: number) => void;
    monthlyIncome: number;
    setMonthlyIncome: (value: number) => void;
    monthlyExpenses: number;
    setMonthlyExpenses: (value: number) => void;
    isFIFO: boolean;
    setIsFIFO: (value: boolean) => void;
}

export function InputDashboard({
    principal,
    setPrincipal,
    interestRate,
    setInterestRate,
    monthlyIncome,
    setMonthlyIncome,
    monthlyExpenses,
    setMonthlyExpenses,
    isFIFO,
    setIsFIFO,
}: InputDashboardProps) {
    return (
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-[#D4AF37]" />
                    Your Financial Snapshot
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Mortgage Balance */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-slate-300 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-[#D4AF37]" />
                            Mortgage Balance
                        </Label>
                        <span className="text-2xl font-bold text-[#D4AF37]">
                            {formatCurrency(principal)}
                        </span>
                    </div>
                    <Slider
                        value={[principal]}
                        onValueChange={(value) => setPrincipal(value[0])}
                        min={100000}
                        max={2000000}
                        step={10000}
                        className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37] [&_.bg-primary]:bg-[#D4AF37]"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>$100K</span>
                        <span>$2M</span>
                    </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-3">
                    <Label className="text-slate-300 flex items-center gap-2">
                        <Percent className="h-4 w-4 text-[#D4AF37]" />
                        Interest Rate
                    </Label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                            step={0.1}
                            min={0}
                            max={15}
                            className="bg-slate-800 border-slate-600 text-slate-200 text-lg font-semibold pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                    </div>
                </div>

                {/* Monthly Income */}
                <div className="space-y-3">
                    <Label className="text-slate-300 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Net Monthly Household Income
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input
                            type="number"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                            step={100}
                            min={0}
                            className="bg-slate-800 border-slate-600 text-slate-200 text-lg font-semibold pl-8"
                        />
                    </div>
                </div>

                {/* Monthly Expenses */}
                <div className="space-y-3">
                    <Label className="text-slate-300 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-red-400" />
                        Monthly Living Expenses
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <Input
                            type="number"
                            value={monthlyExpenses}
                            onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                            step={100}
                            min={0}
                            className="bg-slate-800 border-slate-600 text-slate-200 text-lg font-semibold pl-8"
                        />
                    </div>
                </div>

                {/* FIFO Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center gap-3">
                        <HardHat className="h-5 w-5 text-amber-500" />
                        <div>
                            <Label className="text-slate-200 font-medium cursor-pointer">
                                I am a FIFO Worker
                            </Label>
                            <p className="text-xs text-slate-500 mt-1">
                                Applies 20% income bonus for fly-in fly-out schedules
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={isFIFO}
                        onCheckedChange={setIsFIFO}
                        className="data-[state=checked]:bg-[#D4AF37]"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
