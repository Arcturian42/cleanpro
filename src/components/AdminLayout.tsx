import { ReactNode } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  Users, 
  Building2, 
  HardHat, 
  FileText, 
  Receipt, 
  Zap, 
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  Search,
  Bell,
  Menu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const MENU_ITEMS = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'manager'] },
  { path: '/planning', label: 'Planning', icon: Calendar, roles: ['admin', 'manager'] },
  { path: '/interventions', label: 'Interventions', icon: ClipboardList, roles: ['admin', 'manager'] },
  { path: '/clients', label: 'Clients', icon: Users, roles: ['admin', 'manager'] },
  { path: '/sites', label: 'Sites', icon: Building2, roles: ['admin', 'manager'] },
  { path: '/agents', label: 'Agents', icon: HardHat, roles: ['admin', 'manager'] },
  { path: '/crm', label: 'CRM / Ventes', icon: Sparkles, roles: ['admin', 'manager'] },
  { path: '/reports', label: 'Rapports', icon: FileText, roles: ['admin', 'manager'] },
  { path: '/billing', label: 'Devis & Factures', icon: Receipt, roles: ['admin'] },
  { path: '/integrations', label: 'Intégrations', icon: Zap, roles: ['admin'] },
  { path: '/settings', label: 'Paramètres', icon: Settings, roles: ['admin'] },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenu = MENU_ITEMS.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg leading-tight uppercase tracking-tight">CleanPro</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gestion propreté</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={18} />
              {item.label}
              {location.pathname === item.path && (
                <motion.div layoutId="activeNav" className="ml-auto">
                  <ChevronRight size={14} className="opacity-60" />
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200 text-sm">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{user?.role === 'admin' ? 'Administrateur' : 'Manager'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-xl font-bold text-slate-800 hidden md:block">Nova Propreté</h1>
            <div className="relative max-w-md w-full ml-8 hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Rechercher client, site, agent..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button 
              onClick={() => navigate('/m/today')}
              className="text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
            >
              <Zap size={14} />
              Vue Agent
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
