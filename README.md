⚙️ This is the backend repository for the ShrinkIt
 project.
---

# 🔗 ShrinkIt – URL Shortener

ShrinkIt is a **full-stack URL shortener** where users can create, manage, and track their shortened links. Built with **MERN stack (MongoDB, Express.js, React, Node.js)**, it’s designed as both a **portfolio project** and a foundation for scaling into a startup.

---

## ✨ Features

* 👤 **User Authentication**

  * Signup with username, email, and password
  * Login with JWT-based session tokens
  * Protected routes for logged-in users

* 🔗 **URL Shortening**

  * Authenticated users can shorten long URLs
  * Copy shortened links with one click
  * View original + short links in dashboard

* 📊 **Analytics Dashboard**

  * List of all shortened links by user
  * Sort by date created or number of clicks
  * Basic bar/line charts for link performance
  * Delete links anytime

---

## 🛠️ Tech Stack

* **Frontend:** React + Tailwind CSS + React Router + Axios
* **Backend:** Node.js + Express.js
* **Database:** MongoDB + Mongoose
* **Auth:** JWT in cookies

---

## 🚀 Getting Started

### 1. Clone repo

```bash
git clone https://github.com/JSRxLogan/shrinkit-backend.git
cd shrinkit
```

### 2. Backend setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

---

## 📂 Project Structure

```
shrinkit/
│
├── backend/        # Express + MongoDB API
│   ├── models/     # Mongoose schemas
│   ├── routes/     # API routes
│   ├── controllers/ # Auth & URL logic
│   └── ...
│
├── frontend/       # React app
│   ├── src/
│   │   ├── pages/  # Login, Signup, Dashboard
│   │   ├── components/ # UI components
│   │   └── ...
│
└── README.md
```

---

## 📌 Roadmap

* User authentication
* URL shortening
* Analytics dashboard
* Link previews
* QR code generator
* Team/Org accounts

---

## 📜 License

This project is for **learning + portfolio purposes only**.
Modification, usage, or redistribution requires **explicit permission from the author**.

---

## 🤝 Contributing

Right now, contributions are **closed**. This repo is part of a personal journey project.

---

## 👤 Author

**Logan** – Engineering + Development + Boxing + Poetry ✨

---

