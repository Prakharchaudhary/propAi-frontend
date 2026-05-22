'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      setDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }

    setDark(!dark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 dark:border-[#e4b363]/10 bg-white dark:bg-[#111827] text-slate-700 dark:text-[#e4b363] transition-all duration-300"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}