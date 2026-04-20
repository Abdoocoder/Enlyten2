# Enlyten2 Laser Center — Web Application

[![Version](https://img.shields.io/badge/version-1.2.0-gold?style=flat-square)](package.json)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-backend-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![Sentry](https://img.shields.io/badge/Sentry-monitoring-362D59?style=flat-square&logo=sentry)](https://sentry.io)
[![i18n](https://img.shields.io/badge/i18n-AR%20%2F%20EN-orange?style=flat-square)](src/locales)
[![Live](https://img.shields.io/badge/Live-enlyten2.vercel.app-black?style=flat-square&logo=vercel)](https://enlyten2.vercel.app)

> **Premier Laser & Skincare Clinic** — A luxury bilingual (Arabic / English) web application for Enlyten2 Laser Center. Built with React 19, Vite 8, Vanilla CSS, Supabase, and Sentry.

---

## 📸 Overview

Enlyten2 Laser Center is a full-stack web application designed to deliver a premium digital experience for a high-end skincare clinic. The platform supports both **Arabic (RTL)** and **English (LTR)** seamlessly, with a luxury "Luminous Canvas" design system, a real-time Supabase backend, and production-grade error monitoring via Sentry.

**Live**: [https://enlyten2.vercel.app](https://enlyten2.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 **Bilingual (AR / EN)** | Full RTL Arabic & LTR English support via `react-i18next` |
| 🎨 **Luminous Canvas Design** | Premium "Laser Glow" design system — pink, orange, purple accents |
| 🔐 **Authentication** | Supabase Auth — Sign up, Sign in, Sign out |
| 📅 **Booking System** | 3-step appointment booking for any service |
| 🖼️ **Gallery** | Before/After gallery fetched from Supabase |
| 👤 **User Profile** | Editable user profile (name, phone, bio) |
| 📊 **Dashboard** | Client booking history, KPI summary, appointment management |
| 🔔 **Notifications** | Real-time notification center |
| 🛡️ **Admin Panel** | Full CRUD for services + booking status management with search & filter |
| ⚡ **Performance** | Code splitting (React.lazy), lazy images, memoization |
| 🐛 **Error Monitoring** | Sentry — error tracking, session replay, ErrorBoundary |
| 📱 **Responsive** | Fully optimized for mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite 8
- **Styling**: Vanilla CSS with CSS Custom Properties (Design Tokens)
- **Routing**: React Router DOM v7
- **Backend & Auth**: Supabase (PostgreSQL + Auth + RLS)
- **i18n**: i18next + react-i18next
- **Monitoring**: Sentry (`@sentry/react`)
- **Deploy**: Vercel
- **Fonts**: Inter (EN) · Cairo (AR) via Google Fonts

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+`
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/Abdoocoder/Enlyten2.git
cd Enlyten2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SENTRY_DSN=your_sentry_dsn
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
enlyten2-laser-center/
├── public/                     # Static assets (logo, favicon)
├── src/
│   ├── assets/                 # Images and static media
│   ├── components/
│   │   ├── Layout/             # Header, Footer, Navigation, UserMenu
│   │   └── UI/                 # Button, Card, Input, LanguageSwitcher
│   ├── contexts/
│   │   └── AuthContext.jsx     # Global auth state + logout()
│   ├── data/
│   │   └── mockData.json       # Fallback / seed data
│   ├── hooks/
│   │   ├── useDatabase.js      # Custom Supabase query hooks
│   │   └── useAuthGuard.js     # Shared auth redirect hook
│   ├── lib/
│   │   └── supabase.js         # Supabase client + all DB functions
│   ├── locales/
│   │   ├── en.json             # English translations
│   │   └── ar.json             # Arabic translations
│   ├── pages/                  # Route-level page components (all lazy-loaded)
│   │   ├── Home.jsx            # Landing — eager loaded
│   │   ├── Services.jsx
│   │   ├── Booking.jsx
│   │   ├── Gallery.jsx
│   │   ├── Auth.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── Notifications.jsx
│   │   ├── Contact.jsx
│   │   ├── Experience.jsx
│   │   └── Admin.jsx
│   ├── styles/
│   │   ├── variables.css       # Design tokens (colors, fonts, spacing, shadows)
│   │   └── global.css          # Global resets, RTL overrides, utility classes
│   ├── App.jsx                 # Root: Sentry.ErrorBoundary + routing
│   ├── i18n.js                 # i18next configuration
│   └── main.jsx                # Entry: Sentry.init() + React mount
├── .env.local                  # Environment variables (not committed)
├── .env.local.exaple           # Template for env vars
├── .gitignore
├── CLAUDE.md                   # AI assistant guidelines
├── README.md                   # This file
├── README.ar.md                # Arabic README
├── package.json
└── vite.config.js
```

---

## 🌐 Application Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home / Landing | No |
| `/services` | Treatments & Services | No |
| `/gallery` | Before/After Gallery | No |
| `/contact` | Contact Us | No |
| `/experience` | Client Journey & Protocol | No |
| `/book` | Book an Appointment | No* |
| `/login` | Sign In / Sign Up | No |
| `/dashboard` | Client Dashboard | ✅ Yes |
| `/profile` | User Profile | ✅ Yes |
| `/notifications` | Notifications | ✅ Yes |
| `/admin` | Admin Panel | ✅ Admin only |

---

## 🌍 Internationalization (i18n)

The application supports full bilingual operation:

- **English (LTR)**: Inter font — language button shows "العربية"
- **Arabic (RTL)**: Cairo font, full layout mirror — language button shows "English"

Language preference is **persisted in `localStorage`**. The switcher is in the header on every page.

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User profile data (name, phone, bio, role) |
| `services` | Clinic treatment catalogue (EN + AR) |
| `bookings` | Client appointment records |
| `gallery` | Before/after media (EN + AR) |
| `notifications` | User notification records |
| `experiences` | Client reviews & testimonials |

All tables have **Row-Level Security (RLS)** enabled.

---

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build locally
```

---

## 🔐 Security

- ✅ Row-Level Security (RLS) enabled on all Supabase tables
- ✅ All secrets in environment variables — never hardcoded
- ✅ JWT-based session management via Supabase Auth
- ✅ Profile updates field-whitelisted (cannot modify `role`)
- ✅ Sentry with `sendDefaultPii: false` and masked inputs
- ✅ `.env.local` and `.claude/settings.json` excluded from git

---

## 📋 Changelog

### v1.2.0 — 2026-04-20

- Admin panel: full CRUD for services + booking status management
- Sentry: error tracking, session replay, ErrorBoundary
- Security: env vars for all secrets, PII disabled, profile whitelist
- Performance: React.lazy() code splitting, lazy image loading
- SEO: Open Graph, Twitter Card, meta tags
- Fixes: logout, language switcher, auth race condition, Firefox min-height

### v1.0.0 — 2026-04-13

- Initial production release
- Bilingual (Arabic + English) with full RTL/LTR support
- Supabase auth + database integration
- All 11 pages implemented
- Luminous Canvas design system

---

## 📄 License

This project is **proprietary** and owned by **Enlyten2 Laser Center**. All rights reserved.

---

*Built for Enlyten2 Laser Center — Experience the Art of Radiance.*
