"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Users, UserPlus, KeyRound, Shield, Trophy, Activity, Loader2, Copy, Check, ArrowRight } from 'lucide-react';

export default function FamilyPage() {
  const { user, profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [familyGroup, setFamilyGroup] = useState(null);
  const [members, setMembers] = useState([]);
  
  const [joinCode, setJoinCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      loadFamilyData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadFamilyData = async () => {
    try {
      // 1. Find if user is in a family
      const { data: memberData, error: memberErr } = await supabase
        .from('family_members')
        .select('family_group_id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberErr) throw memberErr;

      if (memberData) {
        // 2. Load group details
        const { data: groupData } = await supabase
          .from('family_groups')
          .select('*')
          .eq('id', memberData.family_group_id)
          .single();
          
        setFamilyGroup(groupData);

        // 3. Load all members in this group with their profiles
        const { data: membersList, error: listErr } = await supabase
          .from('family_members')
          .select(`
            role,
            joined_at,
            profiles:user_id (id, display_name, avatar_initial, xp, streak, last_active_date)
          `)
          .eq('family_group_id', memberData.family_group_id);

        if (listErr) throw listErr;
        setMembers(membersList || []);
      }
    } catch (err) {
      console.error("Error loading family:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFamily = async () => {
    setActionLoading(true);
    setError('');
    try {
      const familyName = `${profile?.display_name || 'My'}'s Family`;
      
      const { data: newGroup, error: groupErr } = await supabase
        .from('family_groups')
        .insert({ name: familyName, created_by: user.id })
        .select()
        .single();
        
      if (groupErr) throw groupErr;

      const { error: memberErr } = await supabase
        .from('family_members')
        .insert({ family_group_id: newGroup.id, user_id: user.id, role: 'admin' });
        
      if (memberErr) throw memberErr;

      await loadFamilyData();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinFamily = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    
    setActionLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.rpc('join_family_by_code', { code: joinCode.trim() });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      await loadFamilyData();
    } catch (err) {
      setError(err.message || "Failed to join family");
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (familyGroup?.invite_code) {
      navigator.clipboard.writeText(familyGroup.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-cyan">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in px-4">
        <div className="w-20 h-20 bg-sky-100 text-sky-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm text-4xl animate-bounce">
          👨‍👩‍👧‍👦
        </div>
        <h1 className="text-3xl font-black font-['Outfit'] mb-3 text-slate-900">Family Safety Group</h1>
        <p className="text-slate-600 mb-8 max-w-md mx-auto font-normal">
          Protect your loved ones. Create a free family circle to track everyone's Scam Awareness and ensure your grandparents and parents stay safe online.
        </p>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl inline-block font-bold shadow-xs text-sm">
          Please Sign In to open your Family Safety Group.
        </div>
      </div>
    );
  }

  // State 1: User is not in a family
  if (!familyGroup) {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-fade-in px-4">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs text-3xl">
            🛡️
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-['Outfit'] mb-2 text-slate-900">Protect Your Family</h1>
          <p className="text-slate-600">Invite your parents or kids to start learning cyber safety together.</p>
        </div>

        {error && (
          <div className="bg-rose/10 border border-rose/30 text-rose p-4 rounded-xl mb-8 text-center font-bold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Family Card */}
          <div className="glass-card p-8 border-slate-200 flex flex-col justify-between group hover:-translate-y-1 transition-all relative overflow-hidden bg-white">
            <div>
              <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <Shield size={28} />
              </div>
              <h2 className="text-2xl font-black font-['Outfit'] mb-3 text-slate-900">Create Family Group</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                Be the guide for your family. Invite your parents, spouse, and kids to ensure everyone is learning how to stay safe from online scams.
              </p>
            </div>
            <button 
              onClick={handleCreateFamily}
              disabled={actionLoading}
              className="btn-primary w-full py-4 text-base font-bold flex justify-center items-center gap-2 shadow-md"
            >
              {actionLoading ? <Loader2 className="animate-spin" /> : "Create Free Group Now"}
            </button>
          </div>

          {/* Join Family Card */}
          <div className="glass-card p-8 border-slate-200 flex flex-col justify-between group hover:-translate-y-1 transition-all relative overflow-hidden bg-white">
            <div>
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform shadow-xs">
                <KeyRound size={28} />
              </div>
              <h2 className="text-2xl font-black font-['Outfit'] mb-3 text-slate-900">Join with Invite Code</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Did someone in your family already create a group? Ask them for the 6-character Invite Code and enter it below.
              </p>
            </div>
            <form onSubmit={handleJoinFamily} className="mt-auto">
              <div className="relative">
                <input 
                  type="text" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit Code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-4 pr-12 text-center text-xl font-black tracking-widest uppercase focus:outline-none focus:border-purple-500 focus:bg-white transition-all placeholder:text-slate-400"
                  maxLength={6}
                  disabled={actionLoading}
                />
                <button 
                  type="submit"
                  disabled={actionLoading || joinCode.length < 3}
                  className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 font-bold transition-all disabled:opacity-50 flex items-center justify-center shadow-xs"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // State 2: User is in a family
  const myRole = members.find(m => m.profiles?.id === user.id)?.role;
  const isAdmin = myRole === 'admin';

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6 md:p-10 mb-8 border-cyan/20 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <Users className="text-cyan" size={28} />
            <h1 className="text-3xl md:text-4xl font-black font-['Outfit']">{familyGroup.name}</h1>
          </div>
          <p className="text-slate-400 text-sm">
            You are a <span className="text-white font-bold capitalize">{myRole}</span> of this family. 
            Protecting {members.length} member{members.length !== 1 && 's'}.
          </p>
        </div>

        {/* Invite Code Box */}
        <div className="bg-navy/80 border border-white/10 p-4 rounded-2xl relative z-10 w-full md:w-auto text-center md:text-left">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Family Invite Code</span>
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-3xl font-black text-cyan tracking-[0.2em]">{familyGroup.invite_code}</span>
            <button 
              onClick={copyToClipboard}
              className={`p-2 rounded-lg transition-all ${copied ? 'bg-emerald/20 text-emerald' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}
              title="Copy Code"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-black font-['Outfit'] flex items-center gap-2">
          <Activity className="text-gold" size={24} /> 
          Family Leaderboard
        </h2>
        {isAdmin && (
          <button 
            onClick={copyToClipboard}
            className="text-sm font-bold text-cyan flex items-center gap-1 hover:text-white transition-colors"
          >
            <UserPlus size={16} /> Invite Member
          </button>
        )}
      </div>

      {/* Member List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.sort((a, b) => (b.profiles?.xp || 0) - (a.profiles?.xp || 0)).map((member, idx) => {
          const prof = member.profiles;
          if (!prof) return null;
          
          const isMe = prof.id === user.id;

          return (
            <div 
              key={prof.id} 
              className={`glass-card p-5 relative overflow-hidden transition-all hover:border-white/20 ${isMe ? 'border-cyan/30 bg-cyan/5' : ''}`}
            >
              {idx === 0 && members.length > 1 && (
                <div className="absolute top-0 right-0 bg-gold text-navy text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-[0_0_10px_rgba(245,158,11,0.5)] z-10">
                  Top Learner
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shrink-0 relative ${
                  isMe ? 'bg-gradient-to-br from-cyan to-blue-500 text-navy' : 'bg-navy border-2 border-white/10 text-white'
                }`}>
                  {prof.avatar_initial}
                  {idx === 0 && members.length > 1 && (
                    <Trophy className="absolute -bottom-2 -right-2 text-gold drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]" size={20} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white truncate">
                      {prof.display_name} {isMe && <span className="text-cyan text-sm">(You)</span>}
                    </h3>
                    {member.role === 'admin' && (
                      <span className="bg-rose/10 text-rose text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-rose/20 shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm font-bold text-emerald">{prof.xp || 0} XP</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <span className="text-gold">🔥</span> {prof.streak || 0} Day Streak
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
