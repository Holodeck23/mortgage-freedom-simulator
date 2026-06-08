/**
 * Mortgage Calculator - The "Infinite Wealth" Methodology
 * 
 * Compares two scenarios:
 * - Scenario A (Bank's Plan): Standard P&I with monthly interest
 * - Scenario B (Freedom Plan): 100% Offset Account with Average Daily Balance
 */

export interface MortgageInputs {
    principal: number;           // Loan balance
    annualRate: number;          // Interest rate (e.g., 6.5 = 6.5%)
    monthlyIncome: number;       // Net household income
    monthlyExpenses: number;     // Living expenses
    isFIFO: boolean;             // FIFO worker bonus (1.2x income)
    loanTermYears?: number;      // Default 30 years
}

export interface YearlyDataPoint {
    year: number;
    bankBalance: number;         // Remaining balance - Bank's Plan
    freedomBalance: number;      // Remaining balance - Freedom Plan
    bankInterestPaid: number;    // Cumulative interest - Bank's Plan
    freedomInterestPaid: number; // Cumulative interest - Freedom Plan
}

export interface CalculationResult {
    timeline: YearlyDataPoint[];
    bankTotalInterest: number;
    freedomTotalInterest: number;
    interestSaved: number;
    bankPayoffYears: number;
    freedomPayoffYears: number;
    yearsSaved: number;
    monthlyPayment: number;      // Standard P&I payment
}

/**
 * Calculate standard P&I monthly payment
 */
function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;

    if (monthlyRate === 0) return principal / numPayments;

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    return payment;
}

/**
 * Scenario A: Bank's Standard P&I Plan
 * Monthly interest calculated on outstanding balance
 */
function simulateBankPlan(
    principal: number,
    annualRate: number,
    monthlyPayment: number,
    maxYears: number
): { balances: number[]; totalInterest: number; payoffYears: number } {
    const monthlyRate = annualRate / 100 / 12;
    let balance = principal;
    let totalInterest = 0;
    const balances: number[] = [principal];
    let payoffMonth = maxYears * 12;

    for (let month = 1; month <= maxYears * 12; month++) {
        if (balance <= 0) {
            balances.push(0);
            continue;
        }

        const interestThisMonth = balance * monthlyRate;
        totalInterest += interestThisMonth;

        const principalPayment = Math.min(monthlyPayment - interestThisMonth, balance);
        balance -= principalPayment;

        if (balance <= 0 && payoffMonth === maxYears * 12) {
            payoffMonth = month;
            balance = 0;
        }

        // Record balance at end of each year
        if (month % 12 === 0) {
            balances.push(Math.max(0, balance));
        }
    }

    return {
        balances,
        totalInterest,
        payoffYears: payoffMonth / 12
    };
}

/**
 * Scenario B: Freedom Plan with 100% Offset Account
 * 
 * The ACCURATE methodology:
 * - Same minimum monthly payment as the bank
 * - Offset account balance grows over time (surplus = income - expenses)
 * - Interest calculated on Average Daily Balance (Principal - Offset)
 * - When offset exceeds principal, loan is effectively paid off
 * 
 * The key benefit is REDUCED INTEREST, not faster principal reduction.
 * The surplus stays in the offset account, not paid to the loan directly.
 */
function simulateFreedomPlan(
    principal: number,
    annualRate: number,
    monthlyPayment: number,
    monthlyIncome: number,
    monthlyExpenses: number,
    maxYears: number
): { balances: number[]; totalInterest: number; payoffYears: number } {
    const monthlyRate = annualRate / 100 / 12;
    let loanBalance = principal;
    let offsetBalance = 0;
    let totalInterest = 0;
    const balances: number[] = [principal];
    let payoffMonth = maxYears * 12;

    // Monthly surplus that accumulates in offset
    // CRITICAL: The mortgage payment must be paid to the bank, so it is an expense.
    // Surplus = Income - Living Expenses - Mortgage Payment
    const monthlySurplus = monthlyIncome - monthlyExpenses - monthlyPayment;

    // If expenses + mortgage payment exceed income, offset strategy won't work
    if (monthlySurplus <= 0) {
        return simulateBankPlan(principal, annualRate, monthlyPayment, maxYears);
    }

    for (let month = 1; month <= maxYears * 12; month++) {
        // Check if loan is effectively paid (offset >= loan balance)
        if (offsetBalance >= loanBalance || loanBalance <= 0) {
            // Loan is paid off when offset covers it
            if (payoffMonth === maxYears * 12) {
                payoffMonth = month - 1; // Paid off previous month
            }
            if (month % 12 === 0) {
                balances.push(0);
            }
            continue;
        }

        // Calculate Average Daily Balance benefit
        // Day 1: Income deposited (full income offsets)
        // Days 1-29: offset = previous_offset + income
        // Day 30: expenses paid out
        // Average offset during month ≈ offsetBalance + (income * 29 + (income - expenses)) / 30
        const avgMonthlyOffset = offsetBalance + ((monthlyIncome * 29) + (monthlyIncome - monthlyExpenses)) / 30;

        // Effective balance for interest calculation
        const effectiveBalance = Math.max(0, loanBalance - avgMonthlyOffset);

        // Calculate interest on the REDUCED effective balance
        const interestThisMonth = effectiveBalance * monthlyRate;
        totalInterest += interestThisMonth;

        // Standard payment - more goes to principal due to lower interest
        const principalPayment = Math.min(monthlyPayment - interestThisMonth, loanBalance);
        loanBalance -= principalPayment;

        // Surplus accumulates in offset account at end of month
        offsetBalance += monthlySurplus;

        // Record NET balance (loan - offset) at end of each year
        if (month % 12 === 0) {
            const netBalance = Math.max(0, loanBalance - offsetBalance);
            balances.push(netBalance);
        }
    }

    return {
        balances,
        totalInterest,
        payoffYears: payoffMonth / 12
    };
}

/**
 * Main calculation function - compares both scenarios
 */
export function calculateMortgageComparison(inputs: MortgageInputs): CalculationResult {
    const {
        principal,
        annualRate,
        monthlyIncome: baseIncome,
        monthlyExpenses,
        isFIFO,
        loanTermYears = 30
    } = inputs;

    // Apply FIFO bonus if applicable
    const monthlyIncome = isFIFO ? baseIncome * 1.2 : baseIncome;

    // Calculate standard monthly payment
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, loanTermYears);

    // Simulate both scenarios
    const bankResult = simulateBankPlan(principal, annualRate, monthlyPayment, loanTermYears);
    const freedomResult = simulateFreedomPlan(
        principal,
        annualRate,
        monthlyPayment,
        monthlyIncome,
        monthlyExpenses,
        loanTermYears
    );

    // Build timeline data for chart
    const timeline: YearlyDataPoint[] = [];
    for (let year = 0; year <= loanTermYears; year++) {
        timeline.push({
            year,
            bankBalance: bankResult.balances[year] || 0,
            freedomBalance: freedomResult.balances[year] || 0,
            bankInterestPaid: 0,
            freedomInterestPaid: 0
        });
    }

    const interestSaved = bankResult.totalInterest - freedomResult.totalInterest;
    const yearsSaved = bankResult.payoffYears - freedomResult.payoffYears;

    return {
        timeline,
        bankTotalInterest: bankResult.totalInterest,
        freedomTotalInterest: freedomResult.totalInterest,
        interestSaved: Math.max(0, interestSaved),
        bankPayoffYears: bankResult.payoffYears,
        freedomPayoffYears: freedomResult.payoffYears,
        yearsSaved: Math.max(0, yearsSaved),
        monthlyPayment
    };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Format years for display
 */
export function formatYears(years: number): string {
    const wholeYears = Math.floor(years);
    const months = Math.round((years - wholeYears) * 12);

    if (months === 0) {
        return `${wholeYears} Years`;
    }
    return `${wholeYears} Years ${months} Months`;
}
