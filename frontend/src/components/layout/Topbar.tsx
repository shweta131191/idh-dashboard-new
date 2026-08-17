import { useState } from 'react';

function currentTheme(): 'light' | 'dark' {
  const stamped = document.documentElement.getAttribute('data-theme');
  if (stamped === 'dark' || stamped === 'light') return stamped;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function Topbar({ title }: { title: string }) {
  const [theme, setTheme] = useState(currentTheme());

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('idh-theme', next);
    setTheme(next);
  }

  return (
    <header className="topbar">
      <h1>{title}</h1>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}
