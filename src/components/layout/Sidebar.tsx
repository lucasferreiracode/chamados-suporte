import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, PlusCircle, BarChart3, Settings, HelpCircle, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/chamados', icon: Ticket, label: 'Fila de Chamados' },
  { path: '/novo-chamado', icon: PlusCircle, label: 'Novo Chamado' },
  { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-dark-800 border-r border-dark-600/50 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-dark-600/50">
        <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
          <Activity className="w-6 h-6 text-accent-neon" />
          <span>Tech<span className="text-white">Desk</span></span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 flex flex-col gap-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
          Principal
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden group",
              isActive 
                ? "text-white bg-primary/10" 
                : "text-gray-400 hover:text-gray-200 hover:bg-dark-700"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-bg"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 relative z-10 transition-colors", 
                  isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-300"
                )} />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-dark-600/50">
        <button onClick={() => alert("Recurso em desenvolvimento!")} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-dark-700 transition-all">
          <Settings className="w-5 h-5 text-gray-500" />
          Configurações
        </button>
        <button onClick={() => alert("Recurso em desenvolvimento!")} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-dark-700 transition-all mt-1">
          <HelpCircle className="w-5 h-5 text-gray-500" />
          Suporte ao Sistema
        </button>
      </div>
    </aside>
  );
};
