export default function DashboardCards({ transactions }) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const latest = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const categoryTotals = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Summary</h2>
      <div><strong>Total Expenses:</strong> ₹{total}</div>

      <h4>Category Breakdown</h4>
      <ul>
        {Object.entries(categoryTotals).map(([cat, amt]) => (
          <li key={cat}>{cat}: ₹{amt}</li>
        ))}
      </ul>

      <h4>Most Recent Transactions</h4>
      <ul>
        {latest.map((t) => (
          <li key={t._id}>
            {t.date} - {t.description} - ₹{t.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
