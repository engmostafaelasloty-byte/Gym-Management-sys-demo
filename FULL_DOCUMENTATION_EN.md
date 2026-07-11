# 📚 Comprehensive Documentation for Gym Management System

This document is the full and detailed reference for the professional Gym Management System. It provides an in-depth explanation of every part of the system, how it works, its software architecture, and databases to facilitate future work on it for both developers and users.

---

## 📑 Table of Contents
1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture](#3-architecture)
4. [System Modules](#4-system-modules)
5. [Isolation & Permissions](#5-isolation--permissions)
6. [Database Schema](#6-database-schema)
7. [Subscriber Lifecycle](#7-subscriber-lifecycle)
8. [Installation & Setup](#8-installation--setup)

---

## 1. System Overview

**Gym Management System** is an advanced web application specifically designed to meet the needs of modern gyms, particularly those that separate "Men's Gym" from "Women's Gym". 
The system solves the complexity of managing multiple branches (Men - Women - Mixed) through a single database and a single application, ensuring total isolation of data for each department (a men's department employee cannot see women's department data and vice versa).

The system offers a very distinct User Experience (UX) with a Dark Mode design based on the modern Glassmorphism style, supporting **14 global languages** with instant switching and full RTL (Right-to-Left) and LTR (Left-to-Right) support.

---

## 2. Tech Stack

The system is built using the latest web technologies to ensure speed, security, and scalability:
- **Core Framework:** Next.js 14 (App Router).
- **Primary Programming Language:** JavaScript (ES6+).
- **Database:** MongoDB (via Mongoose library).
- **UI Styling:** Custom CSS (Vanilla CSS) with a modern Glassmorphism structure.
- **Server Communication:** Next.js Server Actions (no traditional API Routes, speeding up performance and increasing security).
- **Icons & Sub-libraries:** React Icons, Barcode and QR code reading/generating libraries.

---

## 3. Architecture

The data flow path in the project consists of:
1. **Client Components:** Interactive screens in the path `app/page.js` and `app/layout.js`.
2. **Server Actions:** Located in the `app/actions.js` file, these are functions that communicate directly with the database.
3. **Models:** Located in the `/models/` folder, they define the shape of the data to be stored in MongoDB.

### Project Structure Details:

```text
Gym_Management_Sys/
├── app/                  # Frontend components and Server Actions (Next.js App Router)
│   ├── actions.js        # The beating heart of the system: All database and Backend communication functions
│   ├── layout.js         # Main layout of the application including the Head and global styles
│   ├── page.js           # The main Single Page Application (SPA) that manages all system interfaces
│   └── ...               # Style files and interface attachments
├── lib/                  # Helper libraries
│   └── mongodb.js        # File for setting up and establishing MongoDB database connection
├── models/               # MongoDB database schemas (Mongoose Models)
│   ├── Attendance.js     # Check-in and check-out attendance schema
│   ├── AuditLogs.js      # Actions record schema (for tracking staff activity)
│   ├── Good.js           # Goods and products schema (for inventory and POS)
│   ├── Hardware.js       # Sports equipment management and maintenance schema
│   ├── Installment.js    # Financial installments management schema
│   ├── Payment.js        # Payment operations schema (Revenues and Expenses)
│   ├── Staff.js          # Staff accounts and permissions schema (Admin/Staff)
│   └── Subscriber.js     # Subscribers data, their subscription details and expiration dates schema
├── documentation/        # Documentation files and auxiliary HTML
├── public/               # Static files, images, and interface resources
├── scripts/              # Helper scripts to initialize the project
├── .env.example          # Example of environment variables required for running
├── .env.local            # Current environment variables (like database URI) - Git ignored
├── next.config.mjs       # Next.js framework settings
├── package.json          # Dependencies record and Node environment configuration
└── FULL_DOCUMENTATION_AR.md # Arabic documentation 
└── FULL_DOCUMENTATION_EN.md # English documentation 
```

This organization relies on a clean structure (Clean Architecture) that entirely separates:
1. **Frontend Component:** The `app/` folder containing `page.js` and `layout.js`.
2. **Backend Actions (Operations & Logic):** Gathered in the `app/actions.js` file to strictly execute on the Server-side in a fast and secure manner.
3. **Database Layout:** Isolated in the `models/` folder in a way that makes modifying tables easy, with the connection established in `lib/mongodb.js`.

---

## 4. System Modules

The system is divided into a group of interconnected modules:

### 👤 1. Subscribers Management
- Registering new subscribers with full data (height, weight, blood type, goals).
- Assigning a unique QR code to each subscriber.
- Managing subscriptions: (Renewal, Freezing/Pausing, Free Extension).
- Tracking physical measurements and their progression over time (Measurements Module).

### 💳 2. Finance & Payments
- Processing payments, whether full or in **Installments**.
- Recording revenues from subscriptions.
- Recording expenses (bills, salaries, equipment).
- Calculating **Net Profits** (Revenues - Expenses).
- Applicable discount coupons.

### 🛒 3. POS & Inventory
- A professional Point of Sale (POS) for selling goods (supplements, water, sportswear).
- Support for sales via **Barcode Scanner**.
- Tracking the inventory of each product (Stock Management).
- Automatic alerts when any product's stock is low.

### 👥 4. Staff Management
- Registering employees and specifying their permissions according to Role-Based Access Control (RBAC).
- The system administrator determines whether the employee works in: (Men / Women / Admin).
- Determining sub-permissions (such as: allowing product sales, preventing viewing of financial reports).

### 🛠️ 5. Equipment & Maintenance
- Recording gym machines with their information, purchase date, and warranty.
- Scheduling periodic maintenance for each machine and tracking the history of breakdowns.
- Recording the financial cost for each maintenance cycle.

### 🎁 6. Loyalty Program
- Subscribers earn points upon: attending, renewing, or purchasing from the cafeteria.
- These points can be redeemed by extending the subscription with free days or obtaining goods.

### 📊 7. Dashboard & Analytics
- A dashboard that works in real-time, displaying attendance and financial statistics.
- Charts illustrating monthly comparisons, and profit/loss rates.

---

## 5. Isolation & Permissions

This is the most critical feature of the system. Gyms and sports halls in many Arab countries rely on separating halls (or times) between men and women.

**How does isolation work in the system?**
1. **The `mode` field:** Every (subscriber, financial payment, attendance record, sale invoice) is stamped with a `mode` field (taking the value `men` or `women`, or `mix`).
2. **Staff Session:** When a staff member logs in, the employee's mode `user.mode` is stored.
3. **Central Filtering:** In the `actions.js` file, every data fetching function automatically filters based on the `mode` of the staff member making the request.
   - If the staff is `men` -> They only see men's subscribers and data.
   - If the staff is `women` -> They only see women's data.
   - If the management is `admin` -> They can see everything (a filter button appears at the top of the screen to choose the branch they want to supervise, or merge them together).

---

## 6. Database Schema

Here is a glimpse of the most important Collections in MongoDB created for this project:

1. **`Subscribers`**:
   - Fields: `name`, `phone`, `email`, `qrCode`, `startDate`, `endDate`, `status` (active/expired), `price`, `mode`.
2. **`Attendance`**:
   - Records the link of the subscriber (`subscriberId`) to the check-in time (`checkIn`) and check-out time (`checkOut`).
3. **`Payments`**:
   - Fields: `subscriber`, `amount`, `type` (subscription/goods/installment), `reference`, `mode`.
4. **`Staff`**:
   - Fields: `name`, `email`, `password`, `role` (admin/staff), `mode` (men/women/mix).
5. **`Goods`**:
   - Fields: `name`, `barcode`, `buyPrice`, `sellPrice`, `stock`, `mode`.
6. **`AuditLog`**:
   - The strict surveillance system; any action performed in the system (like deleting a subscriber or editing a financial amount) is saved in this table with the staff info, time, and the operation they carried out for review by management.

---

## 7. Subscriber Lifecycle

1. **Registration:** The client arrives, the staff member enters their basic data, and chooses the subscription type (1 month, 3 months, etc.).
2. **Payment:** The client pays for their subscription (the full amount or part of it via the installments system). The system sets a `startDate` and an `endDate`.
3. **Check-in:** The client receives a QR Code on their phone. They enter the gym, and the staff member scans the code via the camera to record the attendance time in the `Attendance` log.
4. **Freezing:** If the client wants to pause their subscription for travel, the system adds these days as `frozenDays` and automatically extends the `endDate`.
5. **Expiration:** The system monitors the `endDate`. Upon expiration, it changes the subscriber's state to `expired` and prevents their (Check-in) unless it is Renewed.

---

## 8. Installation & Setup

To run this system on a local environment (Local Development) or production server (Production Server):

### 1- Prerequisites:
- Install Node.js (version 18 or higher).
- Availability of a MongoDB database connection (local or MongoDB Atlas Cloud).

### 2- Installation Steps:
Open the terminal and run the following:
```bash
# 1. Clone the project (or unzip the files)
# 2. Enter the project path
cd Gym_Management_Sys

# 3. Install dependencies and packages
npm install
```

### 3- Setup Environment Variables:
Create a file named `.env.local` in the main root of the project, and add your database link inside it, for example:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gym_db_name
# Or use the local connection
# MONGODB_URI=mongodb://127.0.0.1:27017/gym
```

### 4- Run the System:
```bash
npm run dev
```
The system will run on the link `http://localhost:3000`.

### 5- First-Time Admin Registration:
- **No Default Credentials:** The system does not ship with preset default logins for safety.
- **First-Time Admin Setup:** On the first run, the system will automatically prompt you to register the first master administrator account. Fill out the registration form to create your admin account, and use it to log in.

---

## Final Notes for Developers
This system was built with intense focus on **Component Separation**. You will find that the somewhat complex `app/page.js` file manages multiple states (Tabs) to give the user a true Single Page Application (SPA) experience without reloading pages at all.

All interactions with the database are secured through functions that rely on `try/catch` to return `success: true/false` objects so the frontend can alert the user (success/failure) of the action clearly through instant alerts (Toast Notifications).

---
*This documentation was prepared to ensure optimal understanding of the project and its components.*
