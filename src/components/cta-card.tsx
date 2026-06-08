"use client";

import { formatCurrency } from "@/lib/mortgage-calculator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText } from "lucide-react";

interface CTACardProps {
    interestSaved: number;
    onGetPlan: () => void;
}

export function CTACard({ interestSaved, onGetPlan }: CTACardProps) {
    return (
        <Card className="bg-gradient-to-r from-red-950/40 to-slate-900 border-red-500/30 mt-6">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-500/20 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-200 mb-2">
                                You are on track to waste{" "}
                                <span className="text-red-400">{formatCurrency(interestSaved)}</span>{" "}
                                dollars.
                            </h3>
                            <p className="text-slate-400">
                                Let&apos;s fix this. Get your personalized Infinite Wealth strategy today.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={onGetPlan}
                        size="lg"
                        className="bg-[#D4AF37] hover:bg-[#C4A030] text-slate-900 font-semibold px-8 py-6 text-lg whitespace-nowrap glow-gold transition-all duration-300"
                    >
                        <FileText className="h-5 w-5 mr-2" />
                        Get My Custom Plan PDF
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
