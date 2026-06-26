// ============================================================
// CyberSiksha — Supabase Auth & Data Sync Module
// ============================================================

// ─── CONFIGURATION ──────────────────────────────────────────
// Supabase credentials are now loaded from config.js (which is gitignored)
// Make sure you have a config.js file in your root folder with:
// const SUPABASE_URL = '...';
// const SUPABASE_ANON_KEY = '...';

// ─── CLIENT ─────────────────────────────────────────────────
let sb = null;          // Supabase client
let currentUser = null; // Current auth user
let userProfile = null; // Profile from profiles table

function isSupabaseConfigured() {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

function initSupabase() {
  if (!isSupabaseConfigured()) {
    console.log('CyberSiksha: Supabase not configured — running in offline mode.');
    return false;
  }
  try {
    const { createClient } = supabase;
    sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('CyberSiksha: Supabase client initialized.');
    return true;
  } catch (e) {
    console.error('Supabase init error:', e);
    return false;
  }
}

// ─── AUTH FUNCTIONS ─────────────────────────────────────────
async function signUp(email, password, displayName) {
  if (!sb) throw new Error('Supabase not configured');
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName }
    }
  });
  if (error) throw error;

  // Check for pending invite codes in URL
  const params = new URLSearchParams(window.location.search);
  const inviteCode = params.get('code') || params.get('invite');
  if (inviteCode && data.user) {
    // Will be processed after email confirmation
    localStorage.setItem('cybersiksha_pending_invite', inviteCode);
  }

  return data;
}

async function signIn(email, password) {
  if (!sb) throw new Error('Supabase not configured');
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = data.user;
  await loadProfile();

  // Process any pending invite code
  const pendingInvite = localStorage.getItem('cybersiksha_pending_invite');
  if (pendingInvite) {
    await joinFamilyByCode(pendingInvite);
    localStorage.removeItem('cybersiksha_pending_invite');
  }

  return data;
}

async function signOut() {
  if (!sb) return;
  await sb.auth.signOut();
  currentUser = null;
  userProfile = null;
}

async function getSession() {
  if (!sb) return null;
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    currentUser = session.user;
    await loadProfile();
  }
  return session;
}

function onAuthStateChange(callback) {
  if (!sb) return;
  sb.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    callback(event, session);
  });
}

// ─── PROFILE FUNCTIONS ──────────────────────────────────────
async function loadProfile() {
  if (!sb || !currentUser) return null;
  const { data, error } = await sb.from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();
  if (!error && data) {
    userProfile = data;
  }
  return userProfile;
}

async function updateProfile(updates) {
  if (!sb || !currentUser) return;
  const { error } = await sb.from('profiles')
    .update(updates)
    .eq('id', currentUser.id);
  if (error) console.error('Profile update error:', error);
}

async function syncProgressToCloud(localState) {
  if (!sb || !currentUser) return;

  // Update profile
  await updateProfile({
    xp: localState.xp,
    streak: localState.streak,
    last_active_date: new Date().toISOString().split('T')[0]
  });

  // Sync completed lessons
  const lessons = Array.from(localState.completedLessons);
  for (const lessonId of lessons) {
    await sb.from('completed_lessons')
      .upsert({
        user_id: currentUser.id,
        lesson_id: lessonId
      }, { onConflict: 'user_id,lesson_id' });
  }
}

async function loadProgressFromCloud() {
  if (!sb || !currentUser) return null;

  // Load profile
  const profile = await loadProfile();

  // Load completed lessons
  const { data: lessons } = await sb.from('completed_lessons')
    .select('lesson_id')
    .eq('user_id', currentUser.id);

  return {
    xp: profile?.xp || 0,
    streak: profile?.streak || 0,
    completedLessons: lessons ? lessons.map(l => l.lesson_id) : []
  };
}

// ─── FAMILY FUNCTIONS ───────────────────────────────────────
async function createFamilyGroup(name) {
  if (!sb || !currentUser) return null;

  // Create group
  const { data: group, error: gErr } = await sb.from('family_groups')
    .insert({ name, created_by: currentUser.id })
    .select()
    .single();
  if (gErr) throw gErr;

  // Add creator as admin
  await sb.from('family_members')
    .insert({
      family_group_id: group.id,
      user_id: currentUser.id,
      role: 'admin'
    });

  return group;
}

async function getMyFamilyGroup() {
  if (!sb || !currentUser) return null;

  const { data: membership } = await sb.from('family_members')
    .select('family_group_id, role, family_groups(*)')
    .eq('user_id', currentUser.id)
    .limit(1)
    .single();

  return membership || null;
}

async function getFamilyMembers(groupId) {
  if (!sb) return [];

  const { data } = await sb.from('family_members')
    .select(`
      user_id,
      role,
      joined_at,
      profiles (
        id, display_name, avatar_initial, xp, streak, last_active_date
      )
    `)
    .eq('family_group_id', groupId);

  return data || [];
}

async function getFamilyMemberLessons(userId) {
  if (!sb) return [];
  const { data } = await sb.from('completed_lessons')
    .select('lesson_id')
    .eq('user_id', userId);
  return data ? data.map(l => l.lesson_id) : [];
}

async function joinFamilyByCode(code) {
  if (!sb || !currentUser) return null;
  const { data, error } = await sb.rpc('join_family_by_code', { code });
  if (error) throw error;
  return data;
}

async function sendFamilyInvite(groupId, email) {
  if (!sb || !currentUser) return;

  // Store invite record
  const { error } = await sb.from('family_invites')
    .insert({
      family_group_id: groupId,
      invited_by: currentUser.id,
      invited_email: email
    });
  if (error) throw error;

  // Generate invite link
  const { data: group } = await sb.from('family_groups')
    .select('invite_code')
    .eq('id', groupId)
    .single();

  const inviteLink = `${window.location.origin}/family?code=${group.invite_code}`;
  return inviteLink;
}

async function checkPendingInvites() {
  if (!sb || !currentUser) return [];
  const { data } = await sb.from('family_invites')
    .select('*, family_groups(name)')
    .eq('invited_email', currentUser.email)
    .eq('status', 'pending');
  return data || [];
}

async function acceptInvite(inviteId, groupId) {
  if (!sb || !currentUser) return;

  // Add to family
  await sb.from('family_members')
    .insert({
      family_group_id: groupId,
      user_id: currentUser.id,
      role: 'member'
    });

  // Mark invite as accepted
  await sb.from('family_invites')
    .update({ status: 'accepted' })
    .eq('id', inviteId);
}
