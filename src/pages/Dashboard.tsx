import React from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, Clock, CheckCircle, AlertTriangle, 
  TrendingUp, CalendarSync, BarChart3 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { useTickets } from '../context/TicketContext';

export const Dashboard = () => {
  const { tickets } = useTickets();

  const totalAbertos = tickets.filter(t => t.status === 'Aberto').length;
  const emAtendimento = tickets.filter(t => t.status === 'Em Atendimento').length;
  const finalizados = tickets.filter(t => t.status === 'Finalizado').length;
  const slaCritico = tickets.filter(t => t.status !== 'Finalizado' && t.priority === 'Crítica').length;
  
  // Mocks for charts
  const statusData = [
    { name: 'Aberto', value: totalAbertos, color: '#3B82F6' },
    { name: 'Em Atend.', value: emAtendimento, color: '#F59E0B' },
    { name: 'Finalizado', value: finalizados, color: '#10B981' },
    { name: 'Escalado N2', value: tickets.filter(t => t.status === 'Escalado N2').length, color: '#EF4444' },
  ];

  const analystData = [
    { name: 'Carlos M.', chamados: 0 },
    { name: 'Ana P.', chamados: 0 },
    { name: 'Marcos S.', chamados: 0 },
    { name: 'Julia R.', chamados: 0 },
  ];

  const productivityData = [
    { name: 'Seg', resolvidos: 0, abertos: 0 },
    { name: 'Ter', resolvidos: 0, abertos: 0 },
    { name: 'Qua', resolvidos: 0, abertos: 0 },
    { name: 'Qui', resolvidos: 0, abertos: 0 },
    { name: 'Sex', resolvidos: 0, abertos: 0 },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel p-6 relative overflow-hidden group"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${colorClass.bg}`}></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass.bg} bg-opacity-20 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.1)] ${colorClass.shadow}`}>
          <Icon className={`w-6 h-6 ${colorClass.text}`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Visão geral e métricas de atendimento</p>
        </div>
        <button className="btn-primary">
          <CalendarSync className="w-4 h-4" />
          Últimos 30 dias
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Abertos Hoje" value={totalAbertos} icon={Ticket} colorClass={{ bg: 'bg-primary', text: 'text-primary', shadow: 'shadow-neon' }} delay={0.1} />
        <StatCard title="Em Atendimento" value={emAtendimento} icon={Clock} colorClass={{ bg: 'bg-warning', text: 'text-warning', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' }} delay={0.2} />
        <StatCard title="Finalizados" value={finalizados} icon={CheckCircle} colorClass={{ bg: 'bg-success', text: 'text-success', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' }} delay={0.3} />
        <StatCard title="SLA Crítico" value={slaCritico} icon={AlertTriangle} colorClass={{ bg: 'bg-danger', text: 'text-danger', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' }} delay={0.4} />
        <StatCard title="Tempo Médio" value="0h 00m" icon={TrendingUp} colorClass={{ bg: 'bg-accent', text: 'text-accent', shadow: 'shadow-neon-accent' }} delay={0.5} />
        <StatCard title="Demandas (Mês)" value="0" icon={BarChart3} colorClass={{ bg: 'bg-purple-500', text: 'text-purple-400', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]' }} delay={0.6} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chamados por Analista */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="glass-panel p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Produtividade Semanal</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A364F" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF' }} />
                <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131A2A', borderColor: '#2A364F', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Line type="monotone" dataKey="resolvidos" name="Resolvidos" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="abertos" name="Abertos" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Pizza */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-panel p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Distribuição por Status</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131A2A', borderColor: '#2A364F', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Analistas Barras */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="glass-panel p-6 lg:col-span-3"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Chamados por Analista (Ativos)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analystData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A364F" vertical={false} />
                <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF' }} />
                <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  cursor={{ fill: '#2A364F', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#131A2A', borderColor: '#2A364F', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="chamados" name="Chamados em Andamento" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
