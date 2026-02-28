'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      className="cursor-pointer transition-colors"
      aria-label="Alternar tema"
      style={{
        background: 'none',
        border: 'none',
        padding: '4px',
        color: 'var(--text-muted)',
        fontSize: '16px',
        lineHeight: 1,
      }}
    >
      {dark ? '☀' : '☽'}
    </button>
  );
}
