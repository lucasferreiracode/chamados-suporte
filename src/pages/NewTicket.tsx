import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import type { TicketPriority } from '../types';
import { Save, X, Paperclip, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewTicket = () => {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    department: '',
    company: '',
    phone: '',
    requestType: 'Incidente',
    category: 'Hardware',
    priority: 'Média' as TicketPriority,
    description: '',
    slaExpectedHours: 24,
    assignedTo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'slaExpectedHours' ? Number(value) : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      addTicket({
        ...formData,
        assignedTo: formData.assignedTo || null,
      });
      setIsSubmitting(false);
      navigate('/chamados');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Abrir Novo Chamado</h1>
        <p className="text-gray-400 text-sm mt-1">Preencha os detalhes da solicitação para registrar na fila.</p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações do Solicitante */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 border-b border-dark-600 pb-2">
              <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">1</span>
              Informações do Solicitante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Nome Completo *</label>
                <input required type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="input-field" placeholder="Ex: João da Silva" />
              </div>
              <div>
                <label className="label-text">Empresa *</label>
                <input required type="text" name="company" value={formData.company} onChange={handleChange} className="input-field" placeholder="Ex: TechCorp SA" />
              </div>
              <div>
                <label className="label-text">Setor/Departamento</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="input-field" placeholder="Ex: Financeiro" />
              </div>
              <div>
                <label className="label-text">Telefone/Ramal</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="(00) 00000-0000" />
              </div>
            </div>
          </div>

          {/* Detalhes Técnicos */}
          <div className="space-y-4 md:col-span-2 pt-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 border-b border-dark-600 pb-2">
              <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">2</span>
              Detalhes Técnicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-text">Tipo de Solicitação *</label>
                <select name="requestType" value={formData.requestType} onChange={handleChange} className="input-field appearance-none">
                  <option>Incidente</option>
                  <option>Requisição</option>
                  <option>Dúvida</option>
                  <option>Melhoria</option>
                </select>
              </div>
              <div>
                <label className="label-text">Categoria *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field appearance-none">
                  <option>Hardware</option>
                  <option>Software</option>
                  <option>Rede</option>
                  <option>Acesso a Sistemas</option>
                  <option>Outros</option>
                </select>
              </div>
              <div>
                <label className="label-text">Prioridade *</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="input-field appearance-none">
                  <option value="Baixa">Baixa (Até 72h)</option>
                  <option value="Média">Média (Até 24h)</option>
                  <option value="Alta">Alta (Até 8h)</option>
                  <option value="Crítica">Crítica (Até 4h)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-4 md:col-span-2 pt-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 border-b border-dark-600 pb-2">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">3</span>
              Descrição da Demanda
            </h3>
            <div>
              <label className="label-text">Descreva o problema ou solicitação detalhadamente *</label>
              <textarea 
                required
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="input-field min-h-[120px] resize-y" 
                placeholder="Informe mensagens de erro, passos para reproduzir, etc..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Atribuir a (Opcional)</label>
                <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} className="input-field appearance-none">
                  <option value="">Não atribuído (Fila geral)</option>
                  <option value="Carlos Mendes">Carlos Mendes</option>
                  <option value="Ana Paula">Ana Paula</option>
                  <option value="Marcos Silva">Marcos Silva</option>
                  <option value="Lucas Ferreira">Lucas Ferreira</option>
                </select>
              </div>
              <div>
                <label className="label-text">SLA Previsto (Horas)</label>
                <input type="number" name="slaExpectedHours" value={formData.slaExpectedHours} onChange={handleChange} className="input-field" min="1" max="720" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button type="button" className="text-primary hover:text-primary-neon text-sm font-medium flex items-center gap-2 transition-colors">
                <Paperclip className="w-4 h-4" />
                Anexar Arquivos ou Capturas de Tela
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-4 border-t border-dark-600 pt-6">
          <button 
            type="button" 
            onClick={() => navigate('/chamados')}
            className="btn-secondary"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary min-w-[200px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Registrando...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Registrar Chamado
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
};
