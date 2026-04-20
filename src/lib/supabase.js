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

// --- NEW ADMIN FUNCTIONS ---

// 1. Storage Upload
export const uploadImage = async (file, bucket = 'clinic-assets') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) return { data: null, error };

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { data: { publicUrl, path: filePath }, error: null };
};

// 2. Patient Directory
export const getAdminProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, bookings(count)')
    .order('created_at', { ascending: false });
  return { data, error };
};

// 3. Gallery Management
export const createGalleryItem = async (item) => {
  const { data, error } = await supabase
    .from('gallery')
    .insert(item)
    .select();
  return { data, error };
};

export const deleteGalleryItem = async (id) => {
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);
  return { error };
};

// 4. Staff/Doctors Management
export const getDoctors = async () => {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name', { ascending: true });
  return { data, error };
};

export const createDoctor = async (doctor) => {
  const { data, error } = await supabase
    .from('doctors')
    .insert(doctor)
    .select();
  return { data, error };
};

export const updateDoctor = async (id, updates) => {
  const { data, error } = await supabase
    .from('doctors')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteDoctor = async (id) => {
  const { error } = await supabase
    .from('doctors')
    .delete()
    .eq('id', id);
  return { error };
};

// 5. Holidays & Blocking
export const getHolidays = async () => {
  const { data, error } = await supabase
    .from('holidays')
    .select('*')
    .order('holiday_date', { ascending: true });
  return { data, error };
};

export const addHoliday = async (holiday) => {
  const { data, error } = await supabase
    .from('holidays')
    .insert(holiday)
    .select();
  return { data, error };
};

export const deleteHoliday = async (id) => {
  const { error } = await supabase
    .from('holidays')
    .delete()
    .eq('id', id);
  return { error };
};

// 6. Experience Moderation
export const getAdminExperiences = async () => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const updateExperienceStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('experiences')
    .update({ status })
    .eq('id', id)
    .select();
  return { data, error };
};
