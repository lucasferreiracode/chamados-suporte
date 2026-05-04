import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Clock, Tags, UserCircle, BellRing } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const Settings = () => {
  const [slaCritical, setSlaCritical] = useState('4');
  const [slaHigh, setSlaHigh] = useState('8');
  const [slaMedium, setSlaMedium] = useState('24');
  const [slaLow, setSlaLow] = useState('48');

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    // Load from local storage
    const savedSlas = localStorage.getItem('helpdesk_slas');
    if (savedSlas) {
      const parsed = JSON.parse(savedSlas);
      setSlaCritical(parsed.critical || '4');
      setSlaHigh(parsed.high || '8');
      setSlaMedium(parsed.medium || '24');
      setSlaLow(parsed.low || '48');
    }

    const savedCategories = localStorage.getItem('helpdesk_categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(['Hardware', 'Software', 'Rede', 'Acesso', 'Outros']);
    }
  }, []);

  const handleSaveSLA = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('helpdesk_slas', JSON.stringify({
      critical: slaCritical,
      high: slaHigh,
      medium: slaMedium,
      low: slaLow
    }));
    toast.success('Metas de SLA atualizadas com sucesso!');
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updated = [...categories, newCategory.trim()];
      setCategories(updated);
      localStorage.setItem('helpdesk_categories', JSON.stringify(updated));
      setNewCategory('');
      toast.success('Categoria adicionada!');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    localStorage.setItem('helpdesk_categories', JSON.stringify(updated));
    toast.error('Categoria removida.');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-dark-600/50 pb-4">
        <div className="p-3 bg-dark-800 rounded-xl border border-dark-600">
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Configurações do Sistema</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie os parâmetros globais da plataforma de Help Desk.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SLA Configs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
            <Clock className="w-5 h-5 text-accent" />
            Metas de SLA (Horas)
          </div>

          <form onSubmit={handleSaveSLA} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text text-danger">Prioridade Crítica</label>
                <div className="relative">
                  <input type="number" min="1" value={slaCritical} onChange={e => setSlaCritical(e.target.value)} className="input-field pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">h</span>
                </div>
              </div>
              <div>
                <label className="label-text text-warning">Prioridade Alta</label>
                <div className="relative">
                  <input type="number" min="1" value={slaHigh} onChange={e => setSlaHigh(e.target.value)} className="input-field pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">h</span>
                </div>
              </div>
              <div>
                <label className="label-text text-yellow-400">Prioridade Média</label>
                <div className="relative">
                  <input type="number" min="1" value={slaMedium} onChange={e => setSlaMedium(e.target.value)} className="input-field pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">h</span>
                </div>
              </div>
              <div>
                <label className="label-text text-success">Prioridade Baixa</label>
                <div className="relative">
                  <input type="number" min="1" value={slaLow} onChange={e => setSlaLow(e.target.value)} className="input-field pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">h</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button type="submit" className="btn-primary w-full flex justify-center gap-2">
                <Save className="w-4 h-4" />
                Salvar SLAs
              </button>
            </div>
          </form>
        </motion.div>

        {/* Categories Configs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
            <Tags className="w-5 h-5 text-primary" />
            Categorias de Chamados
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCategory} 
                onChange={e => setNewCategory(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                placeholder="Nova categoria..." 
                className="input-field flex-1"
              />
              <button type="button" onClick={handleAddCategory} className="btn-primary bg-dark-700 hover:bg-dark-600 text-white shadow-none">
                Adicionar
              </button>
            </div>

            <div className="bg-dark-900 border border-dark-600 rounded-lg p-2 flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {categories.map((cat, i) => (
                <div key={i} className="px-3 py-1 bg-dark-800 border border-dark-600 rounded-full text-sm text-gray-300 flex items-center gap-2">
                  {cat}
                  <button onClick={() => handleRemoveCategory(cat)} className="text-gray-500 hover:text-danger">&times;</button>
                </div>
              ))}
              {categories.length === 0 && <span className="text-sm text-gray-500 p-2">Nenhuma categoria configurada.</span>}
            </div>
          </div>
        </motion.div>

        {/* User Preferences (Dummy) */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 md:col-span-2"
        >
          <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
            <UserCircle className="w-5 h-5 text-purple-400" />
            Preferências Pessoais
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-600">
              <div className="flex items-center gap-3">
                <BellRing className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Notificações Sonoras</h4>
                  <p className="text-xs text-gray-500">Tocar som ao receber novo chamado</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
