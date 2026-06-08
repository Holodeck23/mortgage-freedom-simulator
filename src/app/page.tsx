"use client";

import { useState, useMemo } from "react";
import { InputDashboard } from "@/components/input-dashboard";
import { ResultsVisualizer } from "@/components/results-visualizer";
import { CTACard } from "@/components/cta-card";
import { LeadModal } from "@/components/lead-modal";
import { calculateMortgageComparison } from "@/lib/mortgage-calculator";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Sparkles } from "lucide-react";

export default function MortgageFreedomSimulator() {
  // Input states with default values
  const [principal, setPrincipal] = useState(500000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [monthlyIncome, setMonthlyIncome] = useState(10000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(5000);
  const [isFIFO, setIsFIFO] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate results whenever inputs change
  const results = useMemo(() => {
    return calculateMortgageComparison({
      principal,
      annualRate: interestRate,
      monthlyIncome,
      monthlyExpenses,
      isFIFO,
    });
  }, [principal, interestRate, monthlyIncome, monthlyExpenses, isFIFO]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
              <Home className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-200">
                Infinite Wealth
              </h1>
              <p className="text-xs text-slate-500">Mortgage Freedom Simulator</p>
            </div>
          </div>
          <Button
            className="bg-[#D4AF37] hover:bg-[#C4A030] text-slate-900 font-semibold px-6"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Tim
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 border-b border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-[#D4AF37]" />
            <span className="text-sm text-[#D4AF37] font-medium">
              Infinite Wealth Offset Strategy
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-100 mb-6 leading-tight">
            How much is the bank{" "}
            <span className="text-red-400">stealing</span> from you?
          </h2>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            See how fast you could be mortgage-free using the{" "}
            <span className="text-[#D4AF37] font-medium">
              Infinite Wealth Offset Strategy
            </span>
            . The difference could save you years and hundreds of thousands of dollars.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Input Dashboard */}
            <div>
              <InputDashboard
                principal={principal}
                setPrincipal={setPrincipal}
                interestRate={interestRate}
                setInterestRate={setInterestRate}
                monthlyIncome={monthlyIncome}
                setMonthlyIncome={setMonthlyIncome}
                monthlyExpenses={monthlyExpenses}
                setMonthlyExpenses={setMonthlyExpenses}
                isFIFO={isFIFO}
                setIsFIFO={setIsFIFO}
              />
            </div>

            {/* Right Column - Results Visualizer */}
            <div>
              <ResultsVisualizer results={results} />
            </div>
          </div>

          {/* CTA Card */}
          <CTACard
            interestSaved={results.interestSaved}
            onGetPlan={() => setIsModalOpen(true)}
          />
        </div>
      </main>

      {/* Lead Modal */}
      <LeadModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        results={results}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Infinite Wealth. The Mortgage Freedom Simulator is for illustrative purposes only.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Consult a licensed financial advisor before making financial decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
