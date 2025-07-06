import { PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#EC7063"];

export default function CategoryPieChart({ transactions }) {
  const categoryData = transactions.reduce((acc, tx) => {
    const existing = acc.find((c) => c.name === tx.category);
    if (existing) existing.value += tx.amount;
    else acc.push({ name: tx.category, value: tx.amount });
    return acc;
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Category Breakdown</h2>
      <PieChart width={400} height={250}>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {categoryData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
