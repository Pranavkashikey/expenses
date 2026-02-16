const express = require("express");
const Expense = require("../models/Expense");
const IdempotencyKey = require("../models/IdempotencyKey");

const router = express.Router();


// 🔹 POST /expenses (Idempotent)
router.post("/", async (req, res, next) => {
  try {
    const { amount, category, description, date } = req.body;
    const idempotencyKey = req.headers["idempotency-key"];

    if (!amount || !category || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!idempotencyKey) {
      return res.status(400).json({ message: "Idempotency-Key header required" });
    }

    // Check if already processed
    const existingKey = await IdempotencyKey.findOne({ key: idempotencyKey }).populate("expenseId");

    if (existingKey) {
      return res.status(200).json(existingKey.expenseId);
    }

    // Create expense
    const expense = await Expense.create({
      amount,
      category,
      description,
      date,
    });

    await IdempotencyKey.create({
      key: idempotencyKey,
      expenseId: expense._id,
    });

    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
});


// 🔹 GET /expenses
router.get("/", async (req, res, next) => {
  try {
    const { category, sort } = req.query;

    let query = {};
    if (category) {
      query.category = category;
    }

    let expensesQuery = Expense.find(query);

    if (sort === "date_desc") {
      expensesQuery = expensesQuery.sort({ date: -1 });
    }

    const expenses = await expensesQuery;

    res.json(expenses);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
