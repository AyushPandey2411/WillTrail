# WillTrail

A full-stack web application that lets people store their medical information securely and generate an emergency QR card — so first responders always have what they need, instantly.

Live demo → `coming soon`

---

## The Problem

Most people have never written an advance directive. And even those who have — the document is usually sitting in a drawer at home, completely useless in an actual emergency.

I built WillTrail to fix that. One QR code on your phone or wallet card gives any paramedic immediate access to your blood type, allergies, CPR preferences, and emergency contacts. No login required on their end. No app to download. Just scan and read.

---

## What It Does

- **Advance Directive Builder** — A guided 6-step form covering personal info, emergency contacts, medical history, care preferences, and healthcare agent designation
- **Encrypted Document Vault** — Upload medical files (insurance cards, test results, prescriptions) stored with AES-256 encryption
- **Emergency QR Card** — Generates a shareable card showing only the information you choose to make public
- **PDF Export** — Download a properly formatted advance directive PDF to print or share with your doctor
- **Admin Dashboard** — Platform analytics, user management, and feedback moderation (for admin/moderator roles)
- **Feedback & Testimonials** — Users can submit feedback and testimonials; admins approve what appears publicly

---

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- AES-256-CBC Encryption (Node crypto)
- PDFKit for PDF generation
- Role-Based Access Control (user / moderator / admin)

**Frontend**
- React 18 + Vite
- React Router v6 with lazy loading and code splitting
- Tailwind CSS with custom design system
- Axios with JWT interceptor
- React Context for global auth state

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas account

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/willtrail.git
cd willtrail

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/willtrail
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRE=7d
ENCRYPTION_KEY=your_encryption_passphrase_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Seed the Database

```bash
cd backend
npm run seed
```

This creates an admin account and sample data so the dashboard has something to show.


### Run the App

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Then open `http://localhost:5173`

---

## Project Structure

```
willtrail/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handlers and business logic
│   ├── middleware/       # Auth, RBAC, file upload, analytics
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   └── utils/           # Encryption, PDF, QR, analytics, seed
│
└── frontend/
    └── src/
        ├── api/          # Axios instance with JWT interceptor
        ├── components/   # Reusable UI and layout components
        ├── context/      # Global auth state
        ├── hooks/        # Custom React hooks
        ├── pages/        # Page components (lazy loaded)
        └── utils/        # Formatting helpers
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/directive` | User | Get directive |
| PUT | `/api/directive` | User | Save directive |
| POST | `/api/directive/generate-qr` | User | Generate QR card |
| GET | `/api/directive/pdf` | User | Download PDF |
| GET | `/api/directive/emergency-card/:token` | Public | Emergency card data |
| POST | `/api/documents` | User | Upload encrypted file |
| GET | `/api/documents` | User | List documents |
| GET | `/api/admin/stats` | Admin | Platform statistics |

---

## Security

- Passwords hashed with bcrypt (cost factor 12)
- Files encrypted with AES-256-CBC, random IV per file, stored as encrypted hex — never as plaintext
- JWT tokens verified server-side on every protected request
- Role-based access control enforced at the route level, not just the frontend
- Rate limiting on auth routes (20 requests / 15 min per IP)
- Helmet.js for secure HTTP headers
- Document access restricted by user ownership — no IDOR vulnerabilities

---

## Deployment

- **Backend** → Render.com (Node.js web service)
- **Frontend** → Vercel
- **Database** → MongoDB Atlas (free tier)

---

## License

MIT
