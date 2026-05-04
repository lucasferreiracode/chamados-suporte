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
import { useState } from 'react';
import { isSameMonth, parseISO, isSameWeek, getDay, subDays, isAfter, isBefore, startOfDay, endOfDay, eachMonthOfInterval, format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Dashboard = () => {
  const { tickets } = useTickets();

  const now = new Date();

  const [dateFilter, setDateFilter] = useState('last30');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const monthsSinceApril = eachMonthOfInterval({
    start: new Date(2026, 3, 1),
    end: now
  });

  const filteredTickets = tickets.filter(t => {
    const tDate = parseISO(t.createdAt);
    if (dateFilter === 'last30') {
      return isAfter(tDate, subDays(now, 30));
    } else if (dateFilter === 'custom') {
      if (!customStart || !customEnd) return true;
      return tDate >= startOfDay(parseISO(customStart)) && tDate <= endOfDay(parseISO(customEnd));
    } else {
      const monthStart = startOfMonth(parseISO(dateFilter));
      const monthEnd = endOfMonth(parseISO(dateFilter));
      return tDate >= monthStart && tDate <= monthEnd;
    }
  });

  const totalAbertos = filteredTickets.filter(t => t.status === 'Aberto').length;
  const emAtendimento = filteredTickets.filter(t => t.status === 'Em Atendimento').length;
  const finalizados = filteredTickets.filter(t => t.status === 'Finalizado').length;
  const slaCritico = filteredTickets.filter(t => t.status !== 'Finalizado' && t.priority === 'Crítica').length;
  
  const closedTickets = filteredTickets.filter(t => t.status === 'Finalizado');
  const totalTimeSpent = closedTickets.reduce((acc, t) => acc + (t.timeSpentMinutes || 0), 0);
  const avgTimeSpent = closedTickets.length > 0 ? Math.round(totalTimeSpent / closedTickets.length) : 0;
  const avgTimeFormatted = `${Math.floor(avgTimeSpent / 60)}h ${(avgTimeSpent % 60).toString().padStart(2, '0')}m`;

  const statusData = [
    { name: 'Aberto', value: totalAbertos, color: '#3B82F6' },
    { name: 'Em Atend.', value: emAtendimento, color: '#F59E0B' },
    { name: 'Finalizado', value: finalizados, color: '#10B981' },
    { name: 'Escalado N2', value: filteredTickets.filter(t => t.status === 'Escalado N2').length, color: '#EF4444' },
  ];

  const analysts = Array.from(new Set(filteredTickets.map(t => t.assignedTo).filter(Boolean)));
  const analystData = analysts.map(name => ({
    name: name?.split(' ')[0] + ' ' + (name?.split(' ')[1]?.[0] || '') + '.',
    chamados: filteredTickets.filter(t => t.assignedTo === name && (t.status === 'Em Atendimento' || t.status === 'Escalado N2')).length
  })).filter(a => a.chamados > 0);

  if (analystData.length === 0) {
    analystData.push({ name: 'Nenhum', chamados: 0 });
  }

  const productivityData = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dayName, index) => {
    const resolvidos = filteredTickets.filter(t => t.status === 'Finalizado' && t.closedAt && getDay(parseISO(t.closedAt)) === index + 1).length;
    const abertos = filteredTickets.filter(t => getDay(parseISO(t.createdAt)) === index + 1).length;
    
    return { name: dayName, resolvidos, abertos };
  });

  const StatCard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-panel p-6 relative overflow-hidden group cursor-default"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 group-hover:scale-150 transition-all duration-500 ease-out ${colorClass.bg}`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass.bg} bg-opacity-10 backdrop-blur-sm transition-all duration-500 group-hover:bg-opacity-25 ${colorClass.shadow}`}>
          <Icon className={`w-6 h-6 ${colorClass.text}`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Visão geral e métricas de atendimento</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-dark-800 p-2 rounded-xl border border-dark-600/50">
          <div className="flex items-center gap-2 pl-2">
            <CalendarSync className="w-4 h-4 text-gray-400" />
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-dark-900 border border-dark-600 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="last30">Últimos 30 dias</option>
              {monthsSinceApril.map(m => (
                <option key={m.toISOString()} value={m.toISOString()}>
                  {format(m, 'MMMM yyyy', { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
                </option>
              ))}
              <option value="custom">Personalizado...</option>
            </select>
          </div>

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <input 
                type="date" 
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                className="bg-dark-900 border border-dark-600 rounded-lg px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-primary/50"
              />
              <span className="text-gray-500 text-sm">até</span>
              <input 
                type="date" 
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
                className="bg-dark-900 border border-dark-600 rounded-lg px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-primary/50"
              />
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Abertos Hoje" value={totalAbertos} icon={Ticket} colorClass={{ bg: 'bg-primary', text: 'text-primary', shadow: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]' }} delay={0.1} />
        <StatCard title="Em Atendimento" value={emAtendimento} icon={Clock} colorClass={{ bg: 'bg-warning', text: 'text-warning', shadow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]' }} delay={0.2} />
        <StatCard title="Finalizados" value={finalizados} icon={CheckCircle} colorClass={{ bg: 'bg-success', text: 'text-success', shadow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]' }} delay={0.3} />
        <StatCard title="SLA Crítico" value={slaCritico} icon={AlertTriangle} colorClass={{ bg: 'bg-danger', text: 'text-danger', shadow: 'group-hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]' }} delay={0.4} />
        <StatCard title="Tempo Médio" value={avgTimeFormatted} icon={TrendingUp} colorClass={{ bg: 'bg-accent', text: 'text-accent', shadow: 'group-hover:shadow-[0_0_25px_rgba(14,165,233,0.6)]' }} delay={0.5} />
        <StatCard title="Demandas (Total)" value={filteredTickets.length.toString()} icon={BarChart3} colorClass={{ bg: 'bg-purple-500', text: 'text-purple-400', shadow: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]' }} delay={0.6} />
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
                  data={statusData.some(d => d.value > 0) ? statusData : [{ name: 'Sem Dados', value: 1, color: '#374151' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {(statusData.some(d => d.value > 0) ? statusData : [{ name: 'Sem Dados', value: 1, color: '#374151' }]).map((entry, index) => (
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
