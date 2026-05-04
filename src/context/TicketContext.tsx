import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Ticket, TicketContextType, TicketStatus } from '../types';
import { differenceInHours } from 'date-fns';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'helpdesk_tickets';

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse tickets from local storage', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => {
    const newId = `TCK-${1000 + tickets.length + 1}`;
    const newTicket: Ticket = {
      ...newTicketData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'Aberto'
    };
    setTickets(prev => [newTicket, ...prev]);
    toast.success(`Chamado ${newId} criado com sucesso!`);
  };

  const updateStatus = (id: string, status: TicketStatus, assignedTo?: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status, assignedTo: assignedTo !== undefined ? assignedTo : t.assignedTo };
      }
      return t;
    }));
    toast.success(`Status do chamado ${id} atualizado para ${status}.`);
  };

  const closeTicket = (id: string, resolutionNotes: string, timeSpentMinutes: number) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const closedAt = new Date().toISOString();
        const hoursOpen = differenceInHours(new Date(closedAt), new Date(t.createdAt));
        const slaMet = hoursOpen <= t.slaExpectedHours;
        
        return {
          ...t,
          status: 'Finalizado',
          resolutionNotes,
          timeSpentMinutes,
          closedAt,
          slaMet
        };
      }
      return t;
    }));
    toast.success(`Chamado ${id} finalizado com sucesso!`);
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.map(t => t).filter(t => t.id !== id));
    toast.error(`Chamado ${id} excluído permanentemente.`);
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateStatus, closeTicket, deleteTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
