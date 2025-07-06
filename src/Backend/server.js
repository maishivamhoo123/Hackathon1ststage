require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const rawUri = process.env.MONGO_URI;
const dbName = "test";
const mongoUri = rawUri.includes("/") && !rawUri.includes(`/${dbName}`)
  ? rawUri.replace(/\/\?/, `/${dbName}?`)
  : rawUri;

// ✅ Schemas
const transactionSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  date: String,
  category: String,
});
const Transaction = mongoose.model("Transaction", transactionSchema);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Category = mongoose.model("Category", categorySchema);

// ✅ Seed default categories
async function seedDefaultCategories() {
  const existing = await Category.find();
  if (existing.length === 0) {
    await Category.insertMany([
      { name: "Food" },
      { name: "Transport" },
      { name: "Shopping" },
      { name: "Health" },
      { name: "Bills" },
      { name: "Other" },
    ]);
    console.log("✅ Default categories added");
  }
}
const budgetSchema = new mongoose.Schema({
  category: String,
  month: String, // Format: '2025-07'
  amount: Number,
});
const Budget = mongoose.model("Budget", budgetSchema);


// ✅ Only start server after DB is connected
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("✅ MongoDB connected to 'test' database");

    await seedDefaultCategories();

    // ✅ API routes
    app.get("/api/transactions", async (req, res) => {
      const data = await Transaction.find().sort({ date: -1 });
      res.json(data);
    });

    app.post("/api/transactions", async (req, res) => {
      const { amount, description, date, category } = req.body;
      const tx = new Transaction({ amount, description, date, category });
      await tx.save();
      res.status(201).json(tx);
    });

    app.delete("/api/transactions/:id", async (req, res) => {
      const { id } = req.params;
      await Transaction.findByIdAndDelete(id);
      res.json({ success: true });
    });

    app.put("/api/transactions/:id", async (req, res) => {
      const { id } = req.params;
      const { amount, description, date, category } = req.body;
      const tx = await Transaction.findByIdAndUpdate(id, { amount, description, date, category }, { new: true });
      res.json(tx);
    });

    app.get("/api/categories", async (req, res) => {
      const categories = await Category.find();
      res.json(categories);
    });

    app.post("/api/categories", async (req, res) => {
      const { name } = req.body;
      const newCategory = new Category({ name });
      await newCategory.save();
      res.status(201).json(newCategory);
    });
    // Add or update budget
app.post("/api/budgets", async (req, res) => {
  const { category, month, amount } = req.body;
  const budget = await Budget.findOneAndUpdate(
    { category, month },
    { amount },
    { upsert: true, new: true }
  );
  res.status(201).json(budget);
});

// Get all budgets
app.get("/api/budgets", async (req, res) => {
  const budgets = await Budget.find();
  res.json(budgets);
});


    // ✅ Start server after DB + data is ready
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
