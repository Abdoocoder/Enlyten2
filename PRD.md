# Enlyten2 Laser Center - Product Requirements Document

<PRD>

# Technical Architecture

## System Components

### 1. Frontend Application
- **React 19** single-page application with Vite 8
- **Vanilla CSS** with CSS Custom Properties (Laser Glow design system)
- **React Router DOM v7** for navigation
- **i18next + react-i18next** for bilingual AR/EN support
- **React.lazy + Suspense** for code splitting (all pages except Home)

### 2. Backend Services
- **Supabase** (PostgreSQL + Auth + RLS)
- **Supabase Edge Functions** (Deno runtime) — planned for v1.3
- **Resend API** for transactional email — planned for v1.3

### 3. External Integrations
- **Sentry** (`@sentry/react`) for error monitoring + session replay
- **Vercel** for deployment
- **WhatsApp Business API** — planned for v1.3

---

## Data Models

### Service Model
```json
{
  "id": "uuid",
  "name": "string",
  "name_ar": "string",
  "description": "string",
  "description_ar": "string",
  "category": "enum (Laser | Injectables | Body | Anti-Aging | Skin Care | Hair)",
  "price": "number",
  "duration_minutes": "number",
  "image_url": "string",
  "is_active": "boolean",
  "created_at": "timestamp"
}
```

### Booking Model
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "service_id": "uuid",
  "booking_date": "date",
  "booking_time": "time (HH:MM)",
  "status": "enum (pending | confirmed | completed | cancelled)",
  "notes": "text",
  "created_at": "timestamp"
}
```

### User Profile Model
```json
{
  "id": "uuid",
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "bio": "string",
  "avatar_url": "string",
  "role": "enum (user | admin)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Notification Model
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "string",
  "message": "string",
  "type": "string",
  "is_read": "boolean",
  "created_at": "timestamp"
}
```

---

## Pages & Routes

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Home | No | Landing page — hero, philosophy, services preview |
| `/services` | Services | No | Full service catalog from Supabase |
| `/gallery` | Gallery | No | Before/After gallery |
| `/contact` | Contact | No | Contact info, map, form |
| `/experience` | Experience | No | Client journey & protocol steps |
| `/login` | Auth | No | Sign in / Sign up (glassmorphism dark) |
| `/book` | Booking | Yes* | 3-step booking wizard with availability check |
| `/dashboard` | Dashboard | Yes | Booking history, KPIs, mini chart |
| `/profile` | Profile | Yes | Editable user profile |
| `/notifications` | Notifications | Yes | Notification center |
| `/admin` | Admin | Admin only | Services CRUD + booking status management |

*Unauthenticated users are redirected to `/login?returnTo=/book` and returned after auth.

---

## Features

### Completed (v1.0 – v1.2)
- [x] Bilingual AR/EN with full RTL/LTR support
- [x] Laser Glow design system (Apple-inspired)
- [x] Supabase Auth — sign up, sign in, sign out
- [x] Service catalog with category filtering
- [x] 3-step booking flow with date/time picker
- [x] Booking slot availability check (prevent double-booking)
- [x] Server-side booking conflict guard
- [x] Before/After gallery
- [x] User dashboard with KPI cards and mini activity chart
- [x] Admin panel — Services CRUD + booking status management
- [x] Sentry error monitoring + session replay + ErrorBoundary
- [x] React.lazy code splitting + lazy image loading
- [x] SEO: Open Graph, Twitter Card, meta tags
- [x] useAuthGuard hook with returnTo redirect
- [x] Responsive design (mobile, tablet, desktop)
- [x] Performance: useMemo, React.memo on ServiceTile
- [x] Real-time pending badge in Admin panel header (v1.3)

### Pending (v1.4)
- [ ] Email notification on booking created/confirmed (Resend API)
- [ ] WhatsApp notification to admin on new booking

---

## APIs & Integrations

### Supabase Client (`src/lib/supabase.js`)
```js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

**Exposed functions:**
- Auth: `signUp`, `signIn`, `signOut`, `getCurrentUser`
- Profile: `getProfile`, `updateProfile` (whitelist: `full_name`, `phone`, `bio`)
- Services: `getServices`, `getServiceById`
- Bookings: `getBookings`, `createBooking` (with conflict guard), `updateBooking`, `cancelBooking`, `getBookedSlots`
- Gallery: `getGallery`
- Notifications: `getNotifications`, `markNotificationAsRead`
- Experiences: `getExperiences`, `createExperience`
- Admin: `getAdminBookings`, `getAdminServices`, `createService`, `updateService`, `deleteService`

### Resend API (v1.3)
- Transactional booking emails
- Free tier: 3,000 emails/month
- Edge Function: `send-booking-confirmation`

### WhatsApp API (v1.3)
- Admin number: 077 030 0173
- Triggered on new booking insert via Supabase webhook

---

## Infrastructure

### Environment Variables (`.env.local`)
```
VITE_SUPABASE_URL=https://duxppbunumxjxtatpvyu.supabase.co
VITE_SUPABASE_ANON_KEY=
VITE_SENTRY_DSN=
RESEND_API_KEY=          # v1.3
ADMIN_WHATSAPP=0770300173  # v1.3
```

### Deployment
- **Frontend**: Vercel (auto-deploy from main branch)
- **Database + Auth**: Supabase (ap-southeast-1)
- **Edge Functions**: Supabase (v1.3)
- **Live URL**: https://enlyten2.vercel.app

---

# Development Roadmap

## Phase 1: Core Foundation — Completed (v1.0 – v1.2)
- Project setup, design system, auth, services, booking, dashboard, admin, i18n, Sentry, performance, SEO, RTL audit

## Phase 2: Notifications & Real-time (v1.3)

### Task 14: Email Notifications (Resend)
1. Create Supabase Edge Function `send-booking-confirmation`
2. Add `RESEND_API_KEY` to Supabase secrets
3. Build AR/EN email templates (new booking + status change)
4. Set up database webhook on `bookings` INSERT and UPDATE
5. Deploy and test

### Task 15: WhatsApp Admin Alert
1. Configure WhatsApp Business Cloud API
2. Create Edge Function triggered on new booking
3. Message format: client name, service, date, time
4. Test delivery to 0770300173

### Task 16: Real-time Pending Badge
1. Add badge counter on Bookings tab in Admin panel
2. Supabase Realtime subscription on `bookings` table
3. Optional: toast notification on new booking

---

# Logical Dependency Chain

## Email (Task 14)
`Edge Function setup` → `Resend SDK + API key` → `Email templates (AR/EN)` → `DB webhooks (INSERT + UPDATE)` → `Deploy + test`

## WhatsApp (Task 15)
`WhatsApp Business API setup` → `Edge Function trigger` → `Message template` → `Test delivery`

## Real-time Badge (Task 16)
`Pending count query` → `Badge UI on Admin tab` → `Realtime subscription` → `Optional toast`

---

# Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Emails marked as spam | Verify domain in Resend, configure DKIM/SPF |
| WhatsApp API costs | Use free tier (1,000 conversations/month) |
| RLS policy gaps | Verify policies for all 6 tables before deploy |
| Double-booking race condition | Server-side guard in `createBooking()` |
| Token/secret leakage | `.env.local` and `.claude/settings.json` in `.gitignore` |

---

# Appendix

## Email Template — Client (New Booking)
```
Subject: تم استلام حجزك — {service_name}

عزيزي {patient_name}،

تم استلام طلب حجزك بنجاح!

الخدمة: {service_name}
التاريخ: {date}
الوقت: {time}

سنتواصل معك قريباً لتأكيد الموعد.

مركز Enlyten2 للليزر
077 030 0173
```

## Email Template — Admin (New Booking)
```
New Booking Alert

Patient: {patient_name}
Phone: {phone}
Service: {service_name}
Date: {date}
Time: {time}
Notes: {notes}

Admin Panel: https://enlyten2.vercel.app/admin
```

## WhatsApp Message Format
```
🆕 حجز جديد

العميل: {patient_name}
الخدمة: {service_name}
التاريخ: {date}
الوقت: {time}
الهاتف: {phone}
```

</PRD>
