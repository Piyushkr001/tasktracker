This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🧠 Task Tracker App

A full-stack task tracking application built for the Developer Trainee Task-01 challenge. This project enables users to manage projects and tasks with secure authentication, CRUD functionality, and a clean, responsive UI.

---

## 🚀 Features

- 🧑‍💻 **User Authentication** (JWT)
- 📁 **Project Management** (Up to 4 projects/user)
- ✅ **Task Management**
  - Create, Read, Update, Delete tasks
  - Status tracking (e.g., Todo, In Progress, Done)
  - Creation and completion timestamps
- 🌐 Fully responsive and theme-aware UI (dark/light mode)
- 📦 Clean folder structure and code encapsulation

---

## ⚙️ Tech Stack

| Frontend | Backend | Database | Auth |
|----------|---------|----------|------|
| ReactJS  | ExpressJS | MongoDB or PostgreSQL | JWT |

UI is styled with **Tailwind CSS** and **Shadcn UI** components.

---

## 🛠️ Getting Started

### 📦 Clone the repository

```bash
git clone https://github.com/your-username/tasktracker.git
cd tasktracker

