import { motion } from "framer-motion";

function ExpenseList({ expenses }) {
  if (expenses.length === 0) {
    return <p>No expenses found</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <motion.tr
            key={exp._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
          >
            <td>{new Date(exp.date).toLocaleDateString()}</td>
            <td>{exp.category}</td>
            <td>{exp.description}</td>
            <td>{(exp.amount / 100).toFixed(2)}</td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}

export default ExpenseList;
