import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, PlusCircle, BarChart3, Settings, HelpCircle, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useTickets } from '../../context/TicketContext';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/chamados', icon: Ticket, label: 'Fila de Chamados' },
  { path: '/novo-chamado', icon: PlusCircle, label: 'Novo Chamado' },
  { path: '/relatorios', icon: BarChart3, label: 'Relatórios' },
];

export const Sidebar = () => {
  const [profilePic, setProfilePic] = useState<string | null>(localStorage.getItem('helpdesk_profile_pic'));
  const { tickets } = useTickets();

  // Calcula o XP com base nos chamados
  const closedTickets = tickets.filter(t => t.status === 'Finalizado').length;
  const totalXP = (tickets.length * 10) + (closedTickets * 40); // 10 XP por criar, +40 XP por finalizar (total 50)
  
  const XP_PER_LEVEL = 500;
  const currentLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const currentXPInLevel = totalXP % XP_PER_LEVEL;
  const progressPercentage = (currentXPInLevel / XP_PER_LEVEL) * 100;

  // Define o título baseado no nível
  const getJobTitle = (level: number) => {
    if (level < 3) return 'Analista Júnior';
    if (level < 7) return 'Analista Pleno';
    if (level < 15) return 'Analista Sênior';
    return 'Especialista';
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfilePic(base64);
        localStorage.setItem('helpdesk_profile_pic', base64);
      };
      reader.readAsDataURL(file);
    }
  };

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

        {/* User Profile */}
        <div className="mt-4 pt-4 border-t border-dark-600/50">
          <div className="flex items-center gap-3 px-2">
            <div className="relative group cursor-pointer">
              <label htmlFor="profile-upload" className="cursor-pointer">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-dark-600 group-hover:border-primary transition-colors bg-dark-700 flex items-center justify-center">
                  {profilePic ? (
                    <img src={profilePic} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm font-bold">LF</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-white">Editar</span>
                </div>
              </label>
              <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Lucas Ferreira</p>
              <p className="text-xs text-primary truncate">{getJobTitle(currentLevel)}</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-3 px-2" title={`Ganhe XP abrindo (+10) e resolvendo (+40) chamados.`}>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span className="font-medium text-primary">Nível {currentLevel}</span>
              <span>{currentXPInLevel} / {XP_PER_LEVEL} XP</span>
            </div>
            <div className="h-1.5 w-full bg-dark-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${Math.max(progressPercentage, 2)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
