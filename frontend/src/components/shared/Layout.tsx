import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import {
  LayoutDashboard, Ticket, PlusCircle, BarChart2,
  Trophy, FlaskConical, User, LogOut, Menu, X, Coins, Info,
} from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/raffles', label: 'Rifas', icon: Ticket },
  { to: '/raffles/new', label: 'Criar Rifa', icon: PlusCircle },
  { to: '/stats', label: 'Estatísticas', icon: BarChart2 },
  { to: '/ranking', label: 'Ranking', icon: Trophy },
  { to: '/simulator', label: 'Simulador', icon: FlaskConical },
  { to: '/profile', label: 'Perfil', icon: User },
  { to: '/about', label: 'Sobre', icon: Info },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        <div className="p-5 border-b border-gray-100">
          <Logo size="md" />
        </div>

        {user && (
          <div className="px-4 py-3 bg-blue-50 mx-3 mt-3 rounded-lg">
            <p className="text-xs text-gray-500">Seus pontos</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Coins size={16} className="text-amber-500" />
              <span className="font-bold text-lg text-gray-800">{user.points}</span>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === to
                  ? 'bg-primary text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Logado como</p>
          <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 text-sm text-danger hover:text-red-700 transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20 px-4 py-3 flex justify-between items-center">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium flex items-center gap-1">
            <Coins size={14} className="text-amber-500" />{user?.points}
          </span>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-16 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm ${
                  location.pathname === to ? 'bg-primary text-white' : 'text-gray-700'
                }`}
              >
                <Icon size={18} />{label}
              </Link>
            ))}
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 text-danger text-sm w-full">
              <LogOut size={18} /> Sair
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
