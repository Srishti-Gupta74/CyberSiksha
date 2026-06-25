"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';
import lessonsData from '@/data/lessons.json';
import { markLessonCompleted, addXP } from '@/lib/progress';
import { useRouter } from 'next/navigation';

export default function LessonPage({ params }) {
  // Use React.use() to unwrap the params promise for Next.js 15+ compatibility
  const resolvedParams = use(params);
  const router = useRouter();
  
  const category = lessonsData.find(c => c.id === resolvedParams.slug);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  
  if (!category) return <div className="p-8 text-center">Category not found</div>;
  
  const lesson = category.lessons[currentLessonIndex];
  
  const handleNextStep = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setShowSummary(true);
      markLessonCompleted(lesson.id);
      addXP(lesson.xpReward);
    }
  };

  const handleFinish = () => {
    router.push('/learn');
  };

  if (showSummary) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-success/50">
            <CheckCircle className="text-success" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Lesson Completed!</h1>
          <p className="text-cyan font-medium glow-text">+{lesson.xpReward} XP Earned</p>
        </div>

        <div className="glass-card p-6 border-warning/30 bg-warning/5">
          <h3 className="text-xl font-bold text-warning flex items-center gap-2 mb-4">
            <AlertTriangle /> Red Flags to Remember
          </h3>
          <ul className="space-y-3">
            {lesson.redFlags.map((flag, idx) => (
              <li key={idx} className="flex gap-3 text-slate-200">
                <span className="text-warning font-bold">•</span> {flag}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 border-success/30 bg-success/5">
          <h3 className="text-xl font-bold text-success flex items-center gap-2 mb-4">
            <ShieldCheck /> How to Protect Yourself
          </h3>
          <p className="text-slate-200">{lesson.protection}</p>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={handleFinish} className="flex-1 bg-navy border border-white/20 p-4 rounded-xl font-bold hover:bg-white/5 transition-colors">
            Back to Lessons
          </button>
          <Link href="/quiz" className="flex-1 btn-primary text-center leading-[3rem]">
            Test Your Knowledge
          </Link>
        </div>
      </div>
    );
  }

  const step = lesson.steps[currentStep];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center text-sm font-medium text-slate-400 mb-8">
        <Link href="/learn" className="hover:text-white flex items-center gap-1">
          <ChevronLeft size={16} /> Back
        </Link>
        <span>Step {currentStep + 1} of {lesson.steps.length}</span>
      </div>

      <div className="text-center mb-8">
        <div className="text-5xl mb-4">{category.icon}</div>
        <h1 className="text-2xl font-bold text-white mb-2">{lesson.title}</h1>
        <div className="w-full bg-navy/50 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-cyan h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / lesson.steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-card p-8 min-h-[250px] flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 rounded-full blur-3xl -z-10"></div>
        <p className="text-lg md:text-xl text-slate-100 leading-relaxed text-center z-10">
          {step.text}
        </p>
      </div>

      <button 
        onClick={handleNextStep}
        className="w-full btn-primary flex justify-center items-center gap-2 py-4 text-lg"
      >
        {currentStep < lesson.steps.length - 1 ? 'Continue' : 'Finish Lesson'} <ChevronRight />
      </button>
    </div>
  );
}
