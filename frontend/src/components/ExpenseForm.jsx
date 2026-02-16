import { useState } from "react";
import api from "../api";

function ExpenseForm({ onSuccess }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const amountValue = parseFloat(form.amount);

  // Required fields
  if (!form.amount || !form.category.trim() || !form.date) {
    alert("All required fields must be filled.");
    return;
  }

  // Negative or zero amount block
  if (isNaN(amountValue) || amountValue <= 0) {
    alert("Amount must be greater than 0.");
    return;
  }

  try {
    setLoading(true);

    const idempotencyKey = crypto.randomUUID();

    await api.post(
      "/expenses",
      {
        amount: Math.round(amountValue * 100),
        category: form.category.trim(),
        description: form.description.trim(),
        date: form.date,
      },
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );

    setForm({
      amount: "",
      category: "",
      description: "",
      date: "",
    });

    onSuccess();
  } catch (err) {
    alert("Failed to create expense.");
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="number"
        placeholder="Amount (₹)"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;
