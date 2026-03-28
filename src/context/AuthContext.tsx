'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import mixpanel from '@/src/lib/mixpanelClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshUser = async () => {
    try {
      setError(null);
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial user fetch
    refreshUser();

    // Set up auth state listener
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'PASSWORD_RECOVERY') {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          setError(null);
          if (currentUser && event === 'SIGNED_IN') {
            mixpanel.identify(currentUser.id);
            mixpanel.people.set({
              '$email': currentUser.email,
              'auth_provider': currentUser.app_metadata?.provider || 'email',
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setError(null);
          mixpanel.reset();
        }
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

