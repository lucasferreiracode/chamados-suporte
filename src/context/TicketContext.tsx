import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ticket, TicketContextType, TicketStatus } from '../types';
import { differenceInHours } from 'date-fns';

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TCK-1001',
    clientName: 'Ana Souza',
    department: 'Financeiro',
    company: 'TechCorp SA',
    phone: '(11) 98765-4321',
    requestType: 'Incidente',
    category: 'Acesso a Sistemas',
    priority: 'Alta',
    description: 'Sistema ERP não está autenticando usuários do setor.',
    assignedTo: 'Carlos Mendes',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    slaExpectedHours: 4,
    status: 'Em Atendimento'
  },
  {
    id: 'TCK-1002',
    clientName: 'Roberto Alves',
    department: 'RH',
    company: 'TechCorp SA',
    phone: '(11) 91234-5678',
    requestType: 'Requisição',
    category: 'Hardware',
    priority: 'Média',
    description: 'Solicitação de um novo monitor para o estagiário.',
    assignedTo: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    slaExpectedHours: 24,
    status: 'Aberto'
  },
  {
    id: 'TCK-1003',
    clientName: 'Julia Martins',
    department: 'Vendas',
    company: 'TechCorp SA',
    phone: '(11) 99999-8888',
    requestType: 'Incidente',
    category: 'Rede',
    priority: 'Crítica',
    description: 'Filial 2 está sem internet, afetando 30 funcionários.',
    assignedTo: 'Marcos Silva',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    slaExpectedHours: 2,
    status: 'Escalado N2'
  },
  {
    id: 'TCK-1004',
    clientName: 'Fernando Costa',
    department: 'Marketing',
    company: 'TechCorp SA',
    phone: '(11) 97777-6666',
    requestType: 'Requisição',
    category: 'Software',
    priority: 'Baixa',
    description: 'Instalação do Adobe Creative Cloud.',
    assignedTo: 'Carlos Mendes',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    slaExpectedHours: 72,
    status: 'Finalizado',
    resolutionNotes: 'Licença atribuída e software instalado remotamente.',
    timeSpentMinutes: 30,
    closedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    slaMet: true
  }
];

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
