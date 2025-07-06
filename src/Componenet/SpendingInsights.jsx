import React from "react";

export default function SpendingInsights({ transactions, budgets }) {
  const thisMonth = new Date().toLocaleString("default", { month: "short", year: "numeric" });

  const spendingMap = {};
  transactions.forEach((tx) => {
    const txMonth = new Date(tx.date).toLocaleString("default", { month: "short", year: "numeric" });
    if (txMonth === thisMonth) {
      spendingMap[tx.category] = (spendingMap[tx.category] || 0) + tx.amount;
    }
  });

  const insights = budgets
    .filter((b) => b.month === thisMonth)
    .map((b) => {
      const spent = spendingMap[b.category] || 0;
      const diff = b.amount - spent;
      return {
        category: b.category,
        spent,
        budget: b.amount,
        diff,
      };
    });

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Spending Insights - {thisMonth}</h2>
      <ul>
        {insights.map((item) => (
          <li key={item.category}>
            <strong>{item.category}:</strong> You spent ₹{item.spent}, budgeted ₹{item.budget}.{" "}
            {item.diff < 0
              ? `Over budget by ₹${-item.diff}`
              : `Under budget by ₹${item.diff}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
