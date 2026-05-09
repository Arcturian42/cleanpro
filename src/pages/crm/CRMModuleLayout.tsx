import { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Target, 
  Layers, 
  Briefcase, 
  Calendar, 
  Users2 
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const CRM_NAV = [
  { path: '/crm', label: 'Dashboard', icon: BarChart3, end: true },
  { path: '/crm/prospects', label: 'Prospects', icon: Target },
  { path: '/crm/pipeline', label: 'Pipeline', icon: Layers },
  { path: '/crm/portfolio', label: 'Portefeuille', icon: Briefcase },
  { path: '/crm/calendar', label: 'Calendrier', icon: Calendar },
  { path: '/crm/team', label: 'Équipe CRM', icon: Users2 },
];

export default function CRMModuleLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-sm overflow-x-auto">
        {CRM_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
              isActive 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-100" 
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={location.pathname}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
