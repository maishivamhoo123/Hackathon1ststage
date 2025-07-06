import React, { useEffect, useState } from "react";

export default function TransactionForm({ onAdd, editingTx, onUpdate, cancelEdit }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category: ""
  });

  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // Pre-fill form if editing
  useEffect(() => {
    if (editingTx) {
      setForm({
        amount: editingTx.amount,
        description: editingTx.description,
        date: editingTx.date.slice(0, 10), // format for <input type="date" />
        category: editingTx.category,
      });
    }
  }, [editingTx]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.amount || !form.description || !form.date || !form.category) return;

    if (editingTx) {
      // Update flow
      const res = await fetch(`http://localhost:5000/api/transactions/${editingTx._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updatedTx = await res.json();
      onUpdate(updatedTx);
    } else {
      // Add flow
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newTx = await res.json();
      onAdd(newTx);
    }

    setForm({ amount: "", description: "", date: "", category: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
      />
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>{cat.name}</option>
        ))}
      </select>
      <button type="submit">{editingTx ? "Update" : "Add"}</button>
      {editingTx && <button onClick={cancelEdit}>Cancel</button>}
    </form>
  );
}
