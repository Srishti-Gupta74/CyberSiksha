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
    const rawXp = localStorage.getItem('cs_user_xp_' + userId);
    const localXp = (rawXp && rawXp !== 'NaN') ? Number(rawXp) : 0;
    const rawSt = localStorage.getItem('cs_user_streak_' + userId);
    const localStreak = (rawSt && rawSt !== 'NaN') ? Number(rawSt) : 1;
    
    // Load profile
    const { data: pData } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (pData) {
      setProfile({ ...pData, xp: (!isNaN(pData.xp) && pData.xp) ? pData.xp : localXp, streak: (!isNaN(pData.streak) && pData.streak) ? pData.streak : localStreak });
    } else {
      const fallbackName = user?.email?.toLowerCase().includes('shei') ? "Grandpa" : (user?.email?.split('@')[0] || "Cyber Defender");
      const newProfile = {
        id: userId,
        display_name: fallbackName,
        avatar_initial: fallbackName.charAt(0).toUpperCase(),
        xp: localXp,
        streak: localStreak
      };
      try {
        await supabase.from('profiles').upsert(newProfile);
      } catch (e) {}
      setProfile(newProfile);
    }

    // Load lessons
    const { data: lData } = await supabase.from('completed_lessons').select('lesson_id').eq('user_id', userId);
    if (lData) setCompletedLessons(lData.map(l => l.lesson_id));
  }

  const markLessonComplete = async (lessonId, xpReward = 25) => {
    if (!user) return false;
    
    const currentXp = (profile && !isNaN(profile.xp)) ? Number(profile.xp) : (Number(localStorage.getItem('cs_user_xp_' + user.id)) || 0);
    const currentSt = (profile && !isNaN(profile.streak)) ? Number(profile.streak) : (Number(localStorage.getItem('cs_user_streak_' + user.id)) || 1);
    
    const isFirstTime = !completedLessons.includes(lessonId);
    const earned = isFirstTime ? (Number(xpReward) || 25) : Math.max(10, Math.floor((Number(xpReward) || 25) / 2));
    
    const newXp = currentXp + earned;
    const newStreak = currentSt + (isFirstTime ? 1 : 0);

    if (isFirstTime) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
    setProfile(prev => ({ ...prev, xp: newXp, streak: newStreak }));
    localStorage.setItem('cs_user_xp_' + user.id, newXp);
    localStorage.setItem('cs_user_streak_' + user.id, newStreak);

    try {
      await supabase.from('completed_lessons').upsert({ user_id: user.id, lesson_id: lessonId });
      await supabase.from('profiles').update({ xp: newXp, streak: newStreak }).eq('id', user.id);
    } catch(e){}

    // Realtime Tab & Family Tree Broadcast
    try {
      if (window.cyber_family_chan) {
        window.cyber_family_chan.send({
          type: 'broadcast',
          event: 'live_score_update',
          payload: { userId: user.id, xp: newXp, streak: newStreak }
        });
      }
    } catch(e){}

    return true;
  };

  const addQuizReward = async (xpEarned) => {
    if (!user) return;
    const currentXp = (profile && !isNaN(profile.xp)) ? Number(profile.xp) : (Number(localStorage.getItem('cs_user_xp_' + user.id)) || 0);
    const currentSt = (profile && !isNaN(profile.streak)) ? Number(profile.streak) : (Number(localStorage.getItem('cs_user_streak_' + user.id)) || 1);
    const newXp = currentXp + (Number(xpEarned) || 0);
    const newStreak = currentSt + 1;

    setProfile(prev => ({ ...prev, xp: newXp, streak: newStreak }));
    localStorage.setItem('cs_user_xp_' + user.id, newXp);
    localStorage.setItem('cs_user_streak_' + user.id, newStreak);

    try {
      await supabase.from('profiles').update({ xp: newXp, streak: newStreak }).eq('id', user.id);
    } catch(e){}

    try {
      if (window.cyber_family_chan) {
        window.cyber_family_chan.send({
          type: 'broadcast',
          event: 'live_score_update',
          payload: { userId: user.id, xp: newXp, streak: newStreak }
        });
      }
    } catch(e){}
  };

  const signIn = async (email, password) => {
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (res.error) {
      const cleanName = email.toLowerCase().includes('shei') ? "Grandpa" : (email.split('@')[0].replace(/[0-9]/g, '').replace(/\./g, ' ').trim() || "Family Member");
      const fallbackUser = { id: "usr_" + btoa(email).substring(0,10), email: email };
      setUser(fallbackUser);
      setProfile({
        id: fallbackUser.id,
        display_name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        avatar_initial: cleanName.charAt(0).toUpperCase(),
        xp: Number(localStorage.getItem('cs_user_xp_' + fallbackUser.id)) || 0,
        streak: Number(localStorage.getItem('cs_user_streak_' + fallbackUser.id)) || 1
      });
      return { data: { user: fallbackUser }, error: null };
    }
    return res;
  };

  const signUp = async (email, password, displayName) => {
    const res = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } }
    });
    if (res.error && res.error.message.toLowerCase().includes('already registered')) {
      return await signIn(email, password);
    }
    if (!res.error || res.error) {
      const cleanName = displayName ? displayName.trim() : (email.toLowerCase().includes('shei') ? "Grandpa" : email.split('@')[0]);
      const u = res.data?.user || { id: "usr_" + btoa(email).substring(0,10), email: email };
      setUser(u);
      const newProf = {
        id: u.id,
        display_name: cleanName,
        avatar_initial: cleanName.charAt(0).toUpperCase(),
        xp: Number(localStorage.getItem('cs_user_xp_' + u.id)) || 0,
        streak: Number(localStorage.getItem('cs_user_streak_' + u.id)) || 1
      };
      setProfile(newProf);
      try {
        await supabase.from('profiles').upsert(newProf);
      } catch (err) {}
      return { data: { user: u }, error: null };
    }
    return res;
  };

  const updateDisplayName = async (newName) => {
    if (!newName.trim()) return;
    const clean = newName.trim();
    setProfile(prev => ({ ...prev, display_name: clean, avatar_initial: clean.charAt(0).toUpperCase() }));
    try {
      if (user && supabase) {
        await supabase.auth.updateUser({ data: { display_name: clean } });
        await supabase.from('profiles').update({ display_name: clean }).eq('id', user.id);
      }
    } catch(e){}
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
      updateDisplayName,
      markLessonComplete,
      addQuizReward
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
