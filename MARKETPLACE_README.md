# 🏋️‍♂️ Professional Gym Management System (GMS) - Full Stack Next.js

A high-performance, aesthetically pleasing, and feature-rich Gym Management System built with **Next.js 14**, **MongoDB**, and **Vanilla CSS**. This system is designed for gym owners who need a professional tool to manage subscribers, staff, equipment, and finances with a modern "Dark Glassmorphism" UI.

---

## 👤 Developer Information
- **Author:** Mostafa Elasloty
- **Contact:** engmostafaelasloty@gmail.com
- **Type:** Full Stack Web Application

---

## 🌟 Unique Feature: Multi-System Architecture
Unlike generic gym management systems, this project supports **three distinct operating modes**:
1.  **♂️ Men's System:** Data isolated for male-only gyms.
2.  **♀️ Women's System:** Data isolated for female-only gyms.
3.  **⚡ Mixed System:** A completely separate "Mixed Branch" with its own dedicated database isolation, staff, and finances.
4.  **🏢 Unified Admin:** A master dashboard to oversee everything.

---

## 🚀 Key Features
- **Modern UI/UX:** Stunning "Night Mode" design with glassmorphism effects and shooting star animations.
- **Subscriber Management:** Full lifecycle management (Add, Edit, Renew, Freeze, Check-in/Out).
- **Staff Control:** Professional staff management with mode-based access permissions (Men/Women/Mixed staff restriction).
- **Finances:** Detailed tracking of income, expenses, and net profit with monthly comparison charts.
- **Inventory & Goods:** Manage gym supplements and items with **Barcode Support** and low-stock notifications.
- **Equipment Management:** Track gym machinery and maintenance schedules.
- **Global Ready (I18n):** Support for **14 global languages** (Arabic, English, French, Spanish, Turkish, Russian, Chinese, German, Hindi, Portuguese, Italian, Vietnamese, Indonesian, Urdu).
- **Auto RTL/LTR:** Automatic interface direction adjustment (Perfect for Arabic & Urdu).
- **Smart Notification System:** Automatic alerts for birthdays, absent subscribers, and inventory shortages.

---

## 🛠 Tech Stack
-   **Frontend:** Next.js 14 (App Router), React, Vanilla CSS.
-   **Backend:** Next.js Server Actions, MongoDB (Mongoose).
-   **Security:** Bcrypt.js hashing, Role-based Access Control (RBAC).

---

## 📦 Installation Guide
1.  **Extract the files.**
2.  **Install dependencies:** `npm install`
3.  **Setup `.env.local`:** Add your `MONGODB_URI`.
4.  **Launch:** `npm run dev` or `npm run build && npm start`.
5.  **Initial Login:**
    *   On the first run, the system will automatically prompt you to register the first master administrator account. Fill out the registration form to create your admin account, and use it to log in.
    *   **Mode:** Select `Mixed` (السيستم المختلط) to access all management tabs.

---

## 📜 License
Available for commercial redistribution under regular license conditions. For custom adjustments, contact the author via email.
