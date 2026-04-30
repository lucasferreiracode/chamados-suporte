export type TicketStatus = 'Aberto' | 'Em Atendimento' | 'Aguardando Cliente' | 'Escalado N2' | 'Finalizado';
export type TicketPriority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';

export interface Ticket {
  id: string; // Ex: TCK-1001
  clientName: string;
  department: string;
  company: string;
  phone: string;
  requestType: string;
  category: string;
  priority: TicketPriority;
  description: string;
  assignedTo: string | null;
  createdAt: string; // ISO String
  slaExpectedHours: number;
  status: TicketStatus;
  
  // Resolution fields
  resolutionNotes?: string;
  timeSpentMinutes?: number;
  closedAt?: string; // ISO String
  slaMet?: boolean;
}

export interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => void;
  updateStatus: (id: string, status: TicketStatus, assignedTo?: string) => void;
  closeTicket: (id: string, resolutionNotes: string, timeSpentMinutes: number) => void;
}
