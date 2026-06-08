"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ComparisonChart } from "./comparison-chart";
import { formatCurrency, formatYears, CalculationResult } from "@/lib/mortgage-calculator";
import { TrendingDown, Clock, Sparkles } from "lucide-react";

interface ResultsVisualizerProps {
    results: CalculationResult;
}

export function ResultsVisualizer({ results }: ResultsVisualizerProps) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Years Saved Card */}
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-[#D4AF37]/30 glow-gold">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                                <Clock className="h-5 w-5 text-[#D4AF37]" />
                            </div>
                            <span className="text-slate-400 text-sm font-medium">Years Saved</span>
                        </div>
                        <div className="text-4xl font-bold text-[#D4AF37] animate-count-up">
                            {results.yearsSaved.toFixed(1)}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Mortgage-free sooner
                        </p>
                    </CardContent>
                </Card>

                {/* Interest Saved Card */}
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-[#D4AF37]/30 glow-gold">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                                <TrendingDown className="h-5 w-5 text-[#D4AF37]" />
                            </div>
                            <span className="text-slate-400 text-sm font-medium">Interest Saved</span>
                        </div>
                        <div className="text-4xl font-bold text-[#D4AF37] animate-count-up">
                            {formatCurrency(results.interestSaved)}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Stays in your pocket
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Info Row */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs text-slate-500 mb-1">Bank&apos;s Payoff</p>
                        <p className="text-lg font-semibold text-red-400">
                            {formatYears(results.bankPayoffYears)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs text-slate-500 mb-1">Freedom Payoff</p>
                        <p className="text-lg font-semibold text-[#D4AF37]">
                            {formatYears(results.freedomPayoffYears)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 text-center">
                        <p className="text-xs text-slate-500 mb-1">Monthly Payment</p>
                        <p className="text-lg font-semibold text-slate-300">
                            {formatCurrency(results.monthlyPayment)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-[#D4AF37]" />
                        <h3 className="text-lg font-semibold text-slate-200">
                            Your Path to Freedom
                        </h3>
                    </div>
                    <ComparisonChart data={results.timeline} />
                </CardContent>
            </Card>
        </div>
    );
}
