import React, { useEffect, useState } from "react";
import "./App.css";
import TransactionForm from "./Componenet/TransactionForm";
import TransactionList from "./Componenet/TransactionList";
import ExpensesChart from "./Componenet/ExpensesChart";
import DashboardCards from "./Componenet/DashboardCards";
import CategoryPieChart from "./Componenet/CategoryPieChart";
import BudgetForm from "./Componenet/BudgetForm";
import BudgetComparisonChart from "./Componenet/BudgetComparisonChart";
import SpendingInsights from "./Componenet/SpendingInsights";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [editingTx, setEditingTx] = useState(null);

  // Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  // Fetch Budgets
  const fetchBudgets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/budgets");
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  // Add Transaction
  const addTransaction = (tx) => {
    setTransactions([tx, ...transactions]);
  };

  // Update Transaction
  const updateTransaction = (updatedTx) => {
    setTransactions(
      transactions.map((tx) => (tx._id === updatedTx._id ? updatedTx : tx))
    );
    setEditingTx(null);
  };

  // Delete Transaction
  const deleteTransaction = async (id) => {
    await fetch(`http://localhost:5000/api/transactions/${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  // Add or Update Budget
  const saveBudget = (budget) => {
    const existing = budgets.find(
      (b) => b.category === budget.category && b.month === budget.month
    );

    if (existing) {
      setBudgets(
        budgets.map((b) =>
          b.category === budget.category && b.month === budget.month ? budget : b
        )
      );
    } else {
      setBudgets([budget, ...budgets]);
    }
  };

  return (
    <div className="container">
      <h1>Personal Finance Visualizer</h1>

      {/* Add / Edit Transaction */}
      <TransactionForm
        onAdd={addTransaction}
        editingTx={editingTx}
        onUpdate={updateTransaction}
        cancelEdit={() => setEditingTx(null)}
      />

      {/* Budget Form */}
      <BudgetForm onSave={saveBudget} />

      {/* Dashboard */}
      <DashboardCards transactions={transactions} />
      <CategoryPieChart transactions={transactions} />
      <ExpensesChart transactions={transactions} />

      {/* Stage 3: Budgeting Features */}
      <BudgetComparisonChart transactions={transactions} budgets={budgets} />
      <SpendingInsights transactions={transactions} budgets={budgets} />

      {/* Transactions List */}
      <TransactionList
        transactions={transactions}
        onDelete={deleteTransaction}
        onEdit={(tx) => setEditingTx(tx)}
      />
    </div>
  );
}

export default App;
