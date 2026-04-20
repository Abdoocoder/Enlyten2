import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data: data?.user, error };
};

// Profile functions
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  return { data, error };
};

// Services functions
export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });
  return { data, error };
};

export const getServiceById = async (serviceId) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single();
  return { data, error };
};

// Bookings functions
export const getBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name, price, duration_minutes)')
    .eq('user_id', userId)
    .order('booking_date', { ascending: false });
  return { data, error };
};

export const getBookedSlots = async (date) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('booking_time')
    .eq('booking_date', date)
    .in('status', ['pending', 'confirmed']);
  return { data: data?.map(b => b.booking_time) ?? [], error };
};

export const createBooking = async (booking) => {
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('booking_date', booking.booking_date)
    .eq('booking_time', booking.booking_time)
    .in('status', ['pending', 'confirmed'])
    .limit(1);

  if (existing?.length > 0) {
    return { data: null, error: { message: 'slot_taken' } };
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select();
  return { data, error };
};

export const updateBooking = async (bookingId, updates) => {
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select();
  return { data, error };
};

export const cancelBooking = async (bookingId) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .select();
  return { data, error };
};

// Gallery functions
export const getGallery = async () => {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('order_index', { ascending: true });
  return { data, error };
};

// Notifications functions
export const getNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const markNotificationAsRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select();
  return { data, error };
};

// Experiences functions
export const getExperiences = async () => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*, profiles(full_name, avatar_url)')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createExperience = async (experience) => {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select();
  return { data, error };
};

// Admin functions
export const getAdminBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name, name_ar, price), profiles(full_name, email)')
    .order('booking_date', { ascending: false });
  return { data, error };
};

export const createService = async (service) => {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select();
  return { data, error };
};

export const updateService = async (id, updates) => {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteService = async (id) => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  return { error };
};

export const getAdminServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });
  return { data, error };
};
