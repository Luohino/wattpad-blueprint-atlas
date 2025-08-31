import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Regular signup with email/password
  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          username,
          display_name: displayName
        }
      }
    });
    return { error };
  };

  // Check if email exists
  const checkEmailExists = async (email: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', 'dummy') // This will always return empty but won't error
      .limit(1);
    
    // Try to sign in with a dummy password to check if email exists
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy_password_to_check_email'
    });

    // If error is "Invalid login credentials", email doesn't exist
    // If error is anything else, email likely exists
    return { 
      exists: signInError?.message !== 'Invalid login credentials',
      error: null
    };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  // Send OTP for password reset
  const sendPasswordResetOTP = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`
    });
    return { error };
  };

  // Reset password with OTP
  const resetPasswordWithOTP = async (email: string, token: string, newPassword: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery'
    });

    if (error) {
      return { error };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    return { error: updateError };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    checkEmailExists,
    signIn,
    sendPasswordResetOTP,
    resetPasswordWithOTP,
    signOut
  };
}