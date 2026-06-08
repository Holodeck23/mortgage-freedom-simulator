"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatCurrency, CalculationResult, formatYears } from "@/lib/mortgage-calculator";
import { CheckCircle2, Send, User, Mail, Phone, FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface LeadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    results: CalculationResult;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
}

export function LeadModal({ open, onOpenChange, results }: LeadModalProps) {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateAndDownloadPDF = () => {
        setIsGenerating(true);

        // Create new PDF document
        const doc = new jsPDF();
        const primaryColor = [212, 175, 55]; // Gold #D4AF37
        const secondaryColor = [15, 23, 42]; // Slate 900

        // -- HEADER --
        // Logo placeholder
        doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Infinite Wealth", 20, 20);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Mortgage Freedom Strategy", 20, 30);

        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("PREPARED FOR: " + formData.name.toUpperCase(), 140, 28);

        // -- EXECUTIVE SUMMARY --
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Your Personalized Strategy", 20, 60);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const summaryText = `Based on your inputs, the Infinite Wealth Offset Strategy could save you significant time and money compared to a standard bank loan.`;
        doc.text(summaryText, 20, 70, { maxWidth: 170 });

        // -- KEY METRICS --
        let yPos = 90;

        // Box 1: Interest Saved
        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(200, 200, 200);
        doc.roundedRect(20, yPos, 80, 40, 3, 3, 'FD');

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("TOTAL INTEREST SAVED", 30, yPos + 12);

        doc.setFontSize(22);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(formatCurrency(results.interestSaved), 30, yPos + 28);

        // Box 2: Years Saved
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(110, yPos, 80, 40, 3, 3, 'FD');

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text("TIME SAVED", 120, yPos + 12);

        doc.setFontSize(22);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(formatYears(results.yearsSaved), 120, yPos + 28);

        // -- COMPARISON TABLE --
        yPos += 55;

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Scenario Comparison", 20, yPos);

        autoTable(doc, {
            startY: yPos + 10,
            head: [['Metric', "Bank's Standard Plan", 'Infinite Wealth Plan']],
            body: [
                ['Payoff Time', formatYears(results.bankPayoffYears), formatYears(results.freedomPayoffYears)],
                ['Total Interest', formatCurrency(results.bankTotalInterest), formatCurrency(results.freedomTotalInterest)],
                ['Monthly Payment', formatCurrency(results.monthlyPayment), formatCurrency(results.monthlyPayment)],
            ],
            theme: 'grid',
            headStyles: {
                fillColor: [15, 23, 42],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 11,
                cellPadding: 6
            },
            columnStyles: {
                0: { fontStyle: 'bold', minCellWidth: 50 },
                2: { textColor: [180, 140, 20] } // Gold text for our plan
            }
        });

        // -- NEXT STEPS --
        const finalY = (doc as any).lastAutoTable.finalY + 20;

        doc.setFillColor(240, 248, 255);
        doc.rect(20, finalY, 170, 30, 'F');

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text("Next Steps:", 30, finalY + 10);
        doc.setFont("helvetica", "normal");
        doc.text("Tim's team will be in touch shortly to refine this strategy for your specific situation.", 30, finalY + 20);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Generated by Mortgage Freedom Simulator. For illustrative purposes only.", 105, 280, { align: 'center' });

        doc.save(`Infinite_Wealth_Plan_${formData.name.replace(/\s+/g, '_')}.pdf`);
        setIsGenerating(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Console log the data (placeholder for future webhook)
        console.log("=== LEAD CAPTURE ===");
        console.log("Name:", formData.name);
        console.log("Email:", formData.email);
        console.log("Phone:", formData.phone);
        console.log("Interest Saved:", formatCurrency(results.interestSaved));
        console.log("Timestamp:", new Date().toISOString());

        // Simulate API delay then show success
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset form after a delay to avoid visual glitch
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", phone: "" });
            setErrors({});
            setIsGenerating(false);
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="bg-slate-900 border-slate-700 text-slate-200 sm:max-w-md">
                {!isSubmitted ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#D4AF37]">
                                Get Your Custom Plan
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                                Discover how to save <span className="text-[#D4AF37] font-semibold">{formatCurrency(results.interestSaved)}</span> on your mortgage
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Smith"
                                    className="bg-slate-800 border-slate-600 text-slate-200"
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-sm">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="bg-slate-800 border-slate-600 text-slate-200"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-300 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0412 345 678"
                                    className="bg-slate-800 border-slate-600 text-slate-200"
                                />
                                {errors.phone && (
                                    <p className="text-red-400 text-sm">{errors.phone}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#D4AF37] hover:bg-[#C4A030] text-slate-900 font-semibold py-6 text-lg"
                            >
                                <Send className="h-5 w-5 mr-2" />
                                Send My Report
                            </Button>

                            <p className="text-xs text-slate-500 text-center">
                                Your information is secure and will never be shared.
                            </p>
                        </form>
                    </>
                ) : (
                    <div className="py-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="h-10 w-10 text-[#D4AF37]" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-[#D4AF37] mb-4">
                            Report Sent!
                        </DialogTitle>
                        <p className="text-slate-400 mb-6">
                            Tim&apos;s team will contact you shortly to confirm your strategy.
                        </p>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={generateAndDownloadPDF}
                                disabled={isGenerating}
                                className="bg-slate-700 hover:bg-slate-600 text-white"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Generating PDF...
                                    </>
                                ) : (
                                    <>
                                        <FileDown className="h-4 w-4 mr-2" />
                                        Download PDF Report
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleClose}
                                variant="ghost"
                                className="text-slate-400 hover:text-white"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
