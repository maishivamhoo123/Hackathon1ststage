import React, { useEffect, useState } from "react";
import "./App.css";
import TransactionForm from "./Componenet/TransactionForm";
import TransactionList from "./Componenet/TransactionList";
import ExpensesChart from "./Componenet/ExpensesChart";
import DashboardCards from "./Componenet/DashboardCards";
import CategoryPieChart from "./Componenet/CategoryPieChart";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingTx, setEditingTx] = useState(null);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = (tx) => {
    setTransactions([tx, ...transactions]);
  };

  const updateTransaction = (updatedTx) => {
    setTransactions(
      transactions.map((tx) => (tx._id === updatedTx._id ? updatedTx : tx))
    );
    setEditingTx(null);
  };

  const deleteTransaction = async (id) => {
    await fetch(`http://localhost:5000/api/transactions/${id}`, {
      method: "DELETE",
    });
    fetchTransactions(); // Reload from server after delete
  };

  return (
    <div className="container">
      <h1>Personal Finance Visualizer</h1>

      {/* Add / Edit Transaction Form */}
      <TransactionForm
        onAdd={addTransaction}
        editingTx={editingTx}
        onUpdate={updateTransaction}
        cancelEdit={() => setEditingTx(null)}
      />

      {/* Summary Dashboard Cards */}
      <DashboardCards transactions={transactions} />

      {/* Category-wise Pie Chart */}
      <CategoryPieChart transactions={transactions} />

      {/* Monthly Expenses Bar Chart */}
      <ExpensesChart transactions={transactions} />

      {/* List of Transactions */}
      <TransactionList
        transactions={transactions}
        onDelete={deleteTransaction}
        onEdit={(tx) => setEditingTx(tx)}
      />
    </div>
  );
}

export default App;
