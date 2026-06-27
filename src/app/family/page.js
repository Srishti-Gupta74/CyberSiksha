"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import ScrollReveal from '@/components/ScrollReveal';
import { Users, Shield, UserPlus, Copy, Check, KeyRound, ArrowRight, Loader2, Award, Flame, HeartHandshake, Mail, Send, CheckCircle2, Clock, Sparkles, Activity, ShieldCheck, UserCheck, Lock, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import FamilyLearningAnalytics from '@/components/FamilyLearningAnalytics';

export default function FamilyPage() {
  const { user, profile, guestMode } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [loading, setLoading] = useState(false);
  const [familyGroup, setFamilyGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  
  // Create / Join State
  const [joinCode, setJoinCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Email Invitation Simulation Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRelation, setInviteRelation] = useState('Elder (Grandparent)');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  
  // Family Cyber Incident Loop State (Refined non-gamified data)
  const [incidents, setIncidents] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cs_family_incidents');
      if (saved) {
        try { return JSON.parse(saved); } catch(e){}
      }
    }
    return [
      { id: 1, author: "Grandpa Sharma", avatarTag: "ELDER", incident: "Received suspicious Skype video call alleging CBI Digital Arrest. Disconnected and reported on Chakshu portal.", proof: "Skype ID: cbi_vikram_88", time: "25 mins ago", severity: "CRITICAL VECTOR" },
      { id: 2, author: "Sunita Sharma", avatarTag: "PARENT", incident: "Unverified SMS link claiming SBI reward points expiration. Link blocked via mobile security filter.", proof: "File: sbi-rewards.apk", time: "3 hours ago", severity: "TACTICAL SPAM" },
      { id: 3, author: "Aarav Sharma", avatarTag: "MEMBER", incident: "Electricity utility disconnection threat message received. Verified safe via official portal.", proof: "Sender: +91 9876543210", time: "Yesterday", severity: "MITIGATED THREAT" }
    ];
  });
  const [newIncidentText, setNewIncidentText] = useState("");
  const [incidentProof, setIncidentProof] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState("CRITICAL VECTOR");

  const handlePostIncident = (e) => {
    e.preventDefault();
    if (!newIncidentText.trim()) return;
    const authorName = profile?.display_name || user?.email?.split('@')[0] || "Circle Defender";
    const tag = authorName.toLowerCase().includes('grand') ? "ELDER" : (authorName.toLowerCase().includes('mother') || authorName.toLowerCase().includes('sunita') ? "PARENT" : "DEFENDER");
    const newEntry = {
      id: Date.now(),
      author: authorName,
      avatarTag: tag,
      incident: newIncidentText.trim(),
      proof: incidentProof.trim() || null,
      time: "Just now",
      severity: incidentSeverity
    };
    const updated = [newEntry, ...incidents];
    setIncidents(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cs_family_incidents', JSON.stringify(updated));
    }
    try {
      window.cyber_family_chan?.send({
        type: 'broadcast',
        event: 'live_new_incident',
        payload: { incident: newEntry }
      });
    } catch(err) {}
    setNewIncidentText("");
    setIncidentProof("");
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } });
  };

  // Realtime Supabase Database Sync Bridge across tabs
  useEffect(() => {
    let chan;
    if (supabase) {
      chan = supabase.channel('cyber_family_network');
      chan.on('broadcast', { event: 'live_roster_sync' }, (payload) => {
        if (payload?.payload?.grp) {
          setFamilyGroup(payload.payload.grp);
          if (payload.payload.mems) {
            const canonical = canonicalizeMembers(payload.payload.mems);
            setMembers(canonical);
            localStorage.setItem('cs_global_fam_grp', JSON.stringify(payload.payload.grp));
            localStorage.setItem('cs_global_fam_mem', JSON.stringify(canonical));
          }
        }
      }).on('broadcast', { event: 'live_score_update' }, (payload) => {
        if (payload?.payload?.userId) {
          setMembers(prev => {
            const updated = prev.map(m => {
              if (m.profiles?.id === payload.payload.userId) {
                return {
                  ...m,
                  profiles: {
                    ...m.profiles,
                    xp: payload.payload.xp !== undefined ? payload.payload.xp : (m.profiles?.xp || 0),
                    streak: payload.payload.streak !== undefined ? payload.payload.streak : (m.profiles?.streak || 0)
                  }
                };
              }
              return m;
            });
            localStorage.setItem('cs_global_fam_mem', JSON.stringify(updated));
            return updated;
          });
        }
      }).on('broadcast', { event: 'live_new_incident' }, (payload) => {
        if (payload?.payload?.incident) {
          setIncidents(prev => {
            if (prev.some(x => x.id === payload.payload.incident.id)) return prev;
            const updated = [payload.payload.incident, ...prev];
            localStorage.setItem('cs_family_incidents', JSON.stringify(updated));
            return updated;
          });
        }
      }).subscribe();
      window.cyber_family_chan = chan;
    }
    return () => { if (chan) supabase.removeChannel(chan); };
  }, []);

  const dedupeMembers = (list) => {
    if (!list || !Array.isArray(list)) return [];
    const seenIds = new Set();
    const seenEmails = new Set();
    return list.filter(m => {
      const id = m.profiles?.id;
      const em = m.email ? m.email.toLowerCase() : null;
      if (id && seenIds.has(id)) return false;
      if (em && seenEmails.has(em)) return false;
      if (id) seenIds.add(id);
      if (em) seenEmails.add(em);
      return true;
    });
  };

  const canonicalizeMembers = (list) => {
    return dedupeMembers(list).map(item => {
      const name = item?.profiles?.display_name || item?.email?.split('@')[0] || 'Defender';
      const isGrand = name.toLowerCase().includes('grand') || name.toLowerCase().includes('sharma');
      return {
        ...item,
        relation: item?.relation || (item?.role === 'admin' ? 'Circle Commander' : (isGrand ? 'Protected Elder' : 'Vigilant Defender')),
        profiles: {
          ...item?.profiles,
          display_name: name,
          avatar_initial: (item?.profiles?.avatar_initial || name.charAt(0)).toUpperCase()
        }
      };
    });
  };

  const normalizeRosterForViewer = (list) => {
    const viewerId = user?.id || "u_guest";
    const merged = list.map(item => {
      if (item.profiles?.id === viewerId && profile?.display_name) {
        return {
          ...item,
          profiles: {
            ...item.profiles,
            display_name: profile.display_name,
            avatar_initial: profile.display_name.charAt(0).toUpperCase()
          }
        };
      }
      return item;
    });

    return canonicalizeMembers(dedupeMembers(merged))
      .map((item, index) => ({ item, index }))
      .sort((left, right) => {
        const leftMine = left.item?.profiles?.id === viewerId ? 0 : 1;
        const rightMine = right.item?.profiles?.id === viewerId ? 0 : 1;
        if (leftMine !== rightMine) return leftMine - rightMine;

        const leftAdmin = left.item?.role === 'admin' ? 0 : 1;
        const rightAdmin = right.item?.role === 'admin' ? 0 : 1;
        if (leftAdmin !== rightAdmin) return leftAdmin - rightAdmin;

        return left.index - right.index;
      })
      .map(({ item }) => item);
  };

  useEffect(() => {
    if (!profile?.display_name || !familyGroup || !members.length) return;
    const currentMyName = profile.display_name;
    const isMeElder = currentMyName.toLowerCase().includes('grand') || currentMyName.toLowerCase().includes('sharma') || currentMyName.toLowerCase().includes('ramesh') || user?.email?.toLowerCase().includes('shei');

    const updatedGrpName = isMeElder ? familyGroup.name : `${currentMyName}'s Cyber Circle`;
    const needsGrpUpdate = !isMeElder && familyGroup.name !== updatedGrpName;
    
    let updatedMembers = members;
    let needsMemsUpdate = false;
    const isMeAdmin = !isMeElder;
    
    updatedMembers = members.map(m => {
      const isMeCard = (isMeElder && m.role !== 'admin') || (isMeAdmin && m.role === 'admin');
      if (isMeCard && m.profiles?.display_name !== currentMyName) {
        needsMemsUpdate = true;
        return {
          ...m,
          profiles: {
            ...m.profiles,
            display_name: currentMyName,
            avatar_initial: currentMyName.charAt(0).toUpperCase()
          }
        };
      }
      return m;
    });

    if (needsGrpUpdate || needsMemsUpdate) {
      const updatedGrp = { ...familyGroup, name: updatedGrpName };
      window.setTimeout(() => {
        if (needsGrpUpdate) {
          setFamilyGroup(updatedGrp);
          localStorage.setItem('cs_global_fam_grp', JSON.stringify(updatedGrp));
          const isRealUser = user && !String(user.id).startsWith('usr_') && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
          if (isRealUser && supabase) {
            supabase.from('family_groups').update({ name: updatedGrpName }).eq('id', familyGroup.id).then();
          }
        }
        if (needsMemsUpdate) {
          setMembers(updatedMembers);
          localStorage.setItem('cs_global_fam_mem', JSON.stringify(updatedMembers));
        }
      }, 0);

      try {
        const payload = { grp: updatedGrp, mems: updatedMembers };
        if (window.cyber_family_chan) {
          window.cyber_family_chan.send({ type: 'broadcast', event: 'live_roster_sync', payload });
        } else if (supabase) {
          const tempCh = supabase.channel('cyber_family_network');
          tempCh.subscribe((status) => {
            if (status === 'SUBSCRIBED') tempCh.send({ type: 'broadcast', event: 'live_roster_sync', payload });
          });
        }
      } catch(e){}
    }
  }, [profile?.display_name, familyGroup?.name, members]);

  const syncStorage = (grp, mems) => {
    if (grp) localStorage.setItem(`cs_global_fam_grp`, JSON.stringify(grp));
    if (mems) localStorage.setItem(`cs_global_fam_mem`, JSON.stringify(mems));
    try {
      const payload = { grp, mems };
      if (window.cyber_family_chan) {
        window.cyber_family_chan.send({ type: 'broadcast', event: 'live_roster_sync', payload });
      } else if (supabase) {
        const tempCh = supabase.channel('cyber_family_network');
        tempCh.subscribe((status) => {
          if (status === 'SUBSCRIBED') tempCh.send({ type: 'broadcast', event: 'live_roster_sync', payload });
        });
      }
    } catch(e){}
  };

  const handleRemoveMember = async (memberToRemove) => {
    if (!confirm(`Remove ${memberToRemove.profiles?.display_name || 'this member'} from your cyber circle?`)) return;
    const updated = members.filter(item => item !== memberToRemove);
    setMembers(updated);
    syncStorage(familyGroup, updated);
    try {
      if (supabase && memberToRemove.profiles?.id) {
        await supabase.from('family_members').delete().eq('user_id', memberToRemove.profiles.id);
      }
    } catch(e){}
  };

  const getCanonicalRoster = (currentEmail, currentName) => {
    const myId = user?.id || "u_guest";
    const myName = profile?.display_name || currentName || "Neha";
    
    return [
      {
        role: "admin",
        relation: "Circle Commander",
        email: "neha.commander@gmail.com",
        profiles: {
          id: myName.toLowerCase().includes("grand") ? "cmd_neha" : myId,
          display_name: myName.toLowerCase().includes("grand") ? "Neha (Commander)" : myName,
          avatar_initial: "N",
          xp: 540,
          streak: 12
        }
      },
      {
        role: "member",
        relation: "Protected Elder",
        email: "grandpa.sharma@gmail.com",
        profiles: {
          id: myName.toLowerCase().includes("grand") ? myId : "elder_sharma",
          display_name: "Grandpa Sharma",
          avatar_initial: "G",
          xp: 180,
          streak: 4
        }
      },
      {
        role: "member",
        relation: "Vigilant Defender",
        email: "sunita.sharma@gmail.com",
        profiles: {
          id: "mem_sunita",
          display_name: "Sunita Sharma",
          avatar_initial: "S",
          xp: 320,
          streak: 8
        }
      }
    ];
  };

  const loadFamilyData = async () => {
    setLoading(true);
    const pms = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const inviteCodeParam = pms?.get('code');

    if (guestMode) {
      const savedGroup = localStorage.getItem('cs_global_fam_grp');
      const savedMems = localStorage.getItem('cs_global_fam_mem');
      if (savedGroup && savedMems) {
        try {
          const grp = JSON.parse(savedGroup);
          const mems = normalizeRosterForViewer(JSON.parse(savedMems));
          setFamilyGroup(grp);
          setMembers(mems);
          setLoading(false);
          return;
        } catch(e){}
      }
      const defaultGroup = { id: "mock_fam_1", name: `${profile?.display_name || "Neha"}'s Cyber Circle`, invite_code: "SHIELD88" };
      const defaultMems = normalizeRosterForViewer(getCanonicalRoster(user?.email, profile?.display_name));
      setFamilyGroup(defaultGroup);
      setMembers(defaultMems);
      syncStorage(defaultGroup, defaultMems);
      setLoading(false);
      return;
    }

    if (!user || !supabase) {
      const savedGroup = localStorage.getItem('cs_global_fam_grp');
      const savedMems = localStorage.getItem('cs_global_fam_mem');
      if (savedGroup && savedMems) {
        try {
          setFamilyGroup(JSON.parse(savedGroup));
          setMembers(normalizeRosterForViewer(JSON.parse(savedMems)));
        } catch(e){}
      }
      setLoading(false);
      return;
    }

    try {
      const { data: memberData, error: memberErr } = await supabase
        .from('family_members')
        .select('family_group_id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (memberErr) {
        if (memberErr.code === 'PGRST116') {
          const savedGroup = localStorage.getItem('cs_global_fam_grp');
          if (savedGroup) {
            try {
              const parsed = JSON.parse(savedGroup);
              if (parsed && !String(parsed.id).startsWith('mock')) {
                localStorage.removeItem('cs_global_fam_grp');
                localStorage.removeItem('cs_global_fam_mem');
                setFamilyGroup(null);
                setMembers([]);
              }
            } catch(e){}
          }
          setLoading(false);
          return;
        }
        throw memberErr;
      }

      if (memberData) {
        const { data: groupData, error: groupErr } = await supabase
          .from('family_groups')
          .select('*')
          .eq('id', memberData.family_group_id)
          .single();
        if (groupErr) throw groupErr;

        const { data: membersList, error: membersErr } = await supabase
          .from('family_members')
          .select(`
            role,
            joined_at,
            user_id,
            profiles:user_id (id, display_name, avatar_initial, xp, streak)
          `)
          .eq('family_group_id', memberData.family_group_id);
        if (membersErr) throw membersErr;

        if (groupData && membersList) {
          const localMems = (() => {
            try { return JSON.parse(localStorage.getItem('cs_global_fam_mem')) || []; } catch(e){ return []; }
          })();
          const pendingInvites = localMems.filter(lm => lm.isPending === true);

          const formattedRoster = dedupeMembers(membersList.map(m => ({
            role: m.role,
            isPending: false,
            relation: m.role === 'admin' ? 'Circle Commander' : 'Protected Member',
            profiles: m.profiles || { id: m.user_id, display_name: "Family Defender", avatar_initial: "F", xp: 120, streak: 1 }
          })));

          const dbNames = membersList.map(m => m.profiles?.display_name?.toLowerCase() || '');
          const dbIds = membersList.map(m => m.profiles?.id || '');
          
          const unresolvedPendings = pendingInvites.filter(p => {
            const nameToMatch = p.profiles?.display_name?.toLowerCase() || '';
            const emailPrefix = p.email ? p.email.split('@')[0].toLowerCase() : '';
            const isResolved = dbNames.some(dbName => 
              dbName === nameToMatch || 
              dbName === emailPrefix || 
              dbName.includes(emailPrefix) || 
              emailPrefix.includes(dbName) ||
              dbName.includes('shei')
            ) || dbIds.includes(p.profiles?.id);
            return !isResolved;
          });

          const localOnlyMems = localMems.filter(lm => {
            if (!lm.profiles?.id || lm.isPending) return false;
            return !dbIds.includes(lm.profiles.id);
          });

          const fullRoster = dedupeMembers([...formattedRoster, ...unresolvedPendings, ...localOnlyMems]);
          const viewerRoster = normalizeRosterForViewer(fullRoster);
          setFamilyGroup(groupData);
          setMembers(viewerRoster);
          syncStorage(groupData, viewerRoster);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log("Supabase cloud load:", err.message);
    }
    setLoading(false);
  };

  async function handleCreateFamily() {
    setActionLoading(true);
    setError('');
    try {
      const familyName = `${profile?.display_name || user?.email?.split('@')[0] || 'Demo'}'s Cyber Circle`;
      const generatedCode = "CS" + Math.floor(100000 + Math.random() * 900000).toString(36).toUpperCase();
      
      const isRealUser = user && !String(user.id).startsWith('usr_') && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
      if (isRealUser && !guestMode && supabase) {
        try {
          const { data: existingGroups, error: grpsReadErr } = await supabase
            .from('family_groups')
            .select('*')
            .ilike('invite_code', generatedCode);
          if (grpsReadErr) throw grpsReadErr;

          let targetGroup = existingGroups && existingGroups[0] ? existingGroups[0] : null;

          if (!targetGroup) {
            const { data: newGroup, error: grpErr } = await supabase
              .from('family_groups')
              .insert({ name: familyName, invite_code: generatedCode, created_by: user.id })
              .select()
              .single();
            if (grpErr) throw grpErr;
            if (newGroup) targetGroup = newGroup;
          }

          if (targetGroup) {
            const { data: mems, error: memsReadErr } = await supabase
              .from('family_members')
              .select('*')
              .eq('family_group_id', targetGroup.id)
              .eq('user_id', user.id);
            if (memsReadErr) throw memsReadErr;

            if (!mems || mems.length === 0) {
              await supabase.from('family_members').insert({ family_group_id: targetGroup.id, user_id: user.id, role: 'admin' });
            } else {
              await supabase.from('family_members').update({ role: 'admin' }).eq('family_group_id', targetGroup.id).eq('user_id', user.id);
            }
            await loadFamilyData();
            setActionLoading(false);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            return;
          }
        } catch(e){
          console.log("Supabase create family logic error:", e);
          throw e;
        }
      }

      const newGrp = { id: "mock_grid_88", name: familyName, invite_code: generatedCode };
      const newMems = normalizeRosterForViewer(getCanonicalRoster(user?.email, profile?.display_name));
      setFamilyGroup(newGrp);
      setMembers(newMems);
      syncStorage(newGrp, newMems);
      setActionLoading(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      setError(err?.message || 'Error initializing security circle.');
      setActionLoading(false);
    }
  }

  useEffect(() => {
    loadFamilyData();
  }, [user, guestMode]);

  async function performJoin(activeCode) {
    if (!activeCode) return;
    const savedGroup = localStorage.getItem('cs_global_fam_grp');
    const savedMems = localStorage.getItem('cs_global_fam_mem');
    let currentRoster = savedMems ? JSON.parse(savedMems) : getCanonicalRoster(user?.email, profile?.display_name);

    const elderName = profile?.display_name || "Grandpa Sharma";
    const hasElder = currentRoster.some(c => c.relation?.includes('Elder') || c.profiles?.display_name?.includes('Grand') || c.profiles?.display_name?.includes('Sharma'));
    if (!hasElder) {
      currentRoster.push({
        role: "member",
        relation: "Protected Elder",
        email: user?.email || "grandpa@gmail.com",
        profiles: {
          id: user?.id || "mem_elder_88",
          display_name: elderName,
          avatar_initial: elderName.charAt(0).toUpperCase(),
          xp: profile?.xp || 0,
          streak: profile?.streak || 1
        }
      });
    }

    currentRoster = currentRoster.map(item => ({
      ...item,
      isPending: false,
      joined_at: item.joined_at === "Pending Email Acceptance" ? "Active Defender" : item.joined_at
    }));

    const pms = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const circName = pms?.get('circle') ? decodeURIComponent(pms.get('circle')) : "Neha's Cyber Circle";
    const jGrp = savedGroup ? JSON.parse(savedGroup) : { id: "mock_joined_99", name: circName, invite_code: activeCode };
    
    setFamilyGroup(jGrp);
    const viewerRoster = normalizeRosterForViewer(currentRoster);
    setMembers(viewerRoster);
    syncStorage(jGrp, viewerRoster);
  }

  const handleJoinFamily = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setActionLoading(true);
    setTimeout(() => performJoin(joinCode.trim().toUpperCase()), 600);
  };

  const handleDispatchInvite = async (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setInviteLoading(true);
    setInviteError('');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;

      if (!accessToken) throw new Error('Please sign in again before sending an invite.');

      const response = await fetch('/api/family/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          familyGroupId: familyGroup?.id,
          familyGroupName: familyGroup?.name,
          inviteCode: familyGroup?.invite_code || 'A6B437',
          inviteEmail: inviteEmail.trim(),
          inviteName: inviteName.trim(),
          inviteRelation: inviteRelation,
          inviterName: profile?.display_name || user?.email?.split('@')[0] || 'Neha'
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || 'Failed to send the family invite.');

      if (result?.fallbackEmailInvite) {
        await supabase.auth.signInWithOtp({
          email: inviteEmail.trim(),
          options: { emailRedirectTo: result?.inviteLink || `${window.location.origin}/family?code=${familyGroup?.invite_code || 'A6B437'}` }
        });
      }

      const inviteNote = result?.existingUserInvite
        ? 'Direct join record established for existing authenticated email.'
        : 'Invite dispatched successfully.';

      const updatedMembers = [
        ...members,
        {
          role: "protected",
          joined_at: "Pending Email Acceptance",
          isPending: true,
          relation: inviteRelation,
          email: inviteEmail.trim(),
          profiles: {
            display_name: inviteName.trim(),
            avatar_initial: inviteName.trim().charAt(0).toUpperCase(),
            xp: 0,
            streak: 0
          }
        }
      ];

      const cleanedMembers = normalizeRosterForViewer(updatedMembers);
      setMembers(cleanedMembers);
      syncStorage(familyGroup, cleanedMembers);
      setInviteSuccess(true);
      if (result?.existingUserInvite) setInviteError(inviteNote);
      confetti({ particleCount: 60, spread: 50, colors: ['#3b82f6', '#10b981'] });
    } catch (err) {
      setInviteError(err?.message || 'Unable to send invite right now.');
    } finally {
      setInviteLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (familyGroup?.invite_code) {
      const inviter = encodeURIComponent(profile?.display_name || user?.email?.split('@')[0] || 'Neha');
      const circle = encodeURIComponent(familyGroup.name || "Neha's Cyber Circle");
      const fullLink = `${window.location.origin}/family?code=${familyGroup.invite_code}&inviter=${inviter}&circle=${circle}`;
      navigator.clipboard.writeText(fullLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={36} className="text-cyan-400 animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400">Loading Circle Security Roster...</span>
      </div>
    );
  }

  // State 0: Guest / Invite Onboarding
  if (typeof window !== 'undefined' && window.location.search.includes('code=') && (!user || guestMode)) {
    const pms = new URLSearchParams(window.location.search);
    const invCode = pms.get('code');
    const inviterName = pms.get('inviter') ? decodeURIComponent(pms.get('inviter')) : "Circle Commander";
    const umbrellaName = pms.get('circle') ? decodeURIComponent(pms.get('circle')) : "Protected Cyber Circle";
    const isInvited = invCode && invCode !== 'SHIELD88';

    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center animate-fade-in glass-card border-blue-500/40 bg-slate-950/90 shadow-2xl my-12 rounded-[3rem]">
        <div className="w-20 h-20 bg-blue-500/10 border border-blue-400/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg text-blue-400">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-heading mb-4 text-white tracking-tight">
          {isInvited ? "Circle Clearance Authorization" : "Executive Defense Circle"}
        </h1>
        <p className="text-slate-300 mb-8 max-w-lg mx-auto font-normal text-base leading-relaxed">
          {isInvited 
            ? `${inviterName} has invited you into ${umbrellaName} (Token: ${invCode}). Create your secure credential to initialize real-time scam monitoring.`
            : "Protect your family across all digital touchpoints. Create an executive security circle to monitor scam defense awareness."}
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { isLogin: false } }))}
          className="btn-primary py-5 px-10 text-base font-black inline-flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_35px_rgba(59,130,246,0.4)] hover:scale-105 transition-transform rounded-full"
        >
          <span>{isInvited ? 'Accept Clearance & Initialize' : 'Sign In to Initialize Circle'}</span>
        </button>
      </div>
    );
  }

  // State 1: User is not yet in a circle
  if (!familyGroup) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-fade-in px-4">
        <ScrollReveal>
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/40 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-blue-300 tracking-widest uppercase mb-6">
              <ShieldCheck size={16} className="text-blue-400" /> Executive Security Network
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-heading mb-4 text-white">
              Executive Cyber Circle <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                Unified Family Defense
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg">Connect parents, elders, and family members into a high-security monitoring grid.</p>
          </div>
        </ScrollReveal>

        {error && (
          <div className="bg-rose-500/20 border border-rose-500 text-rose-300 p-4 rounded-2xl mb-8 text-center font-bold text-sm font-mono">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 sm:p-10 border-blue-500/30 bg-slate-900/90 flex flex-col justify-between group hover:border-blue-400 transition-all rounded-[2.5rem] shadow-2xl">
            <div>
              <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/40 rounded-2xl flex items-center justify-center text-blue-400 mb-6 shadow-md">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-bold font-heading mb-3 text-white">Initialize Security Circle</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8 font-normal">
                Establish an executive family security roster. Generate classified cryptographic invite tokens to onboard family defenders.
              </p>
            </div>
            <button 
              onClick={handleCreateFamily}
              disabled={actionLoading}
              className="btn-primary w-full py-5 text-base font-black flex justify-center items-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.4)] cursor-pointer rounded-2xl"
            >
              {actionLoading ? <Loader2 className="animate-spin text-white" /> : <span>Initialize Security Grid</span>}
            </button>
          </div>

          <div className="glass-card p-8 sm:p-10 border-blue-500/30 bg-slate-900/90 flex flex-col justify-between group hover:border-indigo-400 transition-all rounded-[2.5rem] shadow-2xl">
            <div>
              <div className="w-16 h-16 bg-indigo-500/20 border border-indigo-400/40 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-md">
                <KeyRound size={32} />
              </div>
              <h2 className="text-2xl font-bold font-heading mb-3 text-white">Join Existing Circle</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                Did your circle commander issue an access token? Enter the 6-character clearance code below to join their security perimeter.
              </p>
            </div>
            <form onSubmit={handleJoinFamily} className="mt-auto">
              <div className="relative">
                <input 
                  type="text" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SHIELD88"
                  className="w-full bg-slate-950 border border-white/20 rounded-2xl py-4 pl-4 pr-14 text-center text-xl font-mono font-bold tracking-widest uppercase focus:outline-none focus:border-blue-400 text-white transition-all placeholder:text-slate-600"
                  maxLength={8}
                  disabled={actionLoading}
                />
                <button 
                  type="submit"
                  disabled={actionLoading || joinCode.length < 3}
                  className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-xl px-4 font-bold transition-all disabled:opacity-20 flex items-center justify-center shadow-md cursor-pointer"
                >
                  {actionLoading ? <Loader2 className="animate-spin text-white" size={20} /> : <ArrowRight size={20} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Executive Cyber Circle Active
  const isViewerCommander = members[0]?.profiles?.display_name === profile?.display_name || members[0]?.profiles?.id === user?.id || (profile?.display_name && !profile.display_name.toLowerCase().includes('grand'));

  // Render refined executive monogram shield instead of cartoon emoji faces
  const renderMonogramShield = (name, role) => {
    const initial = (name || 'D').charAt(0).toUpperCase();
    const isAdmin = role === 'admin' || (name || '').toLowerCase().includes('neha');
    const isElder = (name || '').toLowerCase().includes('grand') || (name || '').toLowerCase().includes('sharma') || (name || '').toLowerCase().includes('elder');

    if (isAdmin) {
      return (
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center my-2">
          <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 border-2 border-blue-400 flex flex-col items-center justify-center relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
            <span className="text-3xl sm:text-4xl font-black font-heading text-blue-300">{initial}</span>
            <span className="absolute -bottom-2 bg-blue-600 text-white font-mono text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest shadow border border-blue-400">
              COMMANDER
            </span>
          </div>
        </div>
      );
    }
    if (isElder) {
      return (
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center my-2">
          <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-xl"></div>
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-slate-900 via-amber-950 to-slate-950 border-2 border-amber-400 flex flex-col items-center justify-center relative z-10 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            <span className="text-3xl sm:text-4xl font-black font-heading text-amber-300">{initial}</span>
            <span className="absolute -bottom-2 bg-amber-600 text-slate-950 font-mono text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest shadow border border-amber-300">
              ELDER ROSTER
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center my-2">
        <div className="absolute inset-0 bg-emerald-500/15 rounded-2xl blur-xl"></div>
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/50 to-slate-950 border border-emerald-400/60 flex flex-col items-center justify-center relative z-10 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
          <span className="text-3xl sm:text-4xl font-black font-heading text-emerald-300">{initial}</span>
          <span className="absolute -bottom-2 bg-emerald-600 text-white font-mono text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest shadow border border-emerald-400">
            DEFENDER
          </span>
        </div>
      </div>
    );
  };

  const renderMemberCard = (m, isMaster) => {
    const isMe = m.profiles?.id === user?.id;
    const isPending = m.isPending;

    return (
      <div 
        className={`glass-card relative overflow-hidden transition-all duration-300 w-full rounded-[2.5rem] ${
          isMaster 
            ? 'p-8 sm:p-10 max-w-3xl border-blue-500/50 bg-gradient-to-r from-slate-950 via-blue-950/30 to-slate-950 shadow-[0_0_50px_rgba(59,130,246,0.2)]' 
            : isPending 
            ? 'p-6 sm:p-8 border-amber-500/40 bg-slate-950/80 opacity-90' 
            : 'p-6 sm:p-8 border-white/15 hover:border-blue-400/50 bg-slate-950/90 shadow-xl'
        }`}
      >
        <div className={`flex items-center justify-between gap-6 mb-6 ${isMaster ? 'flex-col sm:flex-row text-center sm:text-left' : 'flex-col text-center'}`}>
          <div className={`flex items-center gap-5 ${isMaster ? 'flex-col sm:flex-row' : 'flex-col'}`}>
            {renderMonogramShield(m.profiles?.display_name, m.role)}
            <div className="w-full min-w-0">
              <div className={`flex flex-wrap items-center gap-2.5 ${isMaster ? 'justify-center sm:justify-start' : 'justify-center'}`}>
                <h3 className="text-2xl font-bold font-heading text-white tracking-wide leading-tight">{m.profiles?.display_name || "Family Defender"}</h3>
                {isMaster && <span className="bg-blue-500/20 border border-blue-400/40 text-blue-300 text-[10px] font-mono font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">COMMANDER</span>}
                {isMe && !isMaster && <span className="bg-white/10 border border-white/20 text-slate-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">YOU</span>}
              </div>
              <span className="text-xs text-slate-400 font-mono tracking-wider block mt-1 uppercase truncate">{m.relation || (m.role === 'admin' ? 'Circle Commander' : 'Protected Member')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPending ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-full">
                <Clock size={12} className="animate-spin" /> Pending Acceptance
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3.5 py-1.5 rounded-full">
                <ShieldCheck size={14} /> Active Surveillance
              </span>
            )}

            {m.role !== 'admin' && (
              <button
                onClick={() => {
                  if (!isViewerCommander) {
                    if (confirm(`Leave ${familyGroup?.name || "Security Circle"}?`)) {
                      setFamilyGroup(null);
                      localStorage.removeItem('cs_global_fam_grp');
                      localStorage.removeItem('cs_global_fam_mem');
                      confetti({ particleCount: 70 });
                    }
                  } else {
                    handleRemoveMember(m);
                  }
                }}
                className="w-8 h-8 bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 rounded-xl border border-white/10 font-bold text-xs flex items-center justify-center transition-all cursor-pointer ml-1"
                title={!isViewerCommander ? "Leave Security Circle" : "Remove Member"}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {!isPending ? (
          <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/10 text-center font-mono">
            <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clearance Index</span>
              <span className="text-xl font-bold font-heading text-blue-400 mt-0.5 block">{m.profiles?.xp || 0} PTS</span>
            </div>
            <div className="bg-white/[0.03] p-3.5 rounded-2xl border border-white/5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Defense Streak</span>
              <span className="text-xl font-bold font-heading text-emerald-400 mt-0.5 block">{m.profiles?.streak || 0} Days</span>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-white/10 text-xs text-slate-300 flex flex-col gap-2.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Invite dispatched to: <b className="text-white">{m.email}</b></span>
              <span className="text-blue-400 font-bold hover:underline cursor-pointer" onClick={() => alert("Resent invitation email!")}>Resend</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const commander = members.find(m => m.role === 'admin') || members[0];
  const subMembers = members.filter(m => m !== commander);

  return (
    <div className="max-w-6xl mx-auto pb-44 pt-6 px-4 sm:px-6 animate-fade-in select-none">
      
      {/* Executive Security Perimeter Banner */}
      <div className="p-8 md:p-12 mb-12 rounded-[3rem] border border-blue-500/40 bg-gradient-to-r from-slate-950 via-blue-950/30 to-slate-950 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 px-3.5 py-1 rounded-full text-xs font-mono font-bold text-blue-300 uppercase tracking-widest mb-4">
            <ShieldCheck size={16} className="text-blue-400" /> Security Roster Active
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white mb-2">{familyGroup.name}</h1>
          <p className="text-slate-300 text-sm sm:text-base font-normal">
            Real-time scam clearance monitoring for <span className="text-blue-400 font-bold">{members.length} member{members.length !== 1 && 's'}</span> in your security perimeter.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="bg-slate-950 border border-white/15 p-4 rounded-2xl text-center w-full sm:w-auto shadow-lg font-mono">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Clearance Access Token</span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-blue-400 tracking-widest">{familyGroup.invite_code}</span>
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-white/10 hover:bg-blue-500 hover:text-white text-slate-300 rounded-xl transition-all cursor-pointer"
                title="Copy Token"
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <button 
            onClick={() => {
              setInviteError('');
              setInviteSuccess(false);
              setShowInviteModal(true);
            }}
            className="btn-primary w-full sm:w-auto py-5 px-6 text-sm font-black flex items-center justify-center gap-2 shrink-0 shadow-[0_0_25px_rgba(59,130,246,0.4)] cursor-pointer rounded-2xl"
          >
            <UserPlus size={18} className="text-white" />
            <span>Onboard Member</span>
          </button>
        </div>
      </div>

      {/* Roster Title */}
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white flex items-center gap-3">
          <Shield size={24} className="text-blue-400" />
          <span>Executive Defense Roster</span>
        </h2>
        <span className="text-xs font-mono font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">SURVEILLANCE ONLINE</span>
      </div>

      {/* Executive Roster Grid */}
      <div className="space-y-8 pb-16 mb-16">
        {commander && (
          <div className="flex justify-center">
            {renderMemberCard(commander, true)}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 items-stretch">
          {subMembers.map((sm, idx) => (
            <div key={idx} className="flex flex-col w-full h-full">
              {renderMemberCard(sm, false)}
            </div>
          ))}

          {/* Clean Onboarding Action Card */}
          <div 
            onClick={() => setShowInviteModal(true)}
            className="p-8 rounded-[2.5rem] border border-dashed border-white/20 hover:border-blue-400 bg-slate-950/40 hover:bg-slate-900/80 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-5 min-h-[260px] group shadow-lg"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <UserPlus size={28} />
            </div>
            <div>
              <h4 className="text-xl font-bold font-heading text-white group-hover:text-blue-300">Authorize New Member</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs font-normal">Dispatch encrypted email invitation or share clearance token to protect relatives.</p>
            </div>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/40 px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
              + Add Defender
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Matrix */}
      <FamilyLearningAnalytics members={members} />

      {/* Sleek Command Intercept Section (Inspired by Screenshot 1) */}
      <div className="mb-20 p-8 sm:p-14 rounded-[2.5rem] bg-[#070714] border border-indigo-500/20 shadow-2xl font-mono select-none relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Row */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 px-4 py-2 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase mb-6 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span> THREAT INTEL RECEIVER • CIRCLE DISPATCH
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <h3 className="text-6xl sm:text-8xl font-black font-serif text-white tracking-tight leading-none">
                Command
              </h3>
              <span className="text-6xl sm:text-8xl font-black font-serif italic text-indigo-400 tracking-tight leading-none mt-1 block">
                Intercept
              </span>
              <p className="text-slate-200 font-serif italic text-base sm:text-xl font-semibold mt-4 max-w-lg leading-relaxed">
                Real-time forensic logging and verification of peripheral security breaches.
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end shrink-0 pt-4 lg:pt-0">
              <span className="text-xs sm:text-sm font-mono font-black text-indigo-300 uppercase tracking-widest block mb-1">
                ACTIVE DISPATCHES
              </span>
              <div className="text-7xl sm:text-9xl font-black font-serif text-white leading-none">
                {incidents.length || 128}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-indigo-900/40 my-10"></div>
        </div>

        {/* 2-Column Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Card: Payload Record (6 Cols) */}
          <div className="lg:col-span-6 bg-[#0c0c1e] border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-5 border-b border-indigo-500/20">
              <h4 className="font-serif font-black text-white text-3xl sm:text-4xl">Payload Record</h4>
              <span className="font-mono text-xs sm:text-sm text-indigo-300 font-black tracking-widest uppercase">FORM ID: RX-909</span>
            </div>

            <form onSubmit={handlePostIncident} className="space-y-6">
              <div>
                <label className="text-xs sm:text-sm font-mono font-black text-indigo-300 uppercase tracking-widest block mb-2.5">
                  THREAT SUMMARY
                </label>
                <textarea
                  value={newIncidentText}
                  onChange={e => setNewIncidentText(e.target.value)}
                  placeholder="Describe the interception profile..."
                  rows={4}
                  className="w-full bg-[#070714] border-2 border-indigo-500/30 rounded-2xl p-5 text-sm sm:text-base font-bold text-white focus:border-indigo-400 outline-none resize-none font-sans min-h-[120px] shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs sm:text-sm font-mono font-black text-indigo-300 uppercase tracking-widest block mb-2.5">
                    EVIDENCE IDENTIFIER
                  </label>
                  <input
                    type="text"
                    value={incidentProof}
                    onChange={e => setIncidentProof(e.target.value)}
                    placeholder="EVD-00-XXXX"
                    className="w-full bg-[#070714] border-2 border-indigo-500/30 rounded-2xl p-4 text-sm sm:text-base font-bold text-white font-mono focus:border-indigo-400 outline-none shadow-inner"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-mono font-black text-indigo-300 uppercase tracking-widest block mb-2.5">
                    CLASSIFICATION TIER
                  </label>
                  <select
                    value={incidentSeverity}
                    onChange={e => setIncidentSeverity(e.target.value)}
                    className="w-full bg-[#070714] border-2 border-indigo-500/30 rounded-2xl p-4 text-sm sm:text-base font-bold text-white font-mono focus:border-indigo-400 outline-none shadow-inner cursor-pointer"
                  >
                    <option value="MITIGATED THREAT">Tier 1: Minimal</option>
                    <option value="TACTICAL SPAM">Tier 2: Elevated</option>
                    <option value="CRITICAL VECTOR">Tier 3: Critical</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!newIncidentText.trim()}
                className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-black text-sm sm:text-base uppercase tracking-widest shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-[1.02] cursor-pointer transition-all disabled:opacity-30 pt-5 mt-2"
              >
                BROADCAST DISPATCH
              </button>
            </form>
          </div>

          {/* Right Card: Verified Feed (6 Cols) */}
          <div className="lg:col-span-6 bg-[#0c0c1e] border border-indigo-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-5 border-b border-indigo-500/20">
              <h4 className="font-serif font-black text-white text-3xl sm:text-4xl">Verified Feed</h4>
              <span className="flex items-center gap-2 text-xs sm:text-sm font-mono font-black text-emerald-400 uppercase tracking-widest">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> SYSTEM OPERATIONAL
              </span>
            </div>

            <div className="max-h-[460px] overflow-y-auto space-y-5 pr-2">
              {incidents.map((inc) => (
                <div key={inc.id} className="bg-[#070714] border-2 border-indigo-500/20 rounded-2xl p-6 space-y-4 transition-all hover:border-indigo-500/50 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-serif font-black text-white text-lg sm:text-xl">{inc.author || "Defender A. Vance"}</span>
                    <span className="font-mono font-bold text-xs sm:text-sm text-indigo-300">{inc.time || "08:42:11"}</span>
                  </div>

                  <p className="text-base sm:text-lg text-slate-100 font-sans font-semibold leading-relaxed">
                    {inc.incident}
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t border-indigo-500/20">
                    <span className="bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-xs sm:text-sm px-3 py-1 rounded-lg">
                      REF: {inc.proof || "992-B"}
                    </span>
                    <span className={`font-mono font-black text-xs sm:text-sm tracking-widest uppercase ${
                      inc.severity?.includes('CRITICAL') ? 'text-orange-400' : 'text-indigo-400'
                    }`}>
                      {inc.severity?.includes('CRITICAL') ? 'FLAGGED' : 'VERIFIED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Onboarding Modal */}
      {mounted && showInviteModal && createPortal(
        <div className="fixed inset-0 z-[999999] overflow-y-auto bg-black/85 backdrop-blur-2xl animate-fade-in select-none p-4 sm:p-6 flex">
          <div className="max-w-lg w-full p-8 sm:p-10 relative rounded-[2.5rem] bg-slate-950 border border-blue-500/50 shadow-[0_0_80px_rgba(59,130,246,0.3)] m-auto">
            
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center shadow-lg">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">Authorize Defender</h3>
                  <span className="text-xs text-blue-400 font-mono">Grant security perimeter credentials</span>
                </div>
              </div>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inviteSuccess ? (
              <div className="py-6 text-center animate-fade-in font-mono">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-2xl font-bold font-heading text-white mb-1">Clearance Dispatched!</h4>
                <p className="text-slate-300 text-xs mb-6 font-sans">Encrypted authorization email sent to <b className="text-blue-300">{inviteEmail}</b>.</p>

                <div className="bg-slate-900 border border-white/15 p-4 rounded-2xl text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Direct Access Token URL</span>
                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-white/10 mt-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/family?code=${familyGroup?.invite_code || 'A6B437'}`}
                      className="w-full bg-transparent font-mono text-xs text-blue-300 focus:outline-none select-all"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/family?code=${familyGroup?.invite_code || 'A6B437'}`);
                        alert("Access token copied!");
                      }}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg uppercase tracking-wider shrink-0 cursor-pointer shadow-md"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDispatchInvite} className="space-y-6 font-mono">
                {inviteError && (
                  <div className="bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs font-sans rounded-2xl p-4">
                    {inviteError}
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">Full Legal / Display Name</label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full bg-slate-900 border border-white/20 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">Email Destination</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="w-full bg-slate-900 border border-white/20 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-400 font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">Perimeter Role Classification</label>
                  <select
                    value={inviteRelation}
                    onChange={(e) => setInviteRelation(e.target.value)}
                    className="w-full bg-slate-900 border border-white/20 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-blue-400 font-sans"
                  >
                    <option value="Elder (Grandparent)">Protected Elder (High Priority Target)</option>
                    <option value="Parent">Parent Roster</option>
                    <option value="Spouse">Spouse Roster</option>
                    <option value="Sibling / Teen">Teen / Sibling Roster</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="w-1/3 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition-all cursor-pointer uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="btn-primary flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 uppercase tracking-wider rounded-xl"
                  >
                    {inviteLoading ? <Loader2 size={16} className="text-white animate-spin" /> : <Send size={16} className="text-white" />}
                    <span>{inviteLoading ? 'Authorizing...' : 'Authorize Clearance ➔'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
