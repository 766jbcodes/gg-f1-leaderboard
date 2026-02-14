import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithOtp: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session: s }, error }) => {
        if (error) logger.error('Auth getSession failed:', error);
        setSession(s);
        setUser(s?.user ?? null);
        setIsLoading(false);
      })
      .catch((err) => {
        logger.error('Auth getSession threw:', err);
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        logger.debug('Auth state:', event);
      }
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOtp = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) logger.error('Auth signInWithOtp failed:', error.message, error);
    return { error: error ?? null };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) logger.error('Auth signOut failed:', error);
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    signInWithOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
