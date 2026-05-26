# 🔬 MedScan AI — Smart Healthcare Assistant

AI-powered medical report analyzer. Upload prescriptions, blood tests, scans — get simple, clear explanations instantly.

---

## 🏗️ Project Structure

```
medscan-ai/
├── backend/                  # Node.js + Express API
│   ├── config/               # Database config
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth, upload middleware
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── services/             # Gemini AI, RAG, knowledge base
│   ├── utils/                # JWT helpers
│   ├── uploads/              # Uploaded files (auto-created)
│   ├── server.js             # Entry point
│   └── package.json
└── frontend/                 # React + Vite app
    ├── src/
    │   ├── components/       # Layout, LoadingScreen
    │   ├── context/          # Auth context
    │   ├── pages/            # All pages
    │   ├── services/         # Axios API client
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Gemini API key (free at https://aistudio.google.com)

---

## 🔧 Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medscan_ai
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=AIzaSyChG2dIuB1IayjJJEBiavlQiGP07wCE-BE
GEMINI_MODEL=gemini-2.5-flash
GOOGLE_CLIENT_ID=678907705967-jhn9pr9v4fbs4ntk821qqp39opp12lrp.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

```bash
# Start backend
npm run dev
# Backend runs on http://localhost:5000
```

---

## 🎨 Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=678907705967-jhn9pr9v4fbs4ntk821qqp39opp12lrp.apps.googleusercontent.com
```bash
# Start frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🗄️ MongoDB Setup

### Option A: Local MongoDB
1. Install MongoDB Community: https://www.mongodb.com/try/download/community
2. Start MongoDB: `mongod`
3. Use URI: `mongodb://localhost:27017/medscan_ai`

### Option B: MongoDB Atlas (Cloud - Recommended)
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Use as `MONGODB_URI` in .env

---

## 🤖 Gemini API Setup

1. Go to https://aistudio.google.com/app/apikey
2. Create a free API key
3. Add to `GEMINI_API_KEY` in **backend** `.env` only (not `frontend/.env` — Vite env vars are not used for Gemini)
4. Free tier: 15 req/min, 1500 req/day — plenty for development

---

## 🔵 Google OAuth Setup (for Google Sign-In)

### The Client ID is already configured:


### To make Google Sign-In work on localhost:
1. Go to https://console.cloud.google.com
2. Navigate to **APIs & Services → Credentials**
3. Find the OAuth 2.0 Client ID
4. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173`
   - `http://localhost:5000`
   - `http://127.0.0.1:5173`
5. Under **Authorized redirect URIs**, add:
   - `http://localhost:5173`
6. Save and wait 5 minutes for changes to propagate

> **Note:** If you get `deleted_client` or origin mismatch errors, the Client ID may need to be recreated in your own Google Cloud project. Create a new OAuth 2.0 Client ID and update it in both `.env` files and `frontend/src/main.jsx`.

---

## 🚀 Running the Full App

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd medscan-ai/backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd medscan-ai/frontend
npm run dev
```

Open http://localhost:5173 in your browser.

---

## ✨ Features

- 📊 **Dashboard** — Overview of your health report history
- 📤 **Upload** — PDF, JPG, PNG, WebP support (up to 20MB)
- 🤖 **AI Analysis** — Gemini 2.5 Flash analyzes reports
- 🔬 **RAG** — Medical knowledge base enhances AI accuracy
- 💊 **Medicines** — Usage, dosage, side effects explained
- ⚠️ **Abnormal Values** — Highlighted with plain-language explanations
- 🥗 **Lifestyle Tips** — Food, exercise, precaution suggestions
- 📱 **Responsive** — Works on mobile and desktop
- 🔐 **Auth** — Email/password + Google OAuth

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | Google Gemini 2.5 Flash |
| Auth | JWT, Google OAuth (@react-oauth/google) |
| File Upload | Multer |
| PDF Parsing | pdf-parse |
| Image OCR | Gemini Vision |

---

## 📋 API Endpoints

```
POST /api/auth/register       Register with email/password
POST /api/auth/login          Login with email/password
POST /api/auth/google         Google OAuth login
GET  /api/auth/me             Get current user

POST /api/reports/upload      Upload & analyze report
GET  /api/reports             List user's reports
GET  /api/reports/:id         Get single report
DELETE /api/reports/:id       Delete report
GET  /api/reports/dashboard-stats  Dashboard statistics

GET  /api/user/profile        Get profile
PUT  /api/user/profile        Update profile
PUT  /api/user/change-password Change password
```

---

## ⚕️ Disclaimer

MedScan AI is for educational purposes only. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.
