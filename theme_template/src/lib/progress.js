"use client";

// Helper functions for tracking user progress in localStorage

const PROGRESS_KEY = 'cybersiksha_progress';

export const getProgress = () => {
  if (typeof window === 'undefined') return null;
  
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Default progress state
  return {
    xp: 0,
    scamIq: 0,
    lessonsCompleted: [],
    quizzesAnswered: {},
    streak: 0,
    lastActive: new Date().toISOString(),
  };
};

export const saveProgress = (newProgress) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
};

export const addXP = (amount) => {
  const p = getProgress();
  if (!p) return;
  p.xp += amount;
  saveProgress(p);
  return p.xp;
};

export const markLessonCompleted = (lessonId) => {
  const p = getProgress();
  if (!p) return;
  if (!p.lessonsCompleted.includes(lessonId)) {
    p.lessonsCompleted.push(lessonId);
    saveProgress(p);
  }
};

export const updateQuizScore = (quizId, isCorrect) => {
  const p = getProgress();
  if (!p) return;
  
  p.quizzesAnswered[quizId] = isCorrect;
  
  // Recalculate Scam IQ (percentage of correct quizzes)
  const totalAnswers = Object.keys(p.quizzesAnswered).length;
  const correctAnswers = Object.values(p.quizzesAnswered).filter(v => v).length;
  
  if (totalAnswers > 0) {
    p.scamIq = Math.round((correctAnswers / totalAnswers) * 100);
  }
  
  saveProgress(p);
  return { isCorrect, newIq: p.scamIq };
};
