"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ShieldQuestion, Newspaper, MessageSquareText } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Learn', path: '/learn', icon: <BookOpen size={20} /> },
    { name: 'Quiz Game', path: '/quiz', icon: <ShieldQuestion size={20} /> },
    { name: 'Alerts', path: '/news', icon: <Newspaper size={20} /> },
    { name: 'Ask AI', path: '/chat', icon: <MessageSquareText size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 w-full glass-card border-t border-b-0 rounded-t-2xl rounded-b-none z-50 md:relative md:border-b md:border-t-0 md:rounded-none bg-navy/90 py-2 md:py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="hidden md:block text-cyan font-bold text-xl tracking-wider">
          Cyber<span className="text-white">Siksha</span>
        </div>
        
        <div className="flex w-full md:w-auto justify-between md:gap-8 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
                  isActive ? 'text-cyan glow-text' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="text-[10px] md:text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
