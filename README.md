# Class Fund Manager

A lightweight payment and transparency platform built for managing class fund contributions in a 63-student college class.

The application was created to replace manual cash collection, reduce confusion around payment status, and provide complete visibility into how class funds are collected and spent.

More than 60 students have successfully contributed through the platform.

---

## The Problem

Managing a class fund manually creates several issues:

* Students forget whether they have paid
* The class representative must track payments manually
* Fund balances are difficult to verify
* Expense records are scattered across chats and spreadsheets
* Transparency is limited

This project centralizes the entire process into a single web application where students can contribute, verify payments, and view fund usage.

---

## Features

### Student Portal

* Secure login using Firebase Authentication
* Roll-number-based identity system
* View current class fund balance
* View recorded expenses
* Make the fixed ₹20 class contribution through Razorpay
* View personal payment status

### Admin Portal

* View payment status of all students
* View transaction history
* Monitor overall fund collection
* Read-only transaction visibility
* Access restricted to the designated admin account

---

## Tech Stack

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Frontend       | HTML, CSS, Vanilla JavaScript |
| Authentication | Firebase Authentication       |
| Database       | Cloud Firestore               |
| Payments       | Razorpay Checkout             |
| Backend        | Firebase Cloud Functions      |
| Hosting        | Firebase Hosting              |

---

## Architecture

```text
Student
   │
   ▼
Firebase Auth
   │
   ▼
Frontend (HTML/CSS/JS)
   │
   ├── Firestore Reads
   │
   └── Payment Request
           │
           ▼
Firebase Cloud Function
           │
           ▼
      Razorpay
           │
           ▼
 Payment Verification
           │
           ▼
Firestore Transaction
```

---

## Security Model

### Authentication

Students authenticate through Firebase Authentication using a roll-number-based email pattern.

Example:

```text
22bcs001@cseb.com
```

### Payment Security

Payments are not trusted from the frontend.

The backend:

1. Creates Razorpay orders
2. Verifies Razorpay signatures
3. Uses Firestore transactions for settlement
4. Updates payment records only after verification

### Firestore Access

* Students can access only data required for the application flow
* Transaction records cannot be modified from the client
* Administrative transaction views are restricted to:

```text
admin@cseb.com
```

### Idempotency

Payment settlement is protected against duplicate processing through Firestore transaction-based guards.

---

## Data Model

### users

Stores student information.

```javascript
{
  uid,
  rollNo,
  name,
  totalPaid
}
```

### expenses

Stores class expenditure records.

```javascript
{
  title,
  amount,
  description,
  createdAt
}
```

### transactions

Stores payment lifecycle information.

```javascript
{
  orderId,
  paymentId,
  status,
  amount,
  createdAt
}
```

---

## Project Structure

```text
public/
├── index.html
├── dashboard.html
├── admin/
│   ├── adminDashboard.html
│   ├── transactions.html
│   └── scripts/
├── js/
│   ├── pages/
│   ├── services/
│   └── utils/
└── styles/

functions/
├── index.js
└── middleware/
```

---

## Local Development

### Prerequisites

* Node.js
* Firebase CLI
* Firebase Project
* Razorpay Account

### Clone

```bash
git clone <repository-url>
cd class-fund-manager
```

### Install Functions Dependencies

```bash
cd functions
npm install
```

### Configure Firebase

Create the Firebase configuration inside the frontend application.

### Configure Razorpay Secrets

```bash
firebase functions:config:set \
razorpay.key_id="YOUR_KEY_ID" \
razorpay.key_secret="YOUR_KEY_SECRET"
```

### Run Locally

```bash
firebase emulators:start
```

### Deploy

```bash
firebase deploy
```

---

## Design Decisions

### Vanilla JavaScript

The project intentionally avoids frontend frameworks.

For a small internal application:

* Faster development
* No build pipeline
* Minimal dependencies
* Easier maintenance

### Firebase

Firebase provides:

* Authentication
* Database
* Hosting
* Serverless backend

without requiring server management.

### Fixed Contribution Amount

The application collects a fixed ₹20 contribution.

The amount is enforced by the backend rather than trusted from the frontend.

---

## Future Improvements

- Enhanced admin panel with additional management features (the current version intentionally focuses on the core payment workflow)
- Razorpay webhook integration for additional payment reliability and reconciliation
- Audit logs for administrative actions and expense tracking
- Analytics dashboard with contribution and expense insights
- Improved mobile responsiveness across devices
- Automated contribution reminders for pending payments

---

## Lessons Learned

Building this project provided practical experience with:


* Cloud Functions
* Payment gateway integrations
* Payment verification workflows
* Idempotent transaction handling
* Deploying production applications

---

## Contributing

Contributions are welcome.

If you would like to improve the project:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add my feature"
```

4. Push to your branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

Please keep contributions focused, well-documented, and aligned with the project's scope.

---

## Disclaimer

This project was built for a private college class and is not intended to operate as a public payment platform.


---

## License

MIT License

Feel free to use, modify, and learn from this project.
