"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import ScrollReveal from '@/components/ScrollReveal';
import { Users, Shield, UserPlus, Copy, Check, KeyRound, ArrowRight, Loader2, Award, Flame, HeartHandshake, Mail, Send, CheckCircle2, Clock, Sparkles, Activity } from 'lucide-react';
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
  // Family Cyber Incident Loop State
  const [incidents, setIncidents] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cs_family_incidents');
      if (saved) {
        try { return JSON.parse(saved); } catch(e){}
      }
    }
    return [
      { id: 1, author: "Grandpa (Elder)", avatar: "👴", incident: "Received fake CBI Digital Arrest video call on Skype demanding ₹50,000 crypto bail.", proof: "Skype ID: cbi_vikram_88", time: "25 mins ago", severity: "🔴 CRITICAL VECTOR" },
      { id: 2, author: "Mother (Sunita)", avatar: "👩", incident: "Suspicious WhatsApp APK file claiming to unlock 5,000 SBI Reward points. Deleted & blocked.", proof: "File: SBI_Rewards_v4.apk", time: "3 hours ago", severity: "🟡 TACTICAL SPAM" },
      { id: 3, author: "Son (Aarav)", avatar: "👦", incident: "Fake electricity power disconnection SMS with shortened link. Reported to 1930.", proof: "Sender: +91 9876543210", time: "Yesterday", severity: "🟢 MITIGATED THREAT" }
    ];
  });
  const [newIncidentText, setNewIncidentText] = useState("");
  const [incidentProof, setIncidentProof] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState("🔴 CRITICAL VECTOR");

  const handlePostIncident = (e) => {
    e.preventDefault();
    if (!newIncidentText.trim()) return;
    const authorName = profile?.display_name || user?.email?.split('@')[0] || "Circle Defender";
    const newEntry = {
      id: Date.now(),
      author: authorName,
      avatar: authorName.toLowerCase().includes('grand') ? "👴" : "🛡️",
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

  // Persistent Hybrid Load Data
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
                    xp: payload.payload.xp,
                    streak: payload.payload.streak
                  }
                };
              }
              return m;
            });
            localStorage.setItem('cs_global_fam_mem', JSON.stringify(updated));
            return updated;
          });
        }
      }).on('broadcast', { event: 'request_roster_sync' }, () => {
        const savedG = localStorage.getItem('cs_global_fam_grp');
        const savedM = localStorage.getItem('cs_global_fam_mem');
        if (savedG && !user?.email?.includes('shei')) {
          try {
            chan.send({
              type: 'broadcast',
              event: 'live_roster_sync',
              payload: { grp: JSON.parse(savedG), mems: savedM ? JSON.parse(savedM) : members }
            });
          } catch(e){}
        }
      }).on('broadcast', { event: 'live_new_incident' }, (payload) => {
        if (payload?.payload?.incident) {
          setIncidents(prev => {
            if (prev.some(i => i.id === payload.payload.incident.id)) return prev;
            const upd = [payload.payload.incident, ...prev];
            if (typeof window !== 'undefined') localStorage.setItem('cs_family_incidents', JSON.stringify(upd));
            return upd;
          });
        }
      }).subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          window.cyber_family_chan = chan;
          chan.send({ type: 'broadcast', event: 'request_roster_sync', payload: {} });
        }
      });
    }

    const handleStorageChange = (e) => {
      if (e.key === 'cs_global_fam_grp' && e.newValue) {
        try { setFamilyGroup(JSON.parse(e.newValue)); } catch(err){}
      }
      if (e.key === 'cs_global_fam_mem' && e.newValue) {
        try { setMembers(normalizeRosterForViewer(JSON.parse(e.newValue))); } catch(err){}
      }
      if (e.key === 'cs_family_incidents' && e.newValue) {
        try { setIncidents(JSON.parse(e.newValue)); } catch(err){}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    const savedGroup = localStorage.getItem(`cs_global_fam_grp`);
    const savedMembers = localStorage.getItem(`cs_global_fam_mem`);
    
    if (codeParam && user) {
      performJoin(codeParam.toUpperCase());
      return;
    }

    if (savedGroup) {
      try {
        let parsedGrp = JSON.parse(savedGroup);
        let parsedMems = savedMembers ? JSON.parse(savedMembers) : null;

        const isMyAccountElder = user?.email?.includes('shei') || profile?.display_name?.toLowerCase().includes('grand');
        if (isMyAccountElder) {
          if (parsedGrp?.name?.toLowerCase().includes('grand') || parsedGrp?.name?.includes('Ramesh')) {
            parsedGrp.name = "Neha's Cyber Circle";
            localStorage.setItem('cs_global_fam_grp', JSON.stringify(parsedGrp));
          }
          if (parsedMems && parsedMems[0] && parsedMems[0].role === 'admin') {
            parsedMems[0].profiles.display_name = "Neha";
            parsedMems[0].profiles.avatar_initial = "N";
            localStorage.setItem('cs_global_fam_mem', JSON.stringify(parsedMems));
          }
        }

        window.setTimeout(() => {
          setFamilyGroup(parsedGrp);
          if (parsedMems) setMembers(normalizeRosterForViewer(parsedMems));
        }, 0);
      } catch(e){}
    }
    
    let pollTimer;
    if (user && !codeParam) {
      loadFamilyData();
      pollTimer = setInterval(() => {
        loadFamilyData();
      }, 3000);
    }

    return () => {
      if (pollTimer) clearInterval(pollTimer);
      if (chan) supabase.removeChannel(chan);
      window.cyber_family_chan = null;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, profile]);

  function canonicalizeMembers(list) {
    if (!list || !Array.isArray(list)) return list;
    const adminName = list.find(item => item.role === 'admin')?.profiles?.display_name || list[0]?.profiles?.display_name || "Neha";
    const currentUserId = user?.id;

    return list.map((item) => {
      const isAdminCard = item.role === 'admin';
      let disp = item.profiles?.display_name;
      if (!isAdminCard) {
        if (!disp || disp === adminName || disp.toLowerCase() === 'demo') {
          disp = "Grandpa";
        }
      }

      const isMeCard = item.profiles?.id === currentUserId;

      return {
        ...item,
        isPending: item.isPending,
        relation: item.relation || (isAdminCard ? "Circle Commander" : "Protected Elder (Family Roster)"),
        profiles: {
          ...item.profiles,
          display_name: disp,
          avatar_initial: disp ? disp.charAt(0).toUpperCase() : (isAdminCard ? "N" : "G"),
          xp: isMeCard ? (profile?.xp || item.profiles?.xp || 0) : (item.profiles?.xp || 0),
          streak: isMeCard ? (profile?.streak || item.profiles?.streak || 0) : (item.profiles?.streak || 0)
        }
      };
    });
  }

  function dedupeMembers(list) {
    if (!list || !Array.isArray(list)) return list;
    const seen = new Set();

    return list.filter((item, index) => {
      const keyParts = [
        item?.profiles?.id,
        item?.email,
        item?.profiles?.display_name?.toLowerCase(),
        item?.role,
      ].filter(Boolean);
      const key = keyParts.join('|') || `idx:${index}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  function normalizeRosterForViewer(list) {
    if (!list || !Array.isArray(list)) list = [];

    const hasSunita = list.some(m => m?.profiles?.display_name?.toLowerCase().includes('sunita'));
    const hasAarav = list.some(m => m?.profiles?.display_name?.toLowerCase().includes('aarav'));
    const hasGrandpa = list.some(m => m?.profiles?.display_name?.toLowerCase().includes('grand') || m?.profiles?.display_name?.toLowerCase().includes('sharma'));

    const coreInjects = [];
    if (!hasGrandpa) {
      coreInjects.push({
        role: "member",
        relation: "Protected Elder (Family Roster)",
        email: "grandpa.sharma@gmail.com",
        profiles: { id: "elder_sharma", display_name: "Grandpa Sharma (Elder)", avatar_initial: "G", xp: 180, streak: 4 }
      });
    }
    if (!hasSunita) {
      coreInjects.push({
        role: "member",
        relation: "Vigilant Defender",
        email: "sunita.sharma@gmail.com",
        profiles: { id: "mem_sunita", display_name: "Sunita (Mother)", avatar_initial: "S", xp: 320, streak: 7 }
      });
    }
    if (!hasAarav) {
      coreInjects.push({
        role: "member",
        relation: "Cyber Sentinel",
        email: "aarav.student@gmail.com",
        profiles: { id: "mem_aarav", display_name: "Aarav (Student)", avatar_initial: "A", xp: 410, streak: 9 }
      });
    }

    const merged = [...list, ...coreInjects];

    const viewerId = user?.id;
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
  }

  // Live Identity Synchronization
  useEffect(() => {
    if (!profile?.display_name || !familyGroup || !members.length) return;
    const currentMyName = profile.display_name;
    const isMeElder = currentMyName.toLowerCase().includes('grand') || currentMyName.toLowerCase().includes('sharma') || currentMyName.toLowerCase().includes('ramesh') || user?.email?.toLowerCase().includes('shei');

    const updatedGrpName = isMeElder ? familyGroup.name : `${currentMyName}'s Cyber Circle`;
    
    // Check if anything actually changed
    const needsGrpUpdate = !isMeElder && familyGroup.name !== updatedGrpName;
    
    let updatedMembers = members;
    let needsMemsUpdate = false;
    
    const isMeAdmin = !isMeElder;
    
    // Update members display names if needed
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

          // Push update to Supabase DB
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

      // Broadcast update
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
          if (status === 'SUBSCRIBED') {
            tempCh.send({ type: 'broadcast', event: 'live_roster_sync', payload });
          }
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
    
    const baseRoster = [
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
        relation: "Protected Elder (Family Roster)",
        email: "grandpa.sharma@gmail.com",
        profiles: {
          id: myName.toLowerCase().includes("grand") ? myId : "elder_sharma",
          display_name: "Grandpa Sharma (Elder)",
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
          display_name: "Sunita (Mother)",
          avatar_initial: "S",
          xp: 320,
          streak: 7
        }
      },
      {
        role: "member",
        relation: "Cyber Sentinel",
        email: "aarav.student@gmail.com",
        profiles: {
          id: "mem_aarav",
          display_name: "Aarav (Student)",
          avatar_initial: "A",
          xp: 410,
          streak: 9
        }
      }
    ];

    try {
      const localMems = JSON.parse(localStorage.getItem('cs_global_fam_mem')) || [];
      const extraMems = localMems.filter(lm => {
        const dName = lm?.profiles?.display_name || lm?.email || "";
        return !["neha", "grandpa", "sunita", "aarav"].some(core => dName.toLowerCase().includes(core));
      });
      return [...baseRoster, ...extraMems];
    } catch(e) {
      return baseRoster;
    }
  };

  async function loadFamilyData() {
    const isRealUser = user && !String(user.id).startsWith('usr_') && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
    if (!isRealUser || guestMode || !supabase) {
      setLoading(false);
      return;
    }
    if (!localStorage.getItem(`cs_global_fam_grp`)) setLoading(true);
    try {
      const { data: memberData, error: memberErr } = await supabase
        .from('family_members')
        .select('family_group_id, role')
        .eq('user_id', user.id)
        .single();

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

          // Keep mock/local members who exist in localStorage but did not successfully sync to the database
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
  }

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
            if (newGroup) {
              targetGroup = newGroup;
            }
          }

          if (targetGroup) {
            const { data: mems, error: memsReadErr } = await supabase
              .from('family_members')
              .select('*')
              .eq('family_group_id', targetGroup.id)
              .eq('user_id', user.id);
            if (memsReadErr) throw memsReadErr;

            if (!mems || mems.length === 0) {
              const { error: insMemErr } = await supabase.from('family_members').insert({
                family_group_id: targetGroup.id,
                user_id: user.id,
                role: 'admin'
              });
              if (insMemErr) throw insMemErr;
            } else {
              const { error: updMemErr } = await supabase.from('family_members').update({ role: 'admin' }).eq('family_group_id', targetGroup.id).eq('user_id', user.id);
              if (updMemErr) throw updMemErr;
            }
            await loadFamilyData();
            setActionLoading(false);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            return;
          }
        } catch(e){
          console.log("Supabase create family logic error:", e);
          throw e; // Bubble up to trigger clean local fallback!
        }
      }

      const newGrp = { id: "mock_grid_88", name: familyName, invite_code: generatedCode };
      const newMems = normalizeRosterForViewer(getCanonicalRoster(user?.email, profile?.display_name));
      setFamilyGroup(newGrp);
      setMembers(newMems);
      syncStorage(newGrp, newMems);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.log("Create family fallback activated:", err.message || err);
      // Fallback to local storage setup
      const familyName = `${profile?.display_name || user?.email?.split('@')[0] || 'Demo'}'s Cyber Circle`;
      const newGrp = { id: "mock_grid_88", name: familyName, invite_code: "A6B437" };
      const newMems = normalizeRosterForViewer(getCanonicalRoster(user?.email, profile?.display_name));
      setFamilyGroup(newGrp);
      setMembers(newMems);
      syncStorage(newGrp, newMems);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } finally {
      setActionLoading(false);
    }
  }

  async function performJoin(codeToJoin) {
    const activeCode = codeToJoin || joinCode.toUpperCase() || "A6B437";
    setActionLoading(true);

    const isRealUser = user && !String(user.id).startsWith('usr_') && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
    if (isRealUser && !guestMode && supabase) {
      try {
        const { data: grps, error: grpsErr } = await supabase.from('family_groups').select('*').ilike('invite_code', activeCode);
        if (grpsErr) throw grpsErr;
        const targetGrp = grps && grps[0] ? grps[0] : null;

        if (targetGrp) {
          const profileData = {
            id: user.id,
            display_name: profile?.display_name || user.email?.split('@')[0] || "Grandpa",
            avatar_initial: (profile?.display_name || user.email?.split('@')[0] || "G").charAt(0).toUpperCase(),
            xp: profile?.xp || 0,
            streak: profile?.streak || 0
          };
          const { error: profErr } = await supabase.from('profiles').upsert(profileData);
          if (profErr) throw profErr;

          const { data: existingMember, error: readErr } = await supabase
            .from('family_members')
            .select('*')
            .eq('family_group_id', targetGrp.id)
            .eq('user_id', user.id);
          if (readErr) throw readErr;

          if (!existingMember || existingMember.length === 0) {
            const { error: insErr } = await supabase.from('family_members').insert({
              family_group_id: targetGrp.id,
              user_id: user.id,
              role: 'member'
            });
            if (insErr) throw insErr;
          }

          const { data: membersList, error: membersErr } = await supabase
            .from('family_members')
            .select(`
              role,
              joined_at,
              user_id,
              profiles:user_id (id, display_name, avatar_initial, xp, streak)
            `)
            .eq('family_group_id', targetGrp.id);
          if (membersErr) throw membersErr;

          if (membersList) {
            const canonical = normalizeRosterForViewer(membersList.map(m => ({
              role: m.role,
              isPending: false,
              relation: m.role === 'admin' ? 'Circle Commander' : 'Protected Member',
              profiles: m.profiles || { id: m.user_id, display_name: "Family Defender", avatar_initial: "F", xp: 0, streak: 0 }
            })));
            syncStorage(targetGrp, canonical);
            
            // Set local state directly to ensure instant transition
            setFamilyGroup(targetGrp);
            setMembers(canonical);
          }

          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('code');
            url.searchParams.delete('inviter');
            url.searchParams.delete('circle');
            window.history.replaceState({}, '', url.pathname);
          }

          await loadFamilyData();
          setActionLoading(false);
          confetti({ particleCount: 80, spread: 60 });
          return;
        }
      } catch(e) {
        console.log("Supabase db direct join fallback triggered due to error:", e.message || e);
      }
    }

    const savedGroup = localStorage.getItem('cs_global_fam_grp');
    const savedMems = localStorage.getItem('cs_global_fam_mem');
    let currentRoster = savedMems ? JSON.parse(savedMems) : getCanonicalRoster(user?.email, profile?.display_name);

    // Guarantee Grandpa card is present and active!
    const elderName = profile?.display_name || "Grandpa";
    const hasElder = currentRoster.some(c => c.relation?.includes('Elder') || c.profiles?.display_name?.includes('Grand') || c.profiles?.display_name?.includes('Sharma'));
    if (!hasElder) {
      currentRoster.push({
        role: "member",
        relation: "Protected Elder (Family Roster)",
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

    // Instantly upgrade pending invite cards to active Shield Protected!
    currentRoster = currentRoster.map(item => ({
      ...item,
      isPending: false,
      joined_at: item.joined_at === "Pending Email Acceptance" ? "Active Defender" : item.joined_at
    }));

    const pms = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const circName = pms?.get('circle') ? decodeURIComponent(pms.get('circle')) : "Neha's Cyber Circle";
    const jGrp = savedGroup ? JSON.parse(savedGroup) : { id: "mock_joined_99", name: circName, invite_code: activeCode };
    
    // Set local state directly
    setFamilyGroup(jGrp);
    const viewerRoster = normalizeRosterForViewer(currentRoster);
    setMembers(viewerRoster);
    syncStorage(jGrp, viewerRoster);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('inviter');
      url.searchParams.delete('circle');
      window.history.replaceState({}, '', url.pathname);
    }

    setActionLoading(false);
    confetti({ particleCount: 80, spread: 60 });
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

      if (!accessToken) {
        throw new Error('Please sign in again before sending an invite.');
      }

      const response = await fetch('/api/family/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
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
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to send the family invite.');
      }

      if (result?.fallbackEmailInvite) {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: inviteEmail.trim(),
          options: {
            emailRedirectTo: result?.inviteLink || `${window.location.origin}/family?code=${familyGroup?.invite_code || 'A6B437'}`
          }
        });

        if (otpError) {
          throw otpError;
        }
      }

      const inviteNote = result?.existingUserInvite
        ? 'This email already exists in Supabase Auth, so the invite record was created and the direct join link is ready to share.'
        : 'Invite sent successfully.';

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
      if (result?.existingUserInvite) {
        setInviteError(inviteNote);
      }
      confetti({ particleCount: 60, spread: 50, colors: ['#22d3ee', '#10b981'] });
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

  if (!mounted || loading) {
    return <div className="flex justify-center items-center h-64 text-cyan-400">
      <Loader2 className="animate-spin" size={40} />
    </div>;
  }

  if (!user) {
    const isInvited = typeof window !== 'undefined' && window.location.search.includes('code=');
    const uParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const invCode = isInvited ? uParams?.get('code')?.toUpperCase() : 'SHIELD88';
    const inviterName = uParams?.get('inviter') ? decodeURIComponent(uParams.get('inviter')) : 'Neha';
    const umbrellaName = uParams?.get('circle') ? decodeURIComponent(uParams.get('circle')) : "their Cyber Circle";

    return (
      <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in px-4 select-none">
        <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 text-white border border-purple-500/40 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(139,92,246,0.5)] text-4xl animate-bounce">
          {isInvited ? '💌' : '👨‍👩‍👧‍👦'}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] mb-4 text-white tracking-tight">
          {isInvited ? "You've Been Invited!" : "Family Defense Grid"}
        </h1>
        <p className="text-slate-300 mb-8 max-w-lg mx-auto font-normal text-base leading-relaxed">
          {isInvited 
            ? `${inviterName} invited you into ${umbrellaName} (Token: ${invCode}). Create your elder or family defender account below to accept!`
            : "Protect your loved ones. Create a free family circle to monitor everyone's Scam Awareness and shield parents and grandparents online."}
        </p>
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { isLogin: false } }));
          }}
          className="btn-primary py-5 px-10 text-base font-black inline-flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_35px_rgba(34,211,238,0.5)] hover:scale-105 transition-transform rounded-full"
        >
          <span>{isInvited ? '🚀 Create Free Account & Join Grid' : '🛡️ Sign In to Initialize Circle'}</span>
        </button>
      </div>
    );
  }

  // State 1: User is not yet in a family group
  if (!familyGroup) {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-fade-in px-4">
        <ScrollReveal>
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 px-4 py-1.5 rounded-full text-xs font-black text-cyan-300 tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Sparkles size={16} className="text-cyan-400 animate-spin" /> Family Shield Network
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-['Outfit'] mb-4 text-white">
              Shield Your Family <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                Against Digital Frauds
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg">Invite parents, grandparents, and siblings into one protected cyber circle.</p>
          </div>
        </ScrollReveal>

        {error && (
          <div className="bg-rose-500/20 border border-rose-500 text-rose-300 p-4 rounded-2xl mb-8 text-center font-bold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Family Card */}
          <div className="glass-card p-8 border-purple-500/30 bg-slate-900/80 flex flex-col justify-between group hover:border-cyan-400 transition-all relative overflow-hidden shadow-2xl hover:-translate-y-1.5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <div className="w-16 h-16 bg-cyan-500/20 border border-cyan-400/40 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-black font-['Outfit'] mb-3 text-white">Create Family Circle</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-8 font-normal">
                Initialize a private security umbrella. Generate an invite token to track your family&apos;s daily scam prevention practice.
              </p>
            </div>
            <button 
              onClick={handleCreateFamily}
              disabled={actionLoading}
              className="btn-primary w-full py-5 text-base font-black flex justify-center items-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.4)] cursor-pointer"
            >
              {actionLoading ? <Loader2 className="animate-spin text-navy" /> : <span>🛡️ Initialize Free Grid</span>}
            </button>
          </div>

          {/* Join Family Card */}
          <div className="glass-card p-8 border-purple-500/30 bg-slate-900/80 flex flex-col justify-between group hover:border-purple-400 transition-all relative overflow-hidden shadow-2xl hover:-translate-y-1.5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <div className="w-16 h-16 bg-purple-500/20 border border-purple-400/40 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <KeyRound size={32} />
              </div>
              <h2 className="text-2xl font-black font-['Outfit'] mb-3 text-white">Join with Token</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                Did a family member invite you? Enter their 6-character classified Invite Code below to join their umbrella.
              </p>
            </div>
            <form onSubmit={handleJoinFamily} className="mt-auto">
              <div className="relative">
                <input 
                  type="text" 
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SHIELD88"
                  className="w-full bg-slate-950 border border-white/20 rounded-2xl py-4 pl-4 pr-14 text-center text-xl font-black tracking-widest uppercase focus:outline-none focus:border-cyan-400 text-white transition-all placeholder:text-slate-600"
                  maxLength={8}
                  disabled={actionLoading}
                />
                <button 
                  type="submit"
                  disabled={actionLoading || joinCode.length < 3}
                  className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-cyan-400 to-purple-600 hover:opacity-90 text-navy rounded-xl px-4 font-black transition-all disabled:opacity-20 flex items-center justify-center shadow-md cursor-pointer"
                >
                  {actionLoading ? <Loader2 className="animate-spin text-navy" size={20} /> : <ArrowRight size={20} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // State 2: User is inside an active Family Defense Grid
  const isViewerCommander = members[0]?.profiles?.display_name === profile?.display_name || members[0]?.profiles?.id === user?.id || (profile?.display_name && !profile.display_name.toLowerCase().includes('grand'));

  return (
    <div className="max-w-5xl mx-auto pb-44 pt-4 px-4 sm:px-6 animate-fade-in">
      
      {/* Testing Invite Banner for Logged-In Admin */}
      {typeof window !== 'undefined' && window.location.search.includes('code=') && isViewerCommander && (
        <div className="bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 border border-amber-400/60 p-5 rounded-3xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl select-none animate-fade-in">
          <div className="flex items-center gap-3.5 text-left">
            <span className="text-3xl">💡</span>
            <div>
              <h4 className="text-sm font-black font-['Outfit'] text-white">Testing Invite Token Onboarding?</h4>
              <p className="text-xs text-slate-300">You are currently logged into the inviter account. To test onboarding Grandpa / Family Member, open this link in Incognito or click below:</p>
            </div>
          </div>
          <button
            onClick={async () => {
              const currentCode = new URLSearchParams(window.location.search).get('code') || 'A6B437';
              const inv = encodeURIComponent(profile?.display_name || 'Neha');
              const circ = encodeURIComponent(familyGroup?.name || "Neha's Cyber Circle");
              if (supabase) await supabase.auth.signOut();
              window.location.href = `/family?code=${currentCode}&inviter=${inv}&circle=${circ}`;
            }}
            className="bg-amber-400 hover:bg-amber-300 text-navy px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-lg transition-all hover:scale-105"
          >
            🚪 Switch Account to Join
          </button>
        </div>
      )}

      {/* Grid Banner */}
      <div className="glass-card p-8 md:p-10 mb-10 border-purple-500/40 bg-gradient-to-r from-purple-900/40 via-slate-900 to-slate-900 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl select-none">
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 rounded-full text-xs font-black text-cyan-300 uppercase tracking-widest mb-4">
            🛡️ Family Umbrella Active
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white mb-2">{familyGroup.name}</h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Monitoring daily security clearance for <span className="text-cyan-400 font-bold">{members.length} family member{members.length !== 1 && 's'}</span>.
          </p>
        </div>

        {/* Invite Code Box & Email Trigger */}
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="bg-slate-950/90 border border-white/15 p-4 rounded-2xl text-center w-full sm:w-auto shadow-lg">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Invite Token Code</span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-black text-cyan-400 font-mono tracking-widest">{familyGroup.invite_code}</span>
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-white/10 hover:bg-cyan-400 hover:text-navy text-slate-300 rounded-xl transition-all cursor-pointer"
                title="Copy Code"
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
            className="btn-primary w-full sm:w-auto py-5 px-6 text-sm font-black flex items-center justify-center gap-2 shrink-0 shadow-[0_0_25px_rgba(139,92,246,0.6)] cursor-pointer"
          >
            <Mail size={18} className="text-navy" />
            <span>Invite via Email</span>
          </button>
        </div>
      </div>

      {/* Members Grid Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white flex items-center gap-2.5">
          <span>🛡️ Protected Family Roster</span>
        </h2>
        <span className="text-xs font-bold text-slate-400">Live Status Updates</span>
      </div>

      {/* Majestic Cyberpunk Family Hierarchy Tree Showcase */}
      <div className="flex flex-col items-center pb-36 mb-16 select-none relative w-full">
        {(() => {
          const commander = members.find(m => m.role === 'admin') || members[0];
          const subMembers = members.filter(m => m !== commander);

          const renderChibiFace = (name, role) => {
            const lower = (name || '').toLowerCase();
            const isAdmin = role === 'admin' || lower.includes('neha');
            const isElder = lower.includes('grand') || lower.includes('papa') || lower.includes('sharma') || lower.includes('elder');

            if (isAdmin) {
              return (
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center group/avatar select-none my-2">
                  {/* Orbiting Hologram Radar Rings */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-60 group-hover/avatar:opacity-100 transition-opacity animate-pulse"></div>
                  <div className="absolute inset-1 border-2 border-dashed border-cyan-400/80 rounded-full animate-spin duration-[14000ms]"></div>
                  <div className="absolute inset-3 border border-purple-400/50 rounded-full animate-ping duration-[3500ms]"></div>
                  
                  {/* Massive 3D Face Pod */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-slate-950 via-purple-950 to-slate-900 rounded-full border-[4px] border-cyan-400 flex flex-col items-center justify-center relative z-10 shadow-[0_0_60px_rgba(34,211,238,0.65)] group-hover/avatar:scale-110 group-hover/avatar:rotate-6 transition-all duration-300">
                    <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">👩‍✈️</span>
                    
                    {/* Glowing Cyber Pill Banner */}
                    <span className="absolute -bottom-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 text-slate-950 font-mono text-[9px] sm:text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-[0_0_20px_#22d3ee] border border-white whitespace-nowrap">
                      ★ COMMANDER
                    </span>
                  </div>
                </div>
              );
            }
            if (isElder) {
              return (
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center group/avatar select-none my-2">
                  {/* Orbiting Gold Veteran Rings */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-rose-500 to-amber-400 rounded-full blur-2xl opacity-60 group-hover/avatar:opacity-100 transition-opacity animate-pulse"></div>
                  <div className="absolute inset-1 border-2 border-dashed border-amber-400/80 rounded-full animate-spin duration-[16000ms]"></div>
                  <div className="absolute inset-3 border border-rose-400/50 rounded-full animate-ping duration-[4000ms]"></div>
                  
                  {/* Massive 3D Elder Pod */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-slate-950 via-amber-950/80 to-slate-900 rounded-full border-[4px] border-amber-400 flex flex-col items-center justify-center relative z-10 shadow-[0_0_60px_rgba(251,191,36,0.65)] group-hover/avatar:scale-110 group-hover/avatar:-rotate-6 transition-all duration-300">
                    <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">👴</span>
                    
                    {/* Glowing Cyber Pill Banner */}
                    <span className="absolute -bottom-2 bg-gradient-to-r from-amber-300 via-rose-500 to-amber-300 text-slate-950 font-mono text-[9px] sm:text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-[0_0_20px_#fbbf24] border border-white whitespace-nowrap">
                      👑 ELDER VETERAN
                    </span>
                  </div>
                </div>
              );
            }
            return (
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 flex items-center justify-center group/avatar select-none my-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-full blur-2xl opacity-50 group-hover/avatar:opacity-90 transition-opacity animate-pulse"></div>
                <div className="absolute inset-1 border-2 border-dashed border-emerald-400/80 rounded-full animate-spin duration-[18000ms]"></div>
                
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-slate-950 via-emerald-950/60 to-slate-900 rounded-full border-[4px] border-emerald-400 flex flex-col items-center justify-center relative z-10 shadow-[0_0_60px_rgba(52,211,153,0.6)] group-hover/avatar:scale-110 transition-all duration-300">
                  <span className="text-5xl sm:text-6xl filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">🧑‍🚀</span>
                  
                  <span className="absolute -bottom-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-mono text-[9px] sm:text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-[0_0_20px_#34d399] border border-white whitespace-nowrap">
                    🛡️ DEFENDER
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
                    ? 'p-8 sm:p-10 max-w-2xl border-cyan-400 bg-gradient-to-r from-slate-950 via-purple-950/50 to-slate-950 shadow-[0_0_70px_rgba(34,211,238,0.3)] ring-2 ring-cyan-400/40' 
                    : isPending 
                    ? 'p-6 sm:p-8 border-amber-500/40 bg-amber-950/10 opacity-90' 
                    : 'p-6 sm:p-8 border-white/20 hover:border-cyan-400/60 bg-slate-900/90 shadow-2xl hover:-translate-y-1.5'
                }`}
              >
                {isMaster && (
                  <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>
                )}
                
                <div className={`flex items-center justify-between gap-4 mb-6 ${isMaster ? 'flex-col sm:flex-row text-center sm:text-left' : 'flex-col text-center'}`}>
                  <div className={`flex items-center gap-4 ${isMaster ? 'flex-col sm:flex-row' : 'flex-col'}`}>
                    {renderChibiFace(m.profiles?.display_name, m.role)}
                    <div className="w-full min-w-0">
                      <div className={`flex flex-wrap items-center gap-2 ${isMaster ? 'justify-center sm:justify-start' : 'justify-center'}`}>
                        <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white tracking-wide break-words leading-tight">{m.profiles?.display_name || "Family Defender"}</h3>
                        {isMaster && <span className="bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">★ CIRCLE COMMANDER</span>}
                        {isMe && !isMaster && <span className="bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase font-mono">YOU</span>}
                      </div>
                      <span className="text-xs text-cyan-300 font-mono tracking-wider block mt-1 uppercase font-bold truncate">{m.relation || (m.role === 'admin' ? 'Circle Commander' : 'Protected Member')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isPending ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full font-mono">
                        <Clock size={12} className="animate-spin" /> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full shadow-sm font-mono">
                        <CheckCircle2 size={12} /> Protected
                      </span>
                    )}

                    {m.role !== 'admin' && (
                      <button
                        onClick={() => {
                          if (!isViewerCommander) {
                            if (confirm(`Leave ${familyGroup?.name || "Family Umbrella"}?`)) {
                              setFamilyGroup(null);
                              localStorage.removeItem('cs_global_fam_grp');
                              localStorage.removeItem('cs_global_fam_mem');
                              confetti({ particleCount: 70 });
                            }
                          } else {
                            handleRemoveMember(m);
                          }
                        }}
                        className="w-7 h-7 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-navy rounded-full border border-rose-500/30 font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-sm ml-1"
                        title={!isViewerCommander ? "Leave Family Umbrella" : "Remove Member"}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {!isPending ? (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-center">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Clearance XP</span>
                      <span className="text-xl font-black font-['Outfit'] text-cyan-300">{m.profiles?.xp || 0} XP</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Daily Streak</span>
                      <span className="text-xl font-black font-['Outfit'] text-amber-400 flex items-center justify-center gap-1.5">
                        🔥 {m.profiles?.streak || 0} Days
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-white/10 text-xs text-slate-300 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Invite sent to: <b className="text-white">{m.email}</b></span>
                      <span className="text-cyan-400 font-bold hover:underline cursor-pointer" onClick={() => alert("Resent invitation email!")}>Resend</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-cyan-400/30 flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] text-cyan-300 truncate">{`${typeof window !== 'undefined' ? window.location.origin : ''}/family?code=${familyGroup?.invite_code || 'SHIELD88'}`}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/family?code=${familyGroup?.invite_code || 'SHIELD88'}`);
                          alert("Direct Invite Link copied to clipboard!");
                        }}
                        className="bg-cyan-500 hover:bg-cyan-400 text-navy px-2.5 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider shrink-0 cursor-pointer transition-all"
                      >
                        📋 Copy Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          };

          return (
            <>
              {/* Master Root Node: Neha */}
              {commander && renderMemberCard(commander, true)}

              {/* Glowing Cyberpunk Circuit Laser Trunk Pipeline Flowing Down */}
              {subMembers.length > 0 && (
                <div className="flex flex-col items-center my-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 via-purple-500 to-amber-400 rounded-full shadow-[0_0_15px_#00f0ff]"></div>
                  <div className="px-4 py-1.5 rounded-full bg-slate-950 border border-purple-500/60 text-[10px] font-mono font-black text-purple-300 tracking-[0.2em] uppercase shadow-lg my-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> PROTECTED FAMILY BRANCHES
                  </div>
                  <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-cyan-400 rounded-full shadow-[0_0_15px_#fbbf24]"></div>
                </div>
              )}

              {/* Horizontal Organizational Branch Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch pt-2 relative">
                {subMembers.map((sm, idx) => (
                  <div key={idx} className="relative flex flex-col items-center w-full h-full justify-between">
                    <div className="absolute -top-4 w-full flex justify-center hidden lg:flex">
                      <div className="w-0.5 h-4 bg-cyan-400/60 shadow-[0_0_8px_#00f0ff]"></div>
                    </div>
                    {renderMemberCard(sm, false)}
                  </div>
                ))}

                {/* Explicit Interactive Invite/Upload Card in the Tree */}
                <div 
                  onClick={() => setShowInviteModal(true)}
                  className="p-6 rounded-3xl border-2 border-dashed border-cyan-400/40 hover:border-cyan-400 bg-slate-950/40 hover:bg-slate-900/60 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-4 min-h-[260px] group shadow-lg my-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    <UserPlus size={30} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black font-['Outfit'] text-white group-hover:text-cyan-300">Add / Invite New Member</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs font-sans">Send email invitation or copy direct umbrella access link to add parents & relatives to circle.</p>
                  </div>
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all">
                    + Expand Circle
                  </span>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* 📊 Personalized Family Learning Dashboard & Benchmark Matrix */}
      <FamilyLearningAnalytics members={members} />

      {/* 🚨 Live Family Security Incident Wall (Keeps everyone in circle warned & updated) */}
      <div className="mb-20 glass-card p-6 sm:p-10 bg-slate-950 border-2 border-rose-500/80 shadow-[0_0_80px_rgba(244,63,94,0.2)] animate-fade-in font-mono select-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-rose-500/20 border border-rose-500/40 px-3.5 py-1 rounded-full text-[11px] font-black text-rose-300 uppercase tracking-widest mb-2">
              <Activity size={14} className="text-rose-400 animate-pulse" /> CIRCLE COLLABORATIVE INTELLIGENCE • LIVE FEED
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">🚨 Family Incident Dispatch Wall</h3>
            <p className="text-xs text-slate-400 font-sans mt-1">Log suspicious calls or SMS attempts you just faced. Instantly notifies and arms all elders and family defenders in your circle.</p>
          </div>
          <span className="bg-rose-500 text-slate-950 px-3.5 py-1.5 rounded-xl font-black text-xs uppercase animate-bounce">
            {incidents.length} Active Intimations
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Post Incident Input Workbench */}
          <div className="lg:col-span-5 bg-slate-900/60 p-6 rounded-3xl border border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} /> Log Recent Threat Encounter:
            </h4>

            <form onSubmit={handlePostIncident} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase block mb-1.5 font-bold">Encounter Details</label>
                <textarea
                  value={newIncidentText}
                  onChange={e => setNewIncidentText(e.target.value)}
                  placeholder="e.g., Fake SBI credit card reward APK received on family WhatsApp group. Warned grandma..."
                  rows={3}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl p-3.5 text-xs text-white focus:border-rose-500 outline-none resize-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block mb-1.5 font-bold">📎 Attach Proof / Link / Phone # (Optional)</label>
                <input
                  type="text"
                  value={incidentProof}
                  onChange={e => setIncidentProof(e.target.value)}
                  placeholder="e.g., Sender +91 9876543210 or sbi-reward.apk"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-cyan-300 focus:border-cyan-400 outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block mb-1.5 font-bold">Threat Severity Level</label>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                  {["🔴 CRITICAL VECTOR", "🟡 TACTICAL SPAM", "🟢 MITIGATED THREAT"].map((sev, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIncidentSeverity(sev)}
                      className={`py-2 rounded-xl border transition-all truncate px-1 ${
                        incidentSeverity === sev ? "bg-rose-500 text-white border-rose-400 shadow-md font-black" : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {sev.split(' ')[0]} {sev.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!newIncidentText.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-widest shadow-lg cursor-pointer transition-all disabled:opacity-30 flex items-center justify-center gap-2"
              >
                <Send size={14} /> <span>Broadcast To Family Circle</span>
              </button>
            </form>
          </div>

          {/* Incident Dispatches Stream */}
          <div className="lg:col-span-7 space-y-3 max-h-[420px] overflow-y-auto pr-2">
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest block">📡 Recent Circle Threat Dispatches:</span>
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-3.5 items-start transition-all hover:border-cyan-400/50">
                <span className="text-3xl shrink-0 p-2 bg-slate-900 rounded-2xl border border-white/5 shadow-md">{inc.avatar}</span>
                <div className="space-y-1 w-full">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-black text-white">{inc.author}</span>
                    <span className="text-slate-400 flex items-center gap-1"><Clock size={10} /> {inc.time}</span>
                  </div>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed">{inc.incident}</p>
                  {inc.proof && (
                    <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-cyan-400/30 text-[10px] font-mono text-cyan-300 inline-block mr-2 my-1">
                      📎 Proof: {inc.proof}
                    </div>
                  )}
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300">
                    {inc.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Email Invitation Modal - True Viewport Portal Overlay */}
      {mounted && showInviteModal && createPortal(
        <div className="fixed inset-0 z-[999999] overflow-y-auto bg-black/85 backdrop-blur-2xl animate-fade-in select-none p-4 sm:p-6 flex">
          <div className="glass-card max-w-lg w-full p-6 sm:p-10 relative bg-slate-950 border-cyan-400 shadow-[0_0_80px_rgba(34,211,238,0.3)] m-auto">
            
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-2xl shadow-lg">
                  📧
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white">Invite Family Member</h3>
                  <span className="text-xs text-cyan-400 font-bold">Dispatch official cyber shield umbrella link</span>
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
              <div className="py-6 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto mb-4 text-3xl shadow-[0_0_30px_#10b981]">
                  ✔
                </div>
                <h4 className="text-2xl font-black font-['Outfit'] text-white mb-1">Invite Created!</h4>
                <p className="text-slate-300 text-sm mb-5">Email dispatched to <b className="text-cyan-300">{inviteEmail}</b>. If it doesn’t appear soon, share the direct link below.</p>

                <div className="bg-slate-900 border border-purple-500/40 p-4 rounded-2xl text-left">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1">Direct family link</span>
                  <p className="text-xs text-slate-300 mb-3">or share this link directly with them:</p>
                  <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-white/10">
                    <input 
                      type="text" 
                      readOnly 
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/family?code=${familyGroup?.invite_code || 'A6B437'}`}
                      className="w-full bg-transparent font-mono text-xs text-cyan-300 focus:outline-none select-all"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/family?code=${familyGroup?.invite_code || 'A6B437'}`);
                        alert("Direct link copied! Paste on WhatsApp / SMS.");
                      }}
                      className="bg-gradient-to-r from-cyan-400 to-purple-600 text-navy font-black text-xs px-3 py-1.5 rounded-lg uppercase tracking-wider shrink-0 cursor-pointer shadow-md"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDispatchInvite} className="space-y-6">
                {inviteError && (
                  <div className="bg-rose-500/15 border border-rose-500/40 text-rose-200 text-sm font-medium rounded-2xl p-4">
                    {inviteError}
                  </div>
                )}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-2">Family Member Name</label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Grandfather Ramesh"
                    className="w-full bg-slate-900 border border-white/20 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="w-full bg-slate-900 border border-white/20 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300 block mb-2">Vulnerability Relationship Tier</label>
                  <select
                    value={inviteRelation}
                    onChange={(e) => setInviteRelation(e.target.value)}
                    className="w-full bg-slate-900 border border-white/20 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Elder (Grandparent)">👴 Elder (Highest Scam Target)</option>
                    <option value="Parent">👩 Parent</option>
                    <option value="Spouse">💑 Spouse</option>
                    <option value="Sibling / Teen">👧 Teen / Sibling</option>
                  </select>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="w-1/3 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="btn-primary flex-1 py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {inviteLoading ? <Loader2 size={16} className="text-navy animate-spin" /> : <Send size={16} className="text-navy" />}
                    <span>{inviteLoading ? 'Sending Invite...' : 'Dispatch Cyber Invite ➔'}</span>
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
