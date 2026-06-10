import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, BarChart2, Trophy, FlaskConical, User, LogOut, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../store/auth.context';
import { PointsBadge } from './PointsBadge';

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  function toggleDark() {
    document.documentElement.classList.toggle('dark');
    setDark((prev) => !prev);
  }

  function handleSignOut() {
    signOut();
    navigate('/login');
  }

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/raffles', icon: Ticket, label: 'Rifas' },
    { to: '/stats', icon: BarChart2, label: 'Estatísticas' },
    { to: '/ranking', icon: Trophy, label: 'Ranking' },
    { to: '/simulator', icon: FlaskConical, label: 'Simulador' },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/dashboard" className="font-bold text-xl text-primary">🎯 ProbBet</Link>

      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link key={to} to={to} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {user && <PointsBadge points={user.points} size="sm" />}
        <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
          {dark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <Link to="/profile" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
          <User size={17} />
        </Link>
        <button onClick={handleSignOut} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500">
          <LogOut size={17} />
        </button>
      </div>
    </nav>
  );
}
