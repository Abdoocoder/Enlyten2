import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser, getProfile } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check current user on mount
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: currentUser, error: userError } = await getCurrentUser();
        
        if (userError) throw userError;
        
        if (currentUser) {
          setUser(currentUser);
          // Fetch user profile
          const { data: profileData, error: profileError } = await getProfile(currentUser.id);
          if (profileError) throw profileError;
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const { data: profileData } = await getProfile(session.user.id);
          setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
