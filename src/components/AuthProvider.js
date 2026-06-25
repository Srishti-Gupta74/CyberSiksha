"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setUser(session?.user || null);
          if (session?.user) {
            await loadUserData(session.user.id);
          }
        }
      } catch (err) {
        console.error("Supabase Auth Error:", err.message || err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        await loadUserData(session.user.id);
      } else {
        setProfile(null);
        setCompletedLessons([]);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadUserData(userId) {
    // Load profile
    const { data: pData } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (pData) setProfile(pData);

    // Load lessons
    const { data: lData } = await supabase.from('completed_lessons').select('lesson_id').eq('user_id', userId);
    if (lData) setCompletedLessons(lData.map(l => l.lesson_id));
  }

  const markLessonComplete = async (lessonId, xpReward) => {
    if (!user) return false;
    
    // Add to local state first for instant UI
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      setProfile(prev => ({ ...prev, xp: (prev?.xp || 0) + xpReward }));

      // Push to cloud
      await supabase.from('completed_lessons').upsert({
        user_id: user.id,
        lesson_id: lessonId
      });
      
      await supabase.from('profiles').update({
        xp: (profile?.xp || 0) + xpReward
      }).eq('id', user.id);
      
      return true;
    }
    return false;
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email, password, displayName) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } }
    });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      completedLessons,
      loading,
      signIn,
      signUp,
      signOut,
      markLessonComplete
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
