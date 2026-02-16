import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "./api";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import "./index.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filter) params.category = filter;
      if (sortNewest) params.sort = "date_desc";

      const res = await api.get("/expenses", { params });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filter, sortNewest]);

  
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

 
  const categorySummary = expenses.reduce((acc, exp) => {
    const category = exp.category;

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += exp.amount;
    return acc;
  }, {});

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        💰 Expense Tracker
      </motion.h1>

      <ExpenseForm onSuccess={fetchExpenses} />

      {/* Controls */}
      <motion.div
        className="controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div>
          <label>Filter by Category: </label>
          <input
            type="text"
            placeholder="Enter category"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSortNewest(!sortNewest)}
        >
          {sortNewest ? "Newest First" : "Sort by Date"}
        </motion.button>
      </motion.div>

      {/* Total */}
      <motion.div
        className="total"
        key={total}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        Total: ₹ {(total / 100).toFixed(2)}
      </motion.div>

      {/* ✅ Summary by Category */}
      <motion.div
        className="category-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3>Summary by Category</h3>

        {Object.keys(categorySummary).length === 0 ? (
          <p>No data available</p>
        ) : (
          <ul>
            {Object.entries(categorySummary).map(([cat, amt]) => (
              <li key={cat}>
                <strong>{cat}</strong>: ₹ {(amt / 100).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Expense List */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Loading expenses...
          </motion.p>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ExpenseList expenses={expenses} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
