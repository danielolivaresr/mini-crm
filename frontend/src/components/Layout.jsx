import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LayoutDashboard, Users, Target, CheckSquare, LogOut } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <aside className="w-60 bg-white border-r border-slate-200 min-h-screen flex flex-col">
          <div className="px-5 py-5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-navy-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-slate-900">Tiny CRM</span>
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
                      ? 'bg-navy-50 text-navy-900 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center text-white text-xs font-semibold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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