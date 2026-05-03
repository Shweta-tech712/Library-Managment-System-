# LibNova — Next-Gen College Library Management System

![Version](https://img.shields.io/badge/version-2.0.0-red)
![Tech Stack](https://img.shields.io/badge/Stack-Flask%20%7C%20React%20%7C%20Tailwind-8B1E3F)
![License](https://img.shields.io/badge/License-MIT-black)

**LibNova** is a premium, data-driven SaaS application designed to modernize college library operations. Moving beyond simple CRUD operations, LibNova provides deep analytical insights, automated reservation queues, and a sophisticated fine management system—all wrapped in a sleek, glassmorphic "Dark Red" aesthetic.

---

## 🚀 Key Features

### 📊 Advanced Analytics Dashboard
Real-time data visualization using **Chart.js**. Track issuing trends over a 7-day rolling window, monitor category distribution via doughnut charts, and identify top-performing books through popularity leaderboards.

### ⏳ Smart Reservation Queue (FIFO)
Never lose track of high-demand books. When inventory hits zero, students can join a **First-In, First-Out** waitlist. The system automatically fulfills reservations the moment a book is returned.

### 💳 Fine & Payment Management
Automated penalty calculation based on custom daily rates. Administrators have a dedicated financial ledger to track outstanding balances and process payments with a single click.

### 🔍 Advanced Search & Lifecycle Tracking
Powerful filtering by category, status, and metadata. Each book has a dedicated "Life-Cycle" page showing its entire borrow history and current queue status.

### 👥 User & Role Management
Comprehensive directory for students and faculty. Track individual reading habits, active checkouts, and historical accountability.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)
- **Architecture**: Service-Layer Pattern for clean business logic separation

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS (Custom Dark-Red Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Chart.js & React-Chartjs-2

---

## 📦 Installation & Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
*The server will start on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
*The application will be available at `http://localhost:3000`*

---

## 🎨 Design Philosophy

LibNova utilizes a **Premium Dark Aesthetic** designed for high-focus administrative environments:
- **Primary Palette**: `#FF4B4B` (Vibrant Red) to `#8B1E3F` (Deep Maroon).
- **Surface**: High-contrast dark backgrounds (`#0D0D0D`) with glassmorphic card overlays.
- **Micro-interactions**: Subtle hover elevations and spring-based entry animations using Framer Motion.

---

## 🛡️ Security
- All administrative endpoints are protected via `@admin_required` decorators.
- Password hashing using `Werkzeug.security`.
- Secure JWT stateless authentication flow.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**LibNova** — *Empowering Knowledge, Streamlining Management.*
