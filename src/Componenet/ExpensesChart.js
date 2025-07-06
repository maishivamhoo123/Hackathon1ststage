import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function ExpensesChart({ transactions }) {
  const data = transactions.reduce((acc, tx) => {
    const monthYear = new Date(tx.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const existing = acc.find((d) => d.month === monthYear);
    if (existing) {
      existing.total += tx.amount;
    } else {
      acc.push({ month: monthYear, total: tx.amount });
    }

    return acc;
  }, []);

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <h2>Monthly Expenses</h2>
      <BarChart width={400} height={250} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
