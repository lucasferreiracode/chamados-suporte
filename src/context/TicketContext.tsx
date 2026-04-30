import { createContext, useContext, useState, ReactNode } from 'react';
import type { Ticket, TicketContextType, TicketStatus } from '../types';
import { differenceInHours } from 'date-fns';

const MOCK_TICKETS: Ticket[] = [];

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

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

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateStatus, closeTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
