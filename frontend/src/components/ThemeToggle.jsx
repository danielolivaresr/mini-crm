import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Alterna entre tema claro y oscuro. El tema guardado se aplica en index.html
// antes de pintar, así que aquí solo leemos el estado actual de <html>.
export default function ThemeToggle({ showLabel = false, className = '' }) {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setDark(next);
  };

  const Icon  = dark ? Sun : Moon;
  const label = dark ? 'Modo claro' : 'Modo oscuro';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={showLabel ? undefined : label}
      title={showLabel ? undefined : label}
      className={`flex items-center gap-2.5 rounded-md text-sm text-ink-muted hover:bg-surface-hover hover:text-ink transition-colors ${className}`}
    >
      <Icon size={16} strokeWidth={2} />
      {showLabel && label}
    </button>
  );
}
