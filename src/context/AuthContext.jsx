import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

const AuthContext = createContext(null);


const PROFILES_FIELDS = new Set(['name', 'avatar']);
const STUDENTS_FIELDS = new Set([
  'gpa', 'education_level', 'year_level', 'birthdate', 'location', 'course',
  'is_financially_disadvantaged', 'institution', 'bio', 'skills', 'interests', 'profile_strength'
]);
const ADMINS_FIELDS = new Set(['agency', 'position']);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    const { data: baseProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.warn('Failed to load profile:', profileError.message);
      setProfile(null);
      return;
    }

    const extensionTable = baseProfile.role === 'admin' ? 'admins' : 'students';
    const { data: extension, error: extensionError } = await supabase
      .from(extensionTable)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (extensionError) {
      console.warn(`Failed to load ${extensionTable} row:`, extensionError.message);
      setProfile(baseProfile);
      return;
    }

    setProfile({ ...baseProfile, ...extension });
  }, []);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!isMounted) return;
      setSession(initialSession);
      await loadProfile(initialSession?.user?.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      await loadProfile(newSession?.user?.id);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }, []);

  // Everything in `metadata` is passed as auth metadata; the `handle_new_user`
  // DB trigger (see supabase/migrations/0002_signup_metadata_fields.sql) reads it
  // to populate profiles + students/admins in one shot at insert time. This runs
  // server-side regardless of whether email confirmation delays the session, so
  // registration data is never silently dropped.
  const signUp = useCallback(async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // Routes each field in `updates` to whichever table actually owns it, then
  // merges the result back into the flat `profile` object.
  const updateProfile = useCallback(async (updates) => {
    if (!session?.user?.id || !profile) return { error: new Error('Not signed in') };
    const userId = session.user.id;

    const profilesUpdates = {};
    const extensionUpdates = {};
    for (const [key, value] of Object.entries(updates)) {
      if (PROFILES_FIELDS.has(key)) profilesUpdates[key] = value;
      else if (STUDENTS_FIELDS.has(key) || ADMINS_FIELDS.has(key)) extensionUpdates[key] = value;
    }

    const extensionTable = profile.role === 'admin' ? 'admins' : 'students';
    let merged = { ...profile };
    let lastError = null;

    if (Object.keys(profilesUpdates).length > 0) {
      const { data, error } = await supabase.from('profiles').update(profilesUpdates).eq('user_id', userId).select().single();
      if (error) lastError = error;
      else merged = { ...merged, ...data };
    }

    if (Object.keys(extensionUpdates).length > 0) {
      const { data, error } = await supabase.from(extensionTable).update(extensionUpdates).eq('user_id', userId).select().single();
      if (error) lastError = error;
      else merged = { ...merged, ...data };
    }

    if (!lastError) setProfile(merged);
    return { data: merged, error: lastError };
  }, [session, profile]);

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
