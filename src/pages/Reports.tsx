import React from 'react';
import { useTickets } from '../context/TicketContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const Reports = () => {
  const { tickets } = useTickets();

  // Aggregate mock data based on tickets context or static values
  const closedTickets = tickets.filter(t => t.status === 'Finalizado');
  const slaMetCount = closedTickets.filter(t => t.slaMet).length;
  const slaPercentage = closedTickets.length > 0 ? Math.round((slaMetCount / closedTickets.length) * 100) : 100;

  const data = [
    { name: 'Seg', chamados: 0 },
    { name: 'Ter', chamados: 0 },
    { name: 'Qua', chamados: 0 },
    { name: 'Qui', chamados: 0 },
    { name: 'Sex', chamados: 0 },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Relatórios Gerenciais</h1>
          <p className="text-gray-400 text-sm mt-1">Análise de desempenho e métricas avançadas.</p>
        </div>
        <button className="btn-secondary">
          <Download className="w-4 h-4" />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
          <h3 className="text-gray-400 font-medium mb-2">Total Resolvidos (Mês)</h3>
          <div className="text-3xl font-bold text-white mb-2">{closedTickets.length}</div>
          <p className="text-gray-500 text-sm flex items-center gap-1">Aguardando dados</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6">
          <h3 className="text-gray-400 font-medium mb-2">Dentro do SLA</h3>
          <div className="text-3xl font-bold text-white mb-2">{slaPercentage}%</div>
          <div className="w-full bg-dark-600 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-success h-full rounded-full" style={{ width: `${slaPercentage}%` }}></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 border-l-4 border-primary">
          <h3 className="text-gray-400 font-medium mb-2">Tempo Médio Resolução</h3>
          <div className="text-3xl font-bold text-white mb-2">0h 00m</div>
          <p className="text-primary text-sm flex items-center gap-1">Meta: 2h 00m</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-panel p-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Volume de Chamados por Dia (Última Semana)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A364F" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF' }} />
              <Tooltip 
                cursor={{ fill: '#2A364F', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#131A2A', borderColor: '#2A364F', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="chamados" name="Chamados" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
