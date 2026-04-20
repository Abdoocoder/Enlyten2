# Supabase Integration Setup Guide

## ✅ Setup Complete

Your Enlyten2 Laser Center application is now fully integrated with Supabase backend and authentication!

---

## Project Credentials

- **Project URL:** https://duxppbunumxjxtatpvyu.supabase.co
- **Project Name:** enlyten2lasercenter
- **Region:** Asia Pacific (Singapore)
- **Organization:** samasoftcode

---

## Database Schema

### Tables Created

1. **profiles** - User profile information
   - Stores: full_name, email, phone, avatar_url, bio, created_at, updated_at

2. **services** - Laser services/offerings
   - Stores: name, description, price, duration_minutes, category, image_url, is_active

3. **bookings** - Customer bookings
   - Stores: user_id, service_id, booking_date, booking_time, status, notes
   - Status values: pending, confirmed, completed, cancelled

4. **gallery** - Image gallery
   - Stores: title, description, image_url, category, order_index

5. **notifications** - User notifications
   - Stores: user_id, title, message, type, is_read

6. **experiences** - Reviews and testimonials
   - Stores: user_id, booking_id, rating, comment, image_url

---

## Files Created/Modified

### New Files Created

- **[.env.local](.env.local)** - Environment variables with Supabase credentials
- **[src/lib/supabase.js](src/lib/supabase.js)** - Supabase client and utility functions
- **[src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx)** - Authentication context provider
- **[src/hooks/useDatabase.js](src/hooks/useDatabase.js)** - Database query hooks

### Files Modified

- **[src/App.jsx](src/App.jsx)** - Wrapped with AuthProvider
- **[src/pages/Auth.jsx](src/pages/Auth.jsx)** - Full sign-in/sign-up implementation
- **[src/pages/Services.jsx](src/pages/Services.jsx)** - Fetches services from Supabase
- **[src/pages/Gallery.jsx](src/pages/Gallery.jsx)** - Fetches gallery from Supabase
- **[src/pages/Profile.jsx](src/pages/Profile.jsx)** - Profile management with updates
- **[src/pages/Booking.jsx](src/pages/Booking.jsx)** - Full booking system
- **[src/pages/Dashboard.jsx](src/pages/Dashboard.jsx)** - User dashboard with bookings
- **[src/components/Layout/Layout.jsx](src/components/Layout/Layout.jsx)** - User menu with logout

---

## Available Hooks

### useServices()
```javascript
const { services, loading, error } = useServices();
```
Fetches all active services from the database.

### useUserBookings(userId)
```javascript
const { bookings, loading, error } = useUserBookings(user.id);
```
Fetches all bookings for a specific user.

### useGallery()
```javascript
const { gallery, loading, error } = useGallery();
```
Fetches all gallery items.

### useExperiences()
```javascript
const { experiences, loading, error } = useExperiences();
```
Fetches all customer experiences/testimonials.

### useNotifications(userId)
```javascript
const { notifications, loading, error } = useNotifications(user.id);
```
Fetches unread notifications for a user.

---

## Available Functions

### Authentication
- `signUp(email, password, fullName)` - Create new account
- `signIn(email, password)` - Sign in user
- `signOut()` - Sign out user
- `getCurrentUser()` - Get current authenticated user

### Profiles
- `getProfile(userId)` - Get user profile
- `updateProfile(userId, updates)` - Update user profile

### Bookings
- `getBookings(userId)` - Get user's bookings
- `createBooking(bookingData)` - Create new booking
- `updateBooking(bookingId, updates)` - Update booking
- `cancelBooking(bookingId)` - Cancel a booking

---

## Authentication Context

Use the `useAuth()` hook to access authentication state:

```javascript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, profile, isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Hello {profile?.full_name}</div>;
};
```

---

## Security Features

✅ Row-Level Security (RLS) enabled on all tables
✅ Policies enforce user data isolation
✅ Email verification via Supabase Auth
✅ JWT-based authentication
✅ Protected booking and profile endpoints

---

## Next Steps
1.  **Seed the database**: Run the `seed_services.sql` script in your Supabase SQL Editor.
2.  **Verify services**: Open the `/services` page to see real database entries.
3.  **Test booking**: Create an appointment; it should now work with real UUIDs.

### 1. Add Sample Data (Optional)
Insert test services and gallery items into your Supabase database via the dashboard.

### 2. Email Configuration
Set up email confirmation for sign-ups in Supabase Dashboard > Auth > Email Templates.

### 3. Environment Variables
The `.env.local` file is already configured. Keep it private and never commit it to git.

### 4. Testing
- Sign up at `/login`
- Browse services at `/services`
- Create a booking at `/book`
- View dashboard at `/dashboard`
- Update profile at `/profile`

### 5. Additional Features to Implement
- Notifications page (fetch and display unread notifications)
- Experiences/reviews section (display testimonials)
- Admin panel for managing services
- Payment integration for booking deposits

---

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` file exists in project root
- Verify environment variables are correctly set
- Restart dev server after adding env variables

### "Auth state not persisting"
- Check browser localStorage is enabled
- Verify Supabase cookies are allowed
- Check network tab for auth requests

### "Bookings not saved"
- Verify user is authenticated
- Check that service_id exists in services table
- Check browser console for detailed error messages

### "RLS Policy Violation"
- Ensure user is properly authenticated
- Check that user_id matches authenticated user
- Review RLS policies in Supabase dashboard

---

## Database Management

Access your database at: https://supabase.co
1. Log in with your account
2. Select the "samasoftcode" organization
3. Open "enlyten2lasercenter" project
4. Use the SQL Editor to manage data

---

## Support

For issues with:
- **Supabase:** https://supabase.com/docs
- **Authentication:** https://supabase.com/docs/guides/auth
- **React:** https://react.dev

