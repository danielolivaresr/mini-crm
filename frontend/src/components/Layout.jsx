import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LayoutDashboard, Users, Target, CheckSquare, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const location         = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients',   label: 'Clientes',  icon: Users },
    { path: '/leads',     label: 'Oportunidades',     icon: Target },
    { path: '/tasks',     label: 'Tareas',    icon: CheckSquare },
  ];

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-canvas">
      <div className="flex">
        <aside className="w-60 bg-surface border-r border-line min-h-screen flex flex-col">
          <div className="px-5 py-5 border-b border-line">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-fg font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-ink">Tiny CRM</span>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-0.5">
            {menuItems.map(item => {
              const Icon   = item.icon;
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? 'bg-primary-soft text-primary-strong font-medium'
                      : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
                  }`}
                >
                  <Icon size={16} strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-line p-3">
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-fg text-xs font-semibold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-ink-muted capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <ThemeToggle showLabel className="w-full mt-1 px-3 py-2" />
            <button
              onClick={handleLogout}
              className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-ink-muted hover:bg-surface-hover hover:text-ink transition-colors"
            >
              <LogOut size={16} strokeWidth={2} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}