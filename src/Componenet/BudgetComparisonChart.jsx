import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function BudgetComparisonChart({ transactions, budgets }) {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const spendingMap = {};
  transactions.forEach((tx) => {
    const txDate = new Date(tx.date);
    const txMonth = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, "0")}`;
    if (txMonth === thisMonth) {
      spendingMap[tx.category] = (spendingMap[tx.category] || 0) + tx.amount;
    }
  });

  const chartData = budgets
    .filter((b) => b.month === thisMonth)
    .map((b) => ({
      category: b.category,
      Budget: b.amount,
      Spent: spendingMap[b.category] || 0,
    }));

  console.log("📊 chartData", chartData);

  if (chartData.length === 0) {
    return <p style={{ textAlign: "center" }}>No budget or spending data for this month.</p>;
  }

  return (
    <div style={{ marginTop: "40px", textAlign: "center" }}>
      <h2>Budget vs. Actual - {thisMonth}</h2>
      <BarChart width={500} height={300} data={chartData}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Budget" fill="#8884d8" />
        <Bar dataKey="Spent" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
