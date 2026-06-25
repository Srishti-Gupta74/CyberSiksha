import Link from 'next/link';
import { BookOpen, CheckCircle } from 'lucide-react';
import lessonsData from '@/data/lessons.json';

export default function LearnPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="text-cyan" /> 
          Learn to Outsmart Scams
        </h1>
        <p className="text-slate-300">Master the red flags of digital fraud with bite-sized, simple lessons.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessonsData.map((category) => (
          <Link href={`/learn/${category.id}`} key={category.id}>
            <div className="glass-card p-6 h-full hover:bg-[var(--color-card-hover)] hover:-translate-y-1 transition-all cursor-pointer group flex flex-col">
              <div className="text-4xl mb-4 bg-navy/50 w-16 h-16 flex items-center justify-center rounded-xl border border-white/5">
                {category.icon}
              </div>
              <h2 className="text-xl font-bold group-hover:text-cyan transition-colors mb-2">{category.title}</h2>
              <p className="text-slate-400 text-sm flex-grow">{category.description}</p>
              
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm font-medium">
                <span className="text-slate-300">{category.lessons.length} Lesson{category.lessons.length > 1 ? 's' : ''}</span>
                <span className="text-cyan group-hover:glow-text">Start Learning →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
