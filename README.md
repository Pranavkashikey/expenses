# 💰 Expense Tracker (Full-Stack)

A minimal production-style full-stack Expense Tracker built with a focus on correctness, reliability, and real-world conditions.

This project allows users to record, view, filter, and analyze personal expenses with retry-safe API behavior and proper money handling.

---

## 🌐 Live Demo

Frontend: https://expense-tracker-pk-2026.vercel.app  
Backend API: [https://expense-tracker-backend.onrender.com ](https://expense-tracker-backend-hxuc.onrender.com) 

---

## 🏗 Tech Stack

### Backend
- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Jest + Supertest (integration tests)

### Frontend
- React (Vite)
- Axios
- Framer Motion (animations)
- Responsive CSS

---

## ✨ Features

### Core Features
- Create a new expense (amount, category, description, date)
- View list of expenses
- Filter by category
- Sort by date (newest first)
- View total of visible expenses
- Summary view (total per category)

### Reliability Features
- Idempotent POST requests using `Idempotency-Key`
- Retry-safe behavior (prevents duplicate expense creation)
- Backend validation for money and required fields
- Loading and error states in UI

---

## 💡 Design Decisions

### 1️⃣ Money Handling
Amounts are stored in the smallest currency unit (paise) as integers to prevent floating-point precision errors.

Example:
₹100.50 → stored as 10050

This ensures correctness in financial calculations.

---

### 2️⃣ Idempotency Support
The `POST /expenses` endpoint requires an `Idempotency-Key` header.

If the same request is retried (due to network failure or page refresh), the backend:
- Detects duplicate key
- Returns previously created expense
- Prevents duplicate records

This simulates real-world reliability patterns used in payment systems.

---

### 3️⃣ Persistence Choice
MongoDB Atlas was chosen because:
- Easy deployment
- Real persistence (not in-memory)
- Good for rapid development
- Suitable for evolving schema

---

## 📂 Project Structure

