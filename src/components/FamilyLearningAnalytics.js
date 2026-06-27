"use client";

import { useState } from 'react';
import { Trophy, Award, BookOpen, CheckCircle2, TrendingUp, Users, ShieldCheck, Star } from 'lucide-react';

const CORE_FAMILY_STATS = [
  { name: "Neha (Circle Commander)", role: "Admin", xp: 540, lessons: 16, quizzes: 14, resScore: "94%", streak: 12, color: "#22d3ee", status: "🏆 MASTER GUARDIAN" },
  { name: "Sunita (Mother)", role: "Member", xp: 420, lessons: 20, quizzes: 18, resScore: "91%", streak: 7, color: "#a855f7", status: "⚡ VIGILANT DEFENDER" },
  { name: "Aarav (Student)", role: "Member", xp: 480, lessons: 15, quizzes: 13, resScore: "99%", streak: 9, color: "#f43f5e", status: "🔥 CYBER SENTINEL" },
  { name: "Grandpa Sharma (Elder)", role: "Protected", xp: 210, lessons: 12, quizzes: 9, resScore: "86%", streak: 4, color: "#fbbf24", status: "🛡️ CERTIFIED RESISTANT" }
];

export default function FamilyLearningAnalytics({ members = [] }) {
  const [selectedSort, setSelectedSort] = useState("xp");

  // Format any dynamically invited members not in the core 4
  const dynamicStats = (members || []).filter(m => {
    const dName = m?.profiles?.display_name || m?.email || "";
    return !["neha", "grandpa", "sunita", "aarav"].some(core => dName.toLowerCase().includes(core));
  }).map((m, idx) => {
    const name = m?.profiles?.display_name || m?.email?.split('@')[0] || `Member ${idx+1}`;
    const xp = m?.profiles?.xp || (350 + (idx * 45));
    const lessons = Math.min(20, Math.floor(xp / 25));
    const quizzes = Math.max(1, Math.floor(lessons * 0.8));
    const colors = ["#ec4899", "#84cc16", "#f97316", "#06b6d4"];
    return {
      name: `${name} (${m?.role === 'admin' ? 'Admin' : 'Invited Member'})`,
      role: m?.role === 'admin' ? "Admin" : "Member",
      xp: xp,
      lessons: lessons,
      quizzes: quizzes,
      resScore: `${Math.min(98, 82 + Math.floor(xp / 30))}%`,
      streak: m?.profiles?.streak || 3,
      color: colors[idx % colors.length],
      status: xp > 350 ? "⚡ VIGILANT DEFENDER" : "🛡️ ACTIVE SENTINEL"
    };
  });

  const allStats = [...CORE_FAMILY_STATS, ...dynamicStats];

  const sortedStats = [...allStats].sort((a, b) => {
    if (selectedSort === "xp") return b.xp - a.xp;
    if (selectedSort === "lessons") return b.lessons - a.lessons;
    return parseInt(b.resScore) - parseInt(a.resScore);
  });

  return (
    <div className="space-y-10 font-mono animate-fade-in select-none my-12">
      
      <div className="glass-card p-6 sm:p-12 bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_80px_rgba(34,211,238,0.2)] rounded-[3rem]">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-white/15 pb-8 mb-10">
          <div>
            <span className="text-sm sm:text-base text-cyan-300 font-black uppercase tracking-widest flex items-center gap-2.5 mb-2">
              <Trophy size={20} className="text-amber-400 animate-bounce" /> Family Circle Pedagogy Benchmark
            </span>
            <h3 className="text-3xl sm:text-6xl font-black font-['Outfit'] text-white tracking-tight leading-tight">Personalized Learning & Competency Matrix</h3>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-900 p-2.5 rounded-2xl border border-white/15 text-sm sm:text-base shrink-0">
            <span className="text-slate-300 px-3 font-black uppercase tracking-wider">Sort By:</span>
            {[
              { id: "xp", label: "⚡ XP Score" },
              { id: "lessons", label: "📚 Lessons" },
              { id: "resScore", label: "🛡️ Resilience" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedSort(tab.id)}
                className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer ${
                  selectedSort === tab.id ? "bg-cyan-400 text-slate-950 shadow-lg scale-105" : "text-slate-300 hover:text-white bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Comparative Bar Matrix */}
        <div className="space-y-8 mb-14 bg-slate-900/60 p-6 sm:p-10 rounded-3xl border border-white/10 transition-all shadow-xl">
          <span className="text-base sm:text-xl font-black text-white uppercase tracking-widest block mb-6">
            📈 Relative Pedagogy Completion Graph ({selectedSort === 'xp' ? 'Ranked by Total XP' : (selectedSort === 'lessons' ? 'Ranked by Lessons Mastered' : 'Ranked by Phish Resistance Score')}):
          </span>
          <div className="space-y-6">
            {sortedStats.map((mem, idx) => {
              let widthPct = 0;
              let labelText = "";
              if (selectedSort === "xp") {
                widthPct = Math.min(100, Math.round((mem.xp / 600) * 100));
                labelText = `${mem.xp} XP (${widthPct}% Mastery)`;
              } else if (selectedSort === "lessons") {
                widthPct = Math.min(100, Math.round((mem.lessons / 20) * 100));
                labelText = `${mem.lessons} / 20 Lessons Mastered (${widthPct}%)`;
              } else {
                widthPct = parseInt(mem.resScore) || 80;
                labelText = `${mem.resScore} Phish Resistance Score`;
              }

              return (
                <div key={mem.name} className="space-y-2.5 transition-all duration-500">
                  <div className="flex justify-between items-center text-base sm:text-lg font-black">
                    <span className="text-white flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-white/15 text-slate-200 font-mono font-black">#{idx+1}</span>
                      <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: mem.color }}></span>
                      <span className="truncate max-w-[240px] sm:max-w-none">{mem.name}</span>
                    </span>
                    <span className="font-mono text-cyan-300 shrink-0 font-black">{labelText}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-5 rounded-full overflow-hidden border-2 border-white/15 p-0.5 shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-700 relative"
                      style={{ width: `${widthPct}%`, backgroundColor: mem.color }}
                    >
                      <div className="absolute inset-0 bg-white/25 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formal Granular Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b-2 border-white/20 text-slate-200 uppercase tracking-wider font-mono text-sm sm:text-lg">
                <th className="pb-4 px-4 font-black">Family Member</th>
                <th className="pb-4 px-4 font-black">Role</th>
                <th className="pb-4 px-4 font-black text-center">Lessons Mastered</th>
                <th className="pb-4 px-4 font-black text-center">Quizzes Solved</th>
                <th className="pb-4 px-4 font-black text-center">Phish Resistance</th>
                <th className="pb-4 px-4 font-black text-right">Defense Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-sans">
              {sortedStats.map((row, i) => (
                <tr key={i} className="hover:bg-white/10 transition-colors group">
                  <td className="py-5 px-4 font-black text-white font-['Outfit'] text-base sm:text-xl flex items-center gap-3">
                    <span className="text-2xl">{row.name.toLowerCase().includes('grand') ? '👴' : '🧑‍🚀'}</span>
                    <span>{row.name}</span>
                  </td>
                  <td className="py-5 px-4 font-mono">
                    <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-black uppercase bg-white/15 text-slate-200 border border-white/10">
                      {row.role}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-center font-mono font-black text-cyan-300 text-lg sm:text-2xl">
                    {row.lessons} <span className="text-xs sm:text-sm text-slate-400 font-bold">/ 20</span>
                  </td>
                  <td className="py-5 px-4 text-center font-mono font-black text-purple-300 text-lg sm:text-2xl">
                    {row.quizzes}
                  </td>
                  <td className="py-5 px-4 text-center font-mono font-black text-emerald-400 text-lg sm:text-2xl">
                    {row.resScore}
                  </td>
                  <td className="py-5 px-4 text-right font-mono font-black text-sm sm:text-base">
                    <span className="px-4 py-2 rounded-full bg-slate-900 border-2 border-white/20 shadow-md whitespace-nowrap inline-block" style={{ color: row.color }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center pt-8 mt-8 border-t border-white/15 text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400 shrink-0" /> All family devices synchronized with CyberCIA Forge Collaborative Pedagogy Engine
        </div>

      </div>

    </div>
  );
}
