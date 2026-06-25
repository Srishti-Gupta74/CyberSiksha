"use client";

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { LESSONS } from '@/data/content';
import { BookOpen, CheckCircle2, ChevronLeft, Flag } from 'lucide-react';

export default function LearnPage() {
  const { completedLessons, markLessonComplete } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedLesson, setSelectedLesson] = useState(null);

  const categories = ['All', ...new Set(LESSONS.map(l => l.category))];

  const filteredLessons = activeCategory === 'All' 
    ? LESSONS 
    : LESSONS.filter(l => l.category === activeCategory);

  const handleComplete = async () => {
    if (!selectedLesson) return;
    await markLessonComplete(selectedLesson.id, 20); // 20 XP per lesson
    setSelectedLesson(null); // Go back
  };

  if (selectedLesson) {
    const isDone = completedLessons.includes(selectedLesson.id);
    return (
      <div className="animate-fade-in max-w-3xl mx-auto pb-12">
        <button 
          onClick={() => setSelectedLesson(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span className="font-semibold text-sm">Back to Modules</span>
        </button>

        <div className="glass-card p-6 md:p-10 mb-6 border-emerald/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
            <span className="bg-emerald/10 text-emerald border border-emerald/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {selectedLesson.category}
            </span>
            <span className="bg-navy/50 text-slate-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {selectedLesson.difficulty}
            </span>
            <span className="bg-navy/50 text-slate-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              ⏱ {selectedLesson.duration}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black font-['Outfit'] mb-8 relative z-10">
            {selectedLesson.icon} {selectedLesson.title}
          </h1>

          <div className="space-y-6 relative z-10">
            {selectedLesson.content.map((block, idx) => {
              if (block.type === 'text') {
                return <p key={idx} className="text-slate-200 leading-relaxed text-[15px]">{block.value}</p>;
              }
              if (block.type === 'example') {
                return (
                  <div key={idx} className="bg-gold/10 border-l-4 border-gold p-4 md:p-5 rounded-r-xl">
                    <p className="text-gold font-semibold mb-1 text-sm uppercase tracking-wide">Real Scenario</p>
                    <p className="text-slate-300 italic text-[15px] leading-relaxed">"{block.value}"</p>
                  </div>
                );
              }
              if (block.type === 'tip') {
                return (
                  <div key={idx} className="bg-emerald/10 border-l-4 border-emerald p-4 md:p-5 rounded-r-xl">
                    <p className="text-emerald font-semibold mb-1 text-sm uppercase tracking-wide">Protection Tip</p>
                    <p className="text-slate-200 font-medium text-[15px] leading-relaxed">{block.value}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        <div className="glass-card p-6 md:p-8 bg-rose/5 border-rose/20 mb-8">
          <h3 className="flex items-center gap-2 text-rose font-bold text-lg mb-4">
            <Flag size={20} /> Red Flags to Watch For
          </h3>
          <ul className="space-y-3">
            {selectedLesson.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-rose font-bold mt-0.5">🚩</span>
                <span className="text-slate-200 text-[15px]">{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={handleComplete}
          disabled={isDone}
          className="w-full py-4 text-center bg-gradient-to-r from-emerald to-cyan hover:from-emerald/90 hover:to-cyan/90 text-navy font-black rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {isDone ? (
            <>
              <CheckCircle2 size={24} /> Module Completed
            </>
          ) : (
            <>
              Complete Module & Earn 20 XP
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black font-['Outfit'] flex items-center gap-3 mb-2">
          <BookOpen className="text-emerald" size={28} />
          Training Modules
        </h1>
        <p className="text-slate-400 text-sm">Master every scam pattern. Complete modules to build your Scam IQ.</p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeCategory === cat 
                ? 'bg-emerald/20 text-emerald border border-emerald/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                : 'bg-navy/50 text-slate-400 border border-white/10 hover:bg-navy hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {filteredLessons.map((lesson, i) => {
          const isDone = completedLessons.includes(lesson.id);
          return (
            <div 
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="glass-card p-5 cursor-pointer group hover:-translate-y-1 transition-all flex items-center gap-4"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-12 h-12 bg-navy rounded-xl border border-white/5 shadow-inner flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {lesson.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white group-hover:text-emerald transition-colors">{lesson.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    {lesson.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20"></span>
                  <span className={`text-[10px] uppercase tracking-widest font-semibold ${
                    lesson.difficulty === 'Beginner' ? 'text-emerald' : 
                    lesson.difficulty === 'Intermediate' ? 'text-gold' : 'text-rose'
                  }`}>
                    {lesson.difficulty}
                  </span>
                </div>
              </div>
              <div>
                {isDone ? (
                  <CheckCircle2 className="text-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" size={24} />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-emerald/50 transition-colors"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
