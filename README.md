# Class Fund Manager

A lightweight web app built to solve a real problem — collecting and tracking class fund contributions for a 63-student college class. Built and deployed by the class CR (that's me) with zero budget and zero backend server.

60+ students have paid through this.

---

## The Problem

Managing a class fund manually is a mess. Cash goes missing, people forget whether they've paid, and the CR has no way to show transparency. I needed something quick, real, and actually usable by non-technical classmates.

## What It Does

**For Students**
- Login with roll number and password
- See the current class fund balance
- View all recorded expenses (what the money was spent on)
- Pay contributions directly via Razorpay

**For Admin (CR)**
- Dashboard showing total collected, total expenses, and net balance
- Filter students by minimum contribution — instantly see who's behind
- Transaction log for all payments
- Record expenses against the fund

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vanilla HTML, CSS, JS | No build step, fast to ship |
| Auth | Firebase Authentication | Roll number → email pattern, simple and secure |
| Database | Cloud Firestore | Real-time, no server needed |
| Payments | Razorpay Payment Button | Easiest integration for Indian payments |
| Hosting | Firebase Hosting | Free tier, instant deploys |

## Project Structure

```
public/
├── index.html              # Login page
├── dashboard.html          # Student dashboard
├── admin/
│   ├── adminDashboard.html # Admin overview + defaulter filter
│   ├── transactions.html   # Payment transaction log
│   └── scripts/            # Admin-specific JS
├── js/
│   ├── pages/              # Page-level logic (login, dashboard)
│   ├── services/           # Firebase interactions (balance, expenses, users, payments)
│   └── utils/              # Navigation helpers, music
└── styles/                 # CSS for student and admin views
```

## Key Design Decisions

**Vanilla JS over React** — This project didn't need a framework. Adding React would have added build complexity with zero user-facing benefit. Kept it simple on purpose.

**Firebase direct access** — Security is handled through Firestore Rules (auth-gated), not by hiding the database behind a custom server. This is the standard pattern for Firebase apps and the right call for this scale.

**Roll number as identity** — Students log in with their roll number. Behind the scenes it maps to `rollno@cseb.com` in Firebase Auth. No need for students to remember or set up email accounts.

**Razorpay Payment Button** — Fastest path to real payments in India. Embedded directly in the frontend, no server required for basic collection.

## What I Learned

- Firebase Auth + Firestore from scratch (first real project using it)
- Structuring a JS project without a framework — services layer, page controllers, utils
- Integrating a real payment gateway with actual money flowing through it
- Building for non-technical users: the UI had to be dead simple, no onboarding

## What's Next

- [ ] Firestore Security Rules — tighten auth-gated access
- [ ] Razorpay webhook via Firebase Cloud Functions — auto-verify payments instead of manual admin review
- [ ] Mario-themed UI redesign (current version has a retro aesthetic, taking it further)

## Context

Built during Semester 4 of B.Tech CSE. Deployed and actively used — not a demo project.