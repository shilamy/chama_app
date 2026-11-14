<img width="1920" height="1080" alt="chama_app" src="https://github.com/user-attachments/assets/38c591d9-d9ac-4605-b393-d6ba10e4721f" />

# 💰 Chama Management System

A full-stack **Chama (informal banking)** management platform designed to help savings groups efficiently manage members, contributions, loans, fines, and reports.  
Built using **Laravel 11** for the backend and **React (Inertia.js)** for the frontend.

---

## 🚀 Features

- **Member Management** – Add, view, edit, and delete members with unique verification (name, phone, ID).
- **Savings & Transactions** – Record deposits, withdrawals, and member contributions.
- **Loan Processing** – Issue loans, manage repayments, and include guarantors.
- **Fines Management** – Assign and track fines automatically or manually.
- **Reports Dashboard** – Filter and export summaries (CSV/PDF) by date, type, or member.
- **Budgeting Tool** – Plan and track Chama expenses against targets. {**not implemented yet**}
- **Content Module** – Manage blogs and podcasts with tags, categories, and engagement tracking.  {**not implemented yet**}
- **M-Pesa Integration (coming soon)** – Enable mobile payments and automated confirmations.

---

## 🧩 Tech Stack

**Frontend:** React + Inertia.js + Tailwind CSS  
**Backend:** Laravel 11 (REST API)  
**Database:** MySQL  
**Authentication:** Laravel Breeze / Jetstream (Inertia stack)  
**Integrations:** M-Pesa API (planned)

---

## ⚙️ Installation

### Prerequisites
- PHP 8.3+
- Composer
- Node.js & npm
- MySQL or PostgreSQL
- Git

### Steps

```bash
# Clone the repository
git clone https://github.com/<your-username>/chama_app.git

# Move into project directory
cd chama_app/frontend
cd chama_app/backend
# Install backend dependencies
composer install

# Install frontend dependencies
npm install

# Set up your environment file
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Start the Laravel backend
php artisan serve

# Run the frontend
npm run dev

Chamampro/
│
├── backend/ (Laravel API)
│   ├── app/
│   ├── database/
│   └── routes/
│
├── frontend/ (React + Inertia)
│   ├── src/
│   ├── components/
│   └── pages/
│
└── README.md
