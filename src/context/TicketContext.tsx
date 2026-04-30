import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Ticket, TicketContextType, TicketStatus } from '../types';
import { differenceInHours } from 'date-fns';

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
  };

  const updateStatus = (id: string, status: TicketStatus, assignedTo?: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status, assignedTo: assignedTo !== undefined ? assignedTo : t.assignedTo };
      }
      return t;
    }));
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
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
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
