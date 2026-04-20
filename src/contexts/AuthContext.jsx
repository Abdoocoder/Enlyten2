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

        // AuthSessionMissingError = no user logged in, not a real error
        if (userError && userError.name !== 'AuthSessionMissingError') throw userError;

        if (currentUser) {
          setUser(currentUser);
          const { data: profileData } = await getProfile(currentUser.id);
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
          // Set loading to true while fetching the profile for the new session
          setLoading(true);
          const { data: profileData } = await getProfile(session.user.id);
          setProfile(profileData);
          setLoading(false);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const logout = () => {
    // Immediately clear all Supabase session tokens from localStorage
    // This is the critical step — the rest is best-effort
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('sb-'))
        .forEach(key => localStorage.removeItem(key));
    } catch (e) {
      // localStorage might be restricted in some browser environments
    }

    // Fire-and-forget the Supabase network signOut — we don't await it
    // Use 1s timeout so a hanging promise never blocks the UI
    Promise.race([
      supabase.auth.signOut({ scope: 'local' }),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]).catch(() => {});

    // Clear React state immediately
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    logout,
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
