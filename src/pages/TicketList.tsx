import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { format, differenceInHours, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Eye, Play, CheckCircle, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TicketList = () => {
  const { tickets, updateStatus, closeTicket, deleteTicket } = useTickets();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('Todos');

  useEffect(() => {
    const search = searchParams.get('search');
    if (search !== null) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };
  
  // Modal State
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [ticketToFinish, setTicketToFinish] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  
  const [ticketDetails, setTicketDetails] = useState<any | null>(null);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Crítica': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Alta': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'Média': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Baixa': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aberto': return 'text-blue-400 bg-blue-400/10';
      case 'Em Atendimento': return 'text-yellow-400 bg-yellow-400/10';
      case 'Aguardando Cliente': return 'text-purple-400 bg-purple-400/10';
      case 'Escalado N2': return 'text-red-400 bg-red-400/10';
      case 'Finalizado': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const handleFinishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketToFinish) {
      closeTicket(ticketToFinish, resolutionNotes, Number(timeSpent));
      setIsFinishModalOpen(false);
      setResolutionNotes('');
      setTimeSpent('');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o chamado ${id}?\n\nEssa ação não poderá ser desfeita.`)) {
      deleteTicket(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gerenciamento de Chamados</h1>
          <p className="text-gray-400 text-sm mt-1">Fila geral de tickets e demandas.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar tickets..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-dark-800 border border-dark-600 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64"
            />
          </div>
          <select 
            className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos os Status</option>
            <option value="Aberto">Aberto</option>
            <option value="Em Atendimento">Em Atendimento</option>
            <option value="Escalado N2">Escalado N2</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-dark-900/50 text-gray-400 border-b border-dark-600">
              <tr>
                <th className="px-6 py-4 font-medium">Ticket ID</th>
                <th className="px-6 py-4 font-medium">Cliente / Categoria</th>
                <th className="px-6 py-4 font-medium">Prioridade</th>
                <th className="px-6 py-4 font-medium">Responsável</th>
                <th className="px-6 py-4 font-medium">Abertura / SLA</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/50 text-gray-300">
              {filteredTickets.length > 0 ? filteredTickets.map((ticket) => {
                const hoursOpen = differenceInHours(new Date(), parseISO(ticket.createdAt));
                const slaPercentage = Math.min(100, Math.round((hoursOpen / ticket.slaExpectedHours) * 100));
                const isSlaCritical = ticket.status !== 'Finalizado' && slaPercentage >= 90;

                return (
                  <tr key={ticket.id} className="hover:bg-dark-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">{ticket.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{ticket.clientName}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{ticket.company} • {ticket.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-dark-600 flex items-center justify-center text-xs font-medium overflow-hidden">
                             <img src={`https://ui-avatars.com/api/?name=${ticket.assignedTo}&background=random&color=fff`} alt="" />
                          </div>
                          <span>{ticket.assignedTo.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic text-xs">Não atribuído</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>{format(parseISO(ticket.createdAt), "dd/MM, HH:mm", { locale: ptBR })}</div>
                      {ticket.status !== 'Finalizado' ? (
                        <div className="flex items-center gap-2 mt-1 w-32">
                          <div className="h-1.5 w-full bg-dark-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isSlaCritical ? 'bg-red-500' : 'bg-primary'}`}
                              style={{ width: `${slaPercentage}%` }}
                            />
                          </div>
                          <span className={`text-xs ${isSlaCritical ? 'text-red-400 font-medium' : 'text-gray-500'}`}>
                            {ticket.slaExpectedHours}h
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Resolvido
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1.5 ${getStatusColor(ticket.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(ticket.id)} className="p-1.5 text-danger hover:text-white bg-danger/10 hover:bg-danger rounded transition-colors" title="Excluir Chamado">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setTicketDetails(ticket)} className="p-1.5 text-gray-400 hover:text-white bg-dark-800 hover:bg-dark-600 rounded transition-colors" title="Ver Detalhes">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {ticket.status === 'Aberto' && (
                          <button 
                            onClick={() => {
                              const assignees = JSON.parse(localStorage.getItem('helpdesk_assignees') || '["Lucas Ferreira"]');
                              updateStatus(ticket.id, 'Em Atendimento', assignees[0]);
                            }}
                            className="p-1.5 text-blue-400 hover:text-white bg-blue-400/10 hover:bg-blue-500/80 rounded transition-colors" title="Iniciar Atendimento"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        
                        {(ticket.status === 'Em Atendimento' || ticket.status === 'Escalado N2') && (
                          <button 
                            onClick={() => { setTicketToFinish(ticket.id); setIsFinishModalOpen(true); }}
                            className="p-1.5 text-green-400 hover:text-white bg-green-400/10 hover:bg-green-500/80 rounded transition-colors" title="Finalizar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Nenhum chamado encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal de Finalização */}
      <AnimatePresence>
        {isFinishModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-lg overflow-hidden shadow-2xl shadow-primary/20"
            >
              <div className="px-6 py-4 border-b border-dark-600 flex justify-between items-center bg-dark-900/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Finalizar Chamado {ticketToFinish}
                </h3>
                <button onClick={() => setIsFinishModalOpen(false)} className="text-gray-400 hover:text-white">
                  <AlertCircle className="w-5 h-5 rotate-45" /> {/* Use as close icon */}
                </button>
              </div>
              
              <form onSubmit={handleFinishSubmit} className="p-6 space-y-4">
                <div>
                  <label className="label-text">Solução Aplicada / Observações *</label>
                  <textarea 
                    required
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="input-field min-h-[120px]"
                    placeholder="Descreva o que foi feito para resolver o problema..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="label-text flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tempo gasto no atendimento (em minutos) *
                  </label>
                  <input 
                    required
                    type="number" 
                    value={timeSpent}
                    onChange={(e) => setTimeSpent(e.target.value)}
                    className="input-field"
                    min="1"
                    placeholder="Ex: 45"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsFinishModalOpen(false)} className="btn-secondary">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary bg-success hover:bg-success/80 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    Confirmar Encerramento
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {ticketDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-2xl overflow-hidden shadow-2xl shadow-primary/20 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-dark-600 flex justify-between items-center bg-dark-900/50 shrink-0">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Detalhes do Chamado {ticketDetails.id}
                </h3>
                <button onClick={() => setTicketDetails(null)} className="text-gray-400 hover:text-white">
                  <AlertCircle className="w-5 h-5 rotate-45" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Descrição do Problema</h4>
                  <div className="p-4 bg-dark-900 rounded-lg text-gray-200 text-sm whitespace-pre-wrap border border-dark-600">
                    {ticketDetails.description}
                  </div>
                </div>

                {ticketDetails.attachment && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Anexo / Captura de Tela</h4>
                    <div className="mt-2 border border-dark-600 rounded-lg overflow-hidden max-w-full bg-dark-900">
                      <img src={ticketDetails.attachment} alt="Anexo do Chamado" className="max-w-full h-auto max-h-[300px] object-contain" />
                    </div>
                  </div>
                )}

                {ticketDetails.resolutionNotes && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Solução Aplicada</h4>
                    <div className="p-4 bg-success/10 rounded-lg text-success text-sm whitespace-pre-wrap border border-success/20">
                      {ticketDetails.resolutionNotes}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-dark-600 bg-dark-900/50 shrink-0 flex justify-end">
                <button onClick={() => setTicketDetails(null)} className="btn-secondary">
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
