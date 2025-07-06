import React, { useState, useEffect } from "react";

export default function BudgetForm({ onSave }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: "", month: "", amount: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    onSave(data);
    setForm({ category: "", month: "", amount: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>{cat.name}</option>
        ))}
      </select>
      <input type="month" name="month" value={form.month} onChange={handleChange} />
      <input type="number" name="amount" placeholder="Budget Amount" value={form.amount} onChange={handleChange} />
      <button type="submit">Set Budget</button>
    </form>
  );
}
