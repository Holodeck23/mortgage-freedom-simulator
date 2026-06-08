"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { YearlyDataPoint } from "@/lib/mortgage-calculator";

interface ComparisonChartProps {
    data: YearlyDataPoint[];
}

const formatCurrencyAxis = (value: number) => {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
};

const formatCurrencyTooltip = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        dataKey: string;
        value: number;
        color: string;
        name: string;
    }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl">
                <p className="text-slate-400 font-medium mb-2">Year {label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-slate-300">{entry.name}:</span>
                        <span
                            className="font-semibold"
                            style={{ color: entry.color }}
                        >
                            {/* Custom Tooltip Logic */}
                            {entry.value === 0 && entry.name === "Freedom Plan"
                                ? "Paid Off (Free) 🎉"
                                : formatCurrencyTooltip(entry.value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function ComparisonChart({ data }: ComparisonChartProps) {
    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="bankGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="freedomGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="year"
                        stroke="#64748b"
                        tick={{ fill: "#64748b" }}
                        axisLine={{ stroke: "#334155" }}
                        tickLine={{ stroke: "#334155" }}
                        label={{
                            value: "Years",
                            position: "insideBottomRight",
                            offset: -5,
                            fill: "#64748b",
                        }}
                    />
                    <YAxis
                        stroke="#64748b"
                        tick={{ fill: "#64748b" }}
                        axisLine={{ stroke: "#334155" }}
                        tickLine={{ stroke: "#334155" }}
                        tickFormatter={formatCurrencyAxis}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-slate-300">{value}</span>
                        )}
                    />
                    <Area
                        type="monotone"
                        dataKey="bankBalance"
                        name="Bank's Plan"
                        stroke="#ef4444"
                        strokeWidth={3}
                        fill="url(#bankGradient)"
                    />
                    <Area
                        type="monotone"
                        dataKey="freedomBalance"
                        name="Freedom Plan"
                        stroke="#D4AF37"
                        strokeWidth={3}
                        fill="url(#freedomGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
