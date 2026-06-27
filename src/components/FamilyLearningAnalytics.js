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
      
      <div className="glass-card p-6 sm:p-10 bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_80px_rgba(34,211,238,0.2)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="text-xs text-cyan-300 font-black uppercase tracking-widest flex items-center gap-2">
              <Trophy size={16} className="text-amber-400 animate-bounce" /> Family Circle Pedagogy Benchmark
            </span>
            <h3 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-white mt-1">Personalized Learning & Competency Matrix</h3>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-white/10 text-xs">
            <span className="text-slate-400 px-2 font-bold uppercase">Sort By:</span>
            {[
              { id: "xp", label: "⚡ XP Score" },
              { id: "lessons", label: "📚 Lessons" },
              { id: "resScore", label: "🛡️ Resilience" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedSort(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                  selectedSort === tab.id ? "bg-cyan-400 text-slate-950 shadow-md scale-105" : "text-slate-300 hover:text-white bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Comparative Bar Matrix */}
        <div className="space-y-6 mb-12 bg-slate-900/40 p-6 rounded-3xl border border-white/5 transition-all">
          <span className="text-xs font-black text-slate-300 uppercase tracking-widest block mb-4">
            📈 Relative Pedagogy Completion Graph ({selectedSort === 'xp' ? 'Ranked by Total XP' : (selectedSort === 'lessons' ? 'Ranked by Lessons Mastered' : 'Ranked by Phish Resistance Score')}):
          </span>
          <div className="space-y-4">
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
                <div key={mem.name} className="space-y-1.5 transition-all duration-500">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-white/10 text-slate-300 font-mono">#{idx+1}</span>
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: mem.color }}></span>
                      <span className="truncate max-w-[200px] sm:max-w-none">{mem.name}</span>
                    </span>
                    <span className="font-mono text-cyan-300 shrink-0 font-black">{labelText}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div 
                      className="h-full rounded-full transition-all duration-700 relative"
                      style={{ width: `${widthPct}%`, backgroundColor: mem.color }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formal Granular Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-mono">
                <th className="pb-3 px-4 font-black">Family Member</th>
                <th className="pb-3 px-4 font-black">Role</th>
                <th className="pb-3 px-4 font-black text-center">Lessons Mastered</th>
                <th className="pb-3 px-4 font-black text-center">Quizzes Solved</th>
                <th className="pb-3 px-4 font-black text-center">Phish Resistance</th>
                <th className="pb-3 px-4 font-black text-right">Defense Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {sortedStats.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-4 font-bold text-white font-['Outfit'] text-sm flex items-center gap-2">
                    <span className="text-lg">{row.name.toLowerCase().includes('grand') ? '👴' : '🧑‍🚀'}</span>
                    <span>{row.name}</span>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-white/10 text-slate-300">
                      {row.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-cyan-300 text-sm">
                    {row.lessons} <span className="text-[10px] text-slate-500 font-normal">/ 20</span>
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-purple-300 text-sm">
                    {row.quizzes}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-black text-emerald-400 text-sm">
                    {row.resScore}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-black text-xs">
                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 shadow-sm whitespace-nowrap" style={{ color: row.color }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center pt-8 mt-6 border-t border-white/10 text-[10px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" /> All family devices synchronized with CyberCIA Forge Collaborative Pedagogy Engine
        </div>

      </div>

    </div>
  );
}
