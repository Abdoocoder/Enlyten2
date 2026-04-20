# CLAUDE.md — Enlyten2 Laser Center

> This file provides complete context for AI assistants (Claude, Gemini, etc.) working on this codebase.
> Read this entire file before making any changes.

---

## 🏢 Project Overview

**Enlyten2 Laser Center** is a luxury bilingual (Arabic + English) web application for a premium laser and skincare clinic. The goal is to deliver a world-class digital experience that matches the clinic's high-end brand identity.

- **Version**: 1.3.0
- **Stack**: React 19 · Vite 8 · Vanilla CSS · Supabase · react-i18next · Sentry
- **Design System**: "Laser Glow" — Apple-inspired logic with pink/orange/purple accents

## 🚦 System Status
- [x] Admin Panel Real-time (Supabase)
- [x] Notification Badge for Pending Bookings
- [x] Sentry Integration (Production Error Tracking)
- [x] Glassmorphism Auth UI
- [x] RTL/Arabic Layout Guard
- [x] SEO Meta Tag Component
- [x] Lazy-loading Architecture
- **Languages**: Arabic (RTL, default for Arab clients) + English (LTR)
- **Supabase Project**: `enlyten2lasercenter` (org: `samasoftcode`, region: ap-southeast-1)
- **Live URL**: [https://enlyten2.vercel.app](https://enlyten2.vercel.app)
- **Error Monitoring**: Sentry (samasoftcode.sentry.io)

---

## 🧭 Architecture & File Map

```
src/
├── App.jsx                    # Root: BrowserRouter + Sentry.ErrorBoundary + AuthProvider + Layout + Routes (all lazy-loaded)
├── main.jsx                   # Entry: Sentry.init() + mounts React + imports i18n
├── i18n.js                    # i18next init: lng from localStorage, sets html[dir]
│
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx         # Shell: Header (Logo, Nav, LangSwitcher, UserMenu) + Footer
│   │   └── Layout.css
│   └── UI/
│       ├── Button/            # variants: 'primary' | 'secondary' | 'ghost'
│       ├── Card/              # variants: 'default' | 'white' | 'tonal'
│       ├── Input/             # standard form input with label + error state
│       └── LanguageSwitcher/  # pill button — toggles EN↔AR, writes to localStorage
│
├── contexts/
│   └── AuthContext.jsx        # useAuth() → { user, profile, isAuthenticated, loading, logout }
│
├── hooks/
│   ├── useDatabase.js         # useServices(), useUserBookings(id), useGallery(),
│   │                          # useExperiences(), useNotifications(id)
│   └── useAuthGuard.js        # Redirect unauthenticated users — shared by Dashboard, Profile, Booking
│
├── lib/
│   └── supabase.js            # createClient() singleton + all DB utility functions
│                              # Admin: getAdminBookings(), getAdminServices(),
│                              # createService(), updateService(), deleteService()
│
├── locales/
│   ├── en.json                # English translations (keys: nav.*, home.*, footer.*, admin.*)
│   └── ar.json                # Arabic translations (same key structure)
│
├── data/
│   └── mockData.json          # Fallback data (company, treatments, gallery, clinics)
│
├── pages/
│   ├── Home.jsx / .css        # Landing page — Hero, Philosophy, Treatments preview
│   ├── Services.jsx / .css    # Full treatment listing from Supabase (React.memo on ServiceTile)
│   ├── Booking.jsx / .css     # 3-step appointment booking form + Supabase insert
│   ├── Gallery.jsx / .css     # Before/After gallery from Supabase
│   ├── Auth.jsx / .css        # Sign in / Sign up (glassmorphism dark design)
│   ├── Dashboard.jsx / .css   # User booking history + KPI row + status management
│   ├── Profile.jsx / .css     # Editable user profile (name, phone, bio) — whitelisted fields only
│   ├── Notifications.jsx/.css # Notification center — mark as read
│   ├── Contact.jsx / .css     # Contact info, map placeholder, form
│   ├── Experience.jsx / .css  # Client journey — protocol steps + philosophy banner
│   └── Admin.jsx / .css       # Admin panel — tabs: Bookings (status toggle) + Services (CRUD)
│
└── styles/
    ├── variables.css          # ALL design tokens (colors, fonts, spacing, radii, shadows)
    └── global.css             # Resets, body, RTL overrides, typography utilities, .error-banner
```

---

## 🎨 Design System — Luminous Canvas

### Color Tokens (`src/styles/variables.css`)

```css
--black: #000000;                      /* Cinematic background */
--light-gray: #f5f5f7;                /* Info section background */
--near-black: #1d1d1f;                /* Primary text on light sections */
--white: #ffffff;

/* Identity - The Laser Glow */
--logo-pink: #FF0057;
--logo-orange: #FF7A00;
--logo-purple: #6A00FF;

/* Roles */
--primary: var(--logo-pink);
--background: var(--white);
--background-dark: var(--black);
--glass-bg: rgba(0, 0, 0, 0.82);
--shadow-card: rgba(0,0,0,0.06) 0px 4px 16px, rgba(0,0,0,0.03) 0px 1px 4px;
```

### Typography

| Context | Font | Variable |
|---|---|---|
| Display / Body (EN) | Inter | `--font-display` / `--font-body` |
| All text (AR) | Cairo | `--font-display-ar` / `--font-body-ar` |

**RTL override** in `global.css`:
```css
:root[dir="rtl"] {
  --font-display: var(--font-display-ar);
  --font-body: var(--font-body-ar);
}
```

### Typography Utility Classes

```css
.hero-headline     /* 56px, weight 600, tight line-height */
.section-headline  /* 40px, weight 600 */
.card-title        /* 28px, weight 400 */
.body-intro        /* 21px, primary body */
.body-medium       /* 17px, standard body */
.label-medium      /* 12px, navigational/labels */
```

### Spacing Scale

```css
--spacing-xs: 4px  --spacing-sm: 8px  --spacing-md: 16px
--spacing-lg: 24px  --spacing-xl: 32px  --spacing-xxl: 48px  --spacing-huge: 64px
```

### Border Radius

```css
--radius-sm: 4px  --radius-md: 8px  --radius-lg: 12px
--radius-xl: 24px  --radius-full: 9999px  --radius-pill: 9999px
```

---

## 🔐 Authentication

**Context**: `src/contexts/AuthContext.jsx`

```js
import { useAuth } from './contexts/AuthContext';
const { user, profile, isAuthenticated, loading, logout, isAdmin } = useAuth();
```

- `logout()` is exposed from AuthContext — clears state immediately, then signs out from Supabase. Use this instead of calling `signOut()` directly.
- `isAdmin` = `profile?.role === 'admin'` — client-side check only. RLS enforces the real security.

**Auth Guard Hook**: `src/hooks/useAuthGuard.js`
```js
import useAuthGuard from '../hooks/useAuthGuard';
useAuthGuard(); // redirects to /login if not authenticated
```

**Supabase functions** (`src/lib/supabase.js`):
```js
signUp(email, password, fullName)
signIn(email, password)
signOut()
getCurrentUser()
getProfile(userId)
updateProfile(userId, { full_name, phone, bio })   // whitelist only — never pass role
getBookings(userId)
createBooking(bookingData)
updateBooking(bookingId, updates)
cancelBooking(bookingId)
// Admin only:
getAdminBookings()
getAdminServices()
createService(data)
updateService(id, data)
deleteService(id)
```

**Protected routes**: `/dashboard`, `/profile`, `/notifications`, `/admin`
Redirect unauthenticated users to `/login`.

---

## ⚡ Performance

- **Code splitting**: All pages except `Home` are `React.lazy()` loaded via `Suspense` in `App.jsx`
- **Lazy images**: `loading="lazy"` on all gallery and service images
- **React.memo**: `ServiceTile` component is memoized
- **useMemo**: derived data (filtered lists, selected service) computed with `useMemo`

---

## 📡 Error Monitoring (Sentry)

Initialized in `src/main.jsx`:

- DSN via `VITE_SENTRY_DSN` env var (never hardcoded)
- `sendDefaultPii: false` — no personal data sent
- Session replay with `maskAllInputs: true`
- `Sentry.ErrorBoundary` wraps the entire app in `App.jsx`
- `Sentry.withProfiler` wraps the App component

---

## 🌍 Internationalization (i18n)

**Setup**: `src/i18n.js` — uses `react-i18next`

### Rules

1. **Never hardcode UI strings** in JSX. Always use `t('key')`.
2. **Every page** must import `useTranslation` and use the `t` function.
3. **Both locale files must stay in sync** (`en.json` and `ar.json` must have identical key structures).
4. The `html` element `dir` attribute is set automatically by `i18n.js` on language change.

### Usage pattern

```jsx
import { useTranslation } from 'react-i18next';

const MyPage = () => {
  const { t } = useTranslation();
  return <h1>{t('page.title')}</h1>;
};
```

### Key Namespaces (flat, no namespacing)

```
nav.*           → Header navigation links, buttons, user menu
home.*          → Home page: hero, philosophy, treatments sections
footer.*        → Footer tagline, social label, copyright
services.*      → Services page
booking.*       → Booking form labels and messages
auth.*          → Sign in / sign up forms
dashboard.*     → Dashboard page
profile.*       → Profile page
notifications.* → Notifications page
contact.*       → Contact page
gallery.*       → Gallery page
experience.*    → Experience page
admin.*         → Admin panel (tabs, columns, modals, filters)
categories.*    → Shared category labels used across Services, Gallery, Admin
```

---

## 🗄️ Database (Supabase)

**Project URL**: `https://duxppbunumxjxtatpvyu.supabase.co`

### Tables

| Table | Key Columns |
|---|---|
| `profiles` | `id`, `full_name`, `email`, `phone`, `avatar_url`, `bio`, `role` |
| `services` | `id`, `name`, `name_ar`, `description`, `description_ar`, `price`, `duration_minutes`, `category`, `is_active` |
| `bookings` | `id`, `user_id`, `service_id`, `booking_date`, `booking_time`, `status`, `notes` |
| `gallery` | `id`, `title`, `title_ar`, `description`, `description_ar`, `image_url`, `category`, `order_index` |
| `notifications` | `id`, `user_id`, `title`, `message`, `type`, `is_read` |
| `experiences` | `id`, `user_id`, `booking_id`, `rating`, `comment`, `image_url` |

### Custom Hooks

```js
import { useServices, useUserBookings, useGallery, useExperiences, useNotifications } from '../hooks/useDatabase';
```

Each hook returns `{ data, loading, error }`.

### RLS Policy — Important

All tables have **Row-Level Security enabled**. Critical rules:

- `profiles`: users can only update their own row; `role` field must be protected by RLS (not writable by users)
- `services`: only `role = 'admin'` can INSERT / UPDATE / DELETE
- `bookings`: users read/write their own bookings only; admins read all
- Other tables: user-scoped reads/writes

### Booking `status` field values
`pending` → `confirmed` → `completed` | `cancelled`

---

## 🚦 Routing

```
/               Home
/services       Treatments catalogue
/book           Booking form
/gallery        Before/After gallery
/login          Auth (sign in / sign up tabs)
/dashboard      Client dashboard (auth required)
/profile        User profile editor (auth required)
/notifications  Notification center (auth required)
/contact        Contact information
/experience     Client journey & protocol
/admin          Admin panel (admin role required)
```

All routes are wrapped in `<Layout>` which includes the persistent Header and Footer.
All routes except `/` are lazy-loaded via `React.lazy()`.

---

## 🖊️ Coding Conventions

### General

- Use **functional components** exclusively (no class components).
- Use **hooks** for all state and side effects.
- Component files use **PascalCase**: `MyComponent.jsx`
- CSS files match component: `MyComponent.css`
- Utility functions live in `src/lib/` or `src/hooks/`.

### CSS

- **Always use design tokens** (`var(--spacing-md)`) — never hardcode pixel values directly in component CSS.
- **Never use Tailwind** or CSS-in-JS. This project uses **Vanilla CSS only**.
- For RTL support, prefer **logical CSS properties**:
  - `margin-inline-start` instead of `margin-left`
  - `padding-inline-end` instead of `padding-right`
  - `inset-inline-end` instead of `right`
  - `inset: 0` instead of `top:0; right:0; bottom:0; left:0`
  - `text-align: start` instead of `text-align: left`
  - `min-height: 0` instead of `min-height: auto` (Firefox compatibility)
- Global utility classes are defined in `global.css` — including `.error-banner`.
- Use `var(--shadow-card)` for card shadows instead of inline multi-layer shadows.

### Imports

Preferred import order:
```js
// 1. React
import React, { useState, useEffect } from 'react';
// 2. Third-party
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
// 3. Internal — contexts/hooks/lib
import { useAuth } from '../contexts/AuthContext';
// 4. Internal — components
import Button from '../components/UI/Button/Button';
// 5. CSS
import './MyPage.css';
```

### State Management

- Local state: `useState`
- Server state / async: custom hooks in `useDatabase.js`
- Global auth state: `AuthContext`
- No Redux or Zustand — keep it simple.

---

## 🧪 Testing & Validation

There is currently **no automated test suite**. Before shipping changes:

1. Run `npm run build` — must complete with **zero errors**.
2. Run `npm run dev` and manually verify:
   - [ ] English (LTR) layout renders correctly — language button shows "العربية"
   - [ ] Arabic (RTL) layout renders correctly — language button shows "English"
   - [ ] Language preference persists after page reload
   - [ ] Auth flow (sign up → sign in → logout) works end to end
   - [ ] Booking form submits without errors (with authenticated user)
   - [ ] Admin panel accessible only with admin role
   - [ ] No console errors or warnings

---

## ⚠️ Critical Rules — Read Before Editing

1. **NEVER commit `.env.local`** — it contains Supabase credentials and Sentry DSN.
2. **NEVER commit `.claude/settings.json`** — it contains MCP access tokens.
3. **NEVER hardcode UI text** in JSX — all strings go through `t('key')`.
4. **NEVER use Tailwind, Bootstrap, or MUI** — this project is Vanilla CSS only.
5. **NEVER break the RTL layout** — test in Arabic after any Layout or CSS change.
6. **NEVER hardcode secrets** (DSN, API keys, tokens) in source files — use `VITE_*` env vars.
7. **NEVER pass `role` to `updateProfile()`** — only `{ full_name, phone, bio }` are allowed.
8. **ALL new pages** must follow the pattern: `PageName.jsx` + `PageName.css`, added to `App.jsx` as `lazy()`.
9. **ALL new i18n keys** must be added to BOTH `en.json` and `ar.json`.
10. **Design tokens only** — do not add raw color hex values or pixel values directly in component CSS.

---

## 🔄 Adding a New Page — Checklist

```
[ ] Create src/pages/NewPage.jsx
[ ] Create src/pages/NewPage.css
[ ] Import and use useTranslation() from react-i18next
[ ] Import NewPage.css in NewPage.jsx
[ ] Add lazy() import in src/App.jsx
[ ] Add route inside <Suspense> in src/App.jsx
[ ] Add translation keys in src/locales/en.json AND src/locales/ar.json
[ ] Test in both English (LTR) and Arabic (RTL)
[ ] Run npm run build — no errors
```

---

## 🔄 Adding a New Translation Key — Checklist

```
[ ] Add key in src/locales/en.json
[ ] Add matching key in src/locales/ar.json (same dot-path, Arabic value)
[ ] Use t('your.key') in the component
[ ] Verify no missing key warnings in dev console
```

---

## 🌐 Environment Variables

```env
VITE_SUPABASE_URL=          # Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Supabase anon/public key
VITE_SENTRY_DSN=            # Sentry DSN for error tracking
```

All must be set in `.env.local` (local) and Vercel Dashboard (production).

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.5 | UI framework |
| `react-dom` | ^19.2.5 | DOM renderer |
| `react-router-dom` | ^7.14.0 | Client-side routing |
| `@supabase/supabase-js` | ^2.103.0 | Backend database & auth |
| `i18next` | ^26.0.4 | i18n core engine |
| `react-i18next` | ^17.0.2 | React bindings for i18next |
| `@sentry/react` | ^9.x | Error monitoring & session replay |
| `vite` | ^8.0.4 | Build tool & dev server |
| `@vitejs/plugin-react-swc` | ^4.3.0 | React fast-refresh via SWC |

---

## 🗓️ Changelog

### v1.2.0 — 2026-04-20

- Admin panel full rewrite: Bookings tab (status toggle) + Services tab (CRUD with modal)
- Sentry integration: error tracking, session replay, ErrorBoundary
- Security hardening: Sentry DSN moved to env var, PII disabled, profile field whitelist
- Performance: React.lazy() code splitting for all pages, lazy image loading
- SEO: Open Graph tags, Twitter Card, meta description in index.html
- Auth fix: logout() now clears state immediately via AuthContext
- Language switcher fix: shows target language name correctly
- useAuthGuard hook: shared auth redirect across Dashboard, Profile, Booking
- RTL audit: logical CSS properties throughout (inset-inline-end, text-align:start, inset:0)
- Firefox fix: min-height:0 instead of min-height:auto

### v1.0.0 — 2026-04-13

- Initial production release
- Bilingual (AR + EN) full RTL/LTR support
- Supabase auth + database integration
- All 11 pages implemented
- Luminous Canvas design system

---

*Last updated: 2026-04-20 | Version: 1.3.0*
