import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '../../context/ThemeContext';
import { useTickets } from '../../context/TicketContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Topbar = () => {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { tickets } = useTickets();
  const notifRef = useRef<HTMLDivElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(localStorage.getItem('helpdesk_profile_pic'));

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

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const criticalTickets = tickets.filter(t => t.status !== 'Finalizado' && t.priority === 'Crítica');
  const recentTickets = tickets.filter(t => t.status === 'Aberto').slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/chamados?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const showDevAlert = () => alert("Recurso em desenvolvimento!");

  return (
    <header className="h-16 bg-dark-800/80 backdrop-blur-md border-b border-dark-600/50 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar chamado por ID, Cliente ou Assunto..." 
            className="w-full bg-dark-900 border border-dark-600 rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner placeholder:text-gray-600"
          />
        </form>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex text-sm text-gray-400">
          {format(time, "dd 'de' MMM, HH:mm", { locale: ptBR })}
        </div>
        
        <div className="flex items-center gap-3 relative" ref={notifRef}>
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className={`relative p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-dark-700 ${isNotifOpen ? 'bg-dark-700' : ''}`}>
            <Bell className="w-5 h-5" />
            {(criticalTickets.length > 0 || recentTickets.length > 0) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-12 right-10 w-80 bg-dark-800 border border-dark-600 shadow-2xl rounded-xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-dark-600 flex justify-between items-center bg-dark-900/50">
                  <h3 className="font-bold text-gray-900 dark:text-white">Notificações</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-dark-700 text-gray-400">{criticalTickets.length + recentTickets.length} Novas</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {criticalTickets.length > 0 && criticalTickets.map(t => (
                    <div key={`crit-${t.id}`} className="p-4 border-b border-dark-600 hover:bg-dark-700/50 transition-colors cursor-pointer" onClick={() => { setIsNotifOpen(false); navigate(`/chamados?search=${t.id}`); }}>
                      <div className="flex gap-3">
                        <div className="p-2 rounded-full bg-danger/10 text-danger h-fit"><AlertTriangle className="w-4 h-4" /></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">SLA Crítico: {t.id}</p>
                          <p className="text-xs text-gray-500 mt-1">{t.clientName} - {t.company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentTickets.map(t => (
                    <div key={`rec-${t.id}`} className="p-4 border-b border-dark-600 hover:bg-dark-700/50 transition-colors cursor-pointer" onClick={() => { setIsNotifOpen(false); navigate(`/chamados?search=${t.id}`); }}>
                      <div className="flex gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary h-fit"><Bell className="w-4 h-4" /></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">Novo Chamado {t.id}</p>
                          <p className="text-xs text-gray-500 mt-1">{t.clientName} abriu um chamado de {t.category}.</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {criticalTickets.length === 0 && recentTickets.length === 0 && (
                    <div className="p-6 text-center text-gray-500 text-sm">Nenhuma notificação nova.</div>
                  )}
                </div>
                <div className="p-3 bg-dark-900/50 border-t border-dark-600 text-center">
                  <button onClick={() => { setIsNotifOpen(false); navigate('/chamados'); }} className="text-sm text-primary hover:text-primary-hover font-medium">Ver todos os chamados</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button onClick={toggleTheme} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-dark-700">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="h-8 w-px bg-dark-600/50 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:flex flex-col items-end">
            <p className="text-sm font-medium text-gray-200 leading-none">Lucas Ferreira</p>
            <div className="flex items-center gap-2 mt-1.5">
               <span className="text-[10px] font-bold text-primary">Nível {currentLevel}</span>
               <p className="text-xs text-primary">{getJobTitle(currentLevel)}</p>
            </div>
            {/* Progress */}
            <div className="w-full flex justify-end items-center gap-2 mt-1" title={`Ganhe XP abrindo (+10) e resolvendo (+40) chamados.`}>
               <span className="text-[9px] text-gray-400">{currentXPInLevel}/{XP_PER_LEVEL} XP</span>
               <div className="h-1.5 w-16 bg-dark-700 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${Math.max(progressPercentage, 2)}%` }}
                 ></div>
               </div>
            </div>
          </div>
          
          <div className="relative group cursor-pointer shrink-0">
             <label htmlFor="topbar-profile-upload" className="cursor-pointer">
               {/* Circular Progress Ring */}
               <div className="relative w-11 h-11 rounded-full flex items-center justify-center p-0.5"
                    style={{ background: `conic-gradient(var(--tw-gradient-stops))`, backgroundImage: `conic-gradient(from 0deg, #3b82f6 ${progressPercentage}%, #1f2937 ${progressPercentage}%)` }}
               >
                  <div className="w-full h-full bg-dark-800 rounded-full overflow-hidden border-2 border-dark-800 flex items-center justify-center relative z-10">
                     {profilePic ? (
                       <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
                     ) : (
                       <span className="text-white text-sm font-bold">LF</span>
                     )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 m-0.5">
                     <span className="text-[9px] text-white">Editar</span>
                  </div>
               </div>
             </label>
             <input id="topbar-profile-upload" type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
          </div>
        </div>
      </div>
    </header>
  );
};
