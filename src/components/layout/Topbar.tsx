import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Topbar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-dark-800/80 backdrop-blur-md border-b border-dark-600/50 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar chamado por ID, Cliente ou Assunto..." 
            className="w-full bg-dark-900 border border-dark-600 rounded-full pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex text-sm text-gray-400">
          {format(time, "dd 'de' MMM, HH:mm", { locale: ptBR })}
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-dark-700">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-neon rounded-full shadow-neon-accent animate-pulse"></span>
          </button>
          
          <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-dark-700">
            <Sun className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-dark-600/50 mx-2"></div>

        <button className="flex items-center gap-3 focus:outline-none">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-200 leading-none">Lucas Ferreira</p>
            <p className="text-xs text-primary mt-1">Admin N2</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-neon p-0.5">
            <div className="w-full h-full bg-dark-800 rounded-full flex items-center justify-center overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Lucas+Ferreira&background=random&color=fff" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
