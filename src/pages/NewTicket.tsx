import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import type { TicketPriority } from '../types';
import { Save, X, Paperclip } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewTicket = () => {
  const navigate = useNavigate();
  const { addTicket } = useTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('helpdesk_categories');
    return saved ? JSON.parse(saved) : ['Hardware', 'Software', 'Rede', 'Acesso a Sistemas', 'Outros'];
  });

  const [requestTypes, setRequestTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem('helpdesk_types');
    return saved ? JSON.parse(saved) : ['Incidente', 'Requisição', 'Dúvida', 'Melhoria'];
  });

  const [assignees, setAssignees] = useState<string[]>(() => {
    const saved = localStorage.getItem('helpdesk_assignees');
    return saved ? JSON.parse(saved) : ['Lucas Ferreira'];
  });

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
    assignedTo: '',
    attachment: '' as string,
  });

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('O arquivo é muito grande. O limite é de 2MB para não sobrecarregar o navegador.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, attachment: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'requestType' && value === 'ADD_NEW') {
      const newValue = window.prompt('Digite o novo Tipo de Solicitação:');
      if (newValue && newValue.trim()) {
        const trimmed = newValue.trim();
        const updated = [...requestTypes, trimmed];
        setRequestTypes(updated);
        localStorage.setItem('helpdesk_types', JSON.stringify(updated));
        setFormData(prev => ({ ...prev, requestType: trimmed }));
      }
      return;
    }

    if (name === 'requestType' && value === 'REMOVE_OLD') {
      const typeList = requestTypes.map((t, i) => `${i + 1}. ${t}`).join('\n');
      const toRemove = window.prompt(`Qual Tipo de Solicitação você deseja remover? Digite o NOME EXATO:\n\n${typeList}`);
      if (toRemove && requestTypes.includes(toRemove.trim())) {
        if (requestTypes.length <= 1) {
          alert('Você precisa ter pelo menos um Tipo de Solicitação.');
          return;
        }
        const updated = requestTypes.filter(t => t !== toRemove.trim());
        setRequestTypes(updated);
        localStorage.setItem('helpdesk_types', JSON.stringify(updated));
        setFormData(prev => ({ ...prev, requestType: updated[0] }));
      } else if (toRemove) {
        alert('Tipo de Solicitação não encontrado. Digite o nome exato.');
      }
      return;
    }

    if (name === 'category' && value === 'ADD_NEW') {
      const newValue = window.prompt('Digite a nova Categoria:');
      if (newValue && newValue.trim()) {
        const trimmed = newValue.trim();
        const updated = [...categories, trimmed];
        setCategories(updated);
        localStorage.setItem('helpdesk_categories', JSON.stringify(updated));
        setFormData(prev => ({ ...prev, category: trimmed }));
      }
      return;
    }

    if (name === 'category' && value === 'REMOVE_OLD') {
      const catList = categories.map((c, i) => `${i + 1}. ${c}`).join('\n');
      const toRemove = window.prompt(`Qual Categoria você deseja remover? Digite o NOME EXATO:\n\n${catList}`);
      if (toRemove && categories.includes(toRemove.trim())) {
        if (categories.length <= 1) {
          alert('Você precisa ter pelo menos uma Categoria.');
          return;
        }
        const updated = categories.filter(c => c !== toRemove.trim());
        setCategories(updated);
        localStorage.setItem('helpdesk_categories', JSON.stringify(updated));
        setFormData(prev => ({ ...prev, category: updated[0] }));
      } else if (toRemove) {
        alert('Categoria não encontrada. Digite o nome exato.');
      }
      return;
    }

    if (name === 'assignedTo' && value === 'ADD_NEW') {
      const newValue = window.prompt('Digite o nome do novo Analista/Pessoa:');
      if (newValue && newValue.trim()) {
        const trimmed = newValue.trim();
        const updated = [...assignees, trimmed];
        setAssignees(updated);
        localStorage.setItem('helpdesk_assignees', JSON.stringify(updated));
        setFormData(prev => ({ ...prev, assignedTo: trimmed }));
      }
      return;
    }

    if (name === 'assignedTo' && value === 'REMOVE_OLD') {
      const assigneeList = assignees.map((a, i) => `${i + 1}. ${a}`).join('\n');
      const toRemove = window.prompt(`Quem você deseja remover? Digite o NOME EXATO:\n\n${assigneeList}`);
      if (toRemove && assignees.includes(toRemove.trim())) {
        if (assignees.length <= 1) {
          alert('Você precisa ter pelo menos uma pessoa na lista.');
          return;
        }
        const updated = assignees.filter(a => a !== toRemove.trim());
        setAssignees(updated);
        localStorage.setItem('helpdesk_assignees', JSON.stringify(updated));
        setFormData(prev => ({ ...prev, assignedTo: '' }));
      } else if (toRemove) {
        alert('Nome não encontrado. Digite exatamente como na lista.');
      }
      return;
    }

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
                  {requestTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                  <option value="ADD_NEW" className="text-primary font-medium">+ Adicionar Novo Tipo</option>
                  <option value="REMOVE_OLD" className="text-danger font-medium">- Remover Tipo Existente</option>
                </select>
              </div>
              <div>
                <label className="label-text">Categoria *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field appearance-none">
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="ADD_NEW" className="text-primary font-medium">+ Adicionar Nova Categoria</option>
                  <option value="REMOVE_OLD" className="text-danger font-medium">- Remover Categoria Existente</option>
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
                  {assignees.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                  <option value="ADD_NEW" className="text-primary font-medium">+ Adicionar Nova Pessoa</option>
                  <option value="REMOVE_OLD" className="text-danger font-medium">- Remover Pessoa</option>
                </select>
              </div>
              <div>
                <label className="label-text">SLA Previsto (Horas)</label>
                <input type="number" name="slaExpectedHours" value={formData.slaExpectedHours} onChange={handleChange} className="input-field" min="1" max="720" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <label htmlFor="file-upload" className="text-primary hover:text-primary-neon text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer">
                <Paperclip className="w-4 h-4" />
                Anexar Arquivos ou Capturas de Tela
              </label>
              <input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAttachment} 
              />
              {formData.attachment && (
                <span className="text-xs text-green-400 flex items-center gap-1 ml-2 bg-green-400/10 px-2 py-1 rounded">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Imagem Anexada
                </span>
              )}
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
