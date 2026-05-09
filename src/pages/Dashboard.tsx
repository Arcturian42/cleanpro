import { CheckCircle2, Clock, DollarSign, Users, AlertTriangle, FileText, ArrowUpRight, Plus, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../AuthContext';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const CHART_DATA = [
  { name: 'Lun', interventions: 8, ca: 1200 },
  { name: 'Mar', interventions: 10, ca: 1500 },
  { name: 'Mer', interventions: 15, ca: 2100 },
  { name: 'Jeu', interventions: 12, ca: 1800 },
  { name: 'Ven', interventions: 18, ca: 2800 },
  { name: 'Sam', interventions: 5, ca: 900 },
  { name: 'Dim', interventions: 2, ca: 400 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { clients, interventions, invoices, agents } = useStore();
  const navigate = useNavigate();

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Client Inconnu';
  const getSiteName = (id: string) => {
    const site = useStore.getState().sites.find(s => s.id === id);
    return site?.name || 'Site Inconnu';
  };
  const getAgentName = (id: string | string[]) => {
    const ids = Array.isArray(id) ? id : [id];
    const agent = agents.find(a => ids.includes(a.id));
    return agent ? `${agent.firstName} ${agent.lastName}` : 'Agent Inconnu';
  };

  const todayInterventions = interventions.filter(i => i.date === new Date().toISOString().split('T')[0]);
  const completedInterventions = todayInterventions.filter(i => i.status === 'completed');
  const monthCA = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.amountTTC, 0);
  const lateInvoices = invoices.filter(i => i.status === 'late').length;
  const activeAgents = agents.filter(a => a.status === 'busy').length;
  const reportsPending = interventions.filter(i => i.status === 'completed' && !i.hasReport).length;

  const KPI_CARDS = [
    { label: 'Interventions aujourd\'hui', value: todayInterventions.length.toString(), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+3 vs hier' },
    { label: 'Terminées', value: completedInterventions.length.toString(), icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', trend: `${todayInterventions.length ? Math.round((completedInterventions.length / todayInterventions.length) * 100) : 0}% de la journée` },
    { label: 'CA Total (Payé)', value: formatCurrency(monthCA), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Factures payées' },
    { label: 'Factures en retard', value: lateInvoices.toString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', trend: 'À relancer' },
    { label: 'Agents sur le terrain', value: activeAgents.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: `${agents.length} agents au total` },
    { label: 'Rapports en attente', value: reportsPending.toString(), icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'Action requise' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bonjour, {user?.name.split(' ')[0]} 👋</h2>
          <p className="text-slate-500 font-medium">Voici un aperçu de l'activité de CleanPro pour aujourd'hui.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              // Simulated PDF Export
              window.print();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Exporter PDF
          </button>
          <button 
            onClick={() => navigate('/interventions')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
          >
            <Plus size={18} />
            Opération rapide
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-slate-100 transition-all group"
          >
            <div className={cn("w-10 h-10 flex items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110", card.bg, card.color)}>
              <card.icon size={22} />
            </div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{card.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold text-slate-900">{card.value}</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-2">{card.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main activity chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Activité hebdomadaire</h3>
              <p className="text-sm text-slate-400">Nombre d'interventions par jour</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-3 text-sm font-medium outline-none text-slate-600">
              <option>7 derniers jours</option>
              <option>Ce mois</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorInter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="interventions" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorInter)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Important alerts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            Alertes prioritaires
            <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {lateInvoices + reportsPending}
            </span>
          </h3>
          <div className="space-y-4 flex-1">
            {lateInvoices > 0 && (
              <div 
                onClick={() => navigate('/billing')}
                className="p-4 rounded-xl border-l-4 flex flex-col gap-1 transition-all hover:translate-x-1 cursor-pointer bg-red-50 border-red-500"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-red-700">{lateInvoices} factures impayées</h4>
                  <ArrowUpRight size={14} className="opacity-40" />
                </div>
                <p className="text-xs text-slate-600 font-medium">Relancer les clients en retard de paiement.</p>
                <p className="text-[10px] text-slate-400 mt-1">Échéance dépassée</p>
              </div>
            )}
            {reportsPending > 0 && (
              <div 
                onClick={() => navigate('/reports')}
                className="p-4 rounded-xl border-l-4 flex flex-col gap-1 transition-all hover:translate-x-1 cursor-pointer bg-blue-50 border-blue-500"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-blue-700">{reportsPending} rapports en attente</h4>
                  <ArrowUpRight size={14} className="opacity-40" />
                </div>
                <p className="text-xs text-slate-600 font-medium">{reportsPending} interventions terminées sans rapport validé.</p>
                <p className="text-[10px] text-slate-400 mt-1">Action requise</p>
              </div>
            )}
            <div className="p-4 rounded-xl border-l-4 flex flex-col gap-1 transition-all hover:translate-x-1 cursor-pointer bg-orange-50 border-orange-500">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm text-orange-700">Contrôle qualité</h4>
                <ArrowUpRight size={14} className="opacity-40" />
              </div>
              <p className="text-xs text-slate-600 font-medium">Prévoyez 3 contrôles cette semaine.</p>
              <p className="text-[10px] text-slate-400 mt-1">Routine hebdomadaire</p>
            </div>
          </div>
          <button className="mt-6 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-2 p-2 px-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
            Voir toutes les alertes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Planning du jour */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Interventions récentes</h3>
            <button onClick={() => navigate('/planning')} className="text-sm font-bold text-blue-600 hover:underline">Voir tout</button>
          </div>
          <div className="divide-y divide-slate-100">
            {interventions.slice(0, 5).map((inter) => (
              <div 
                key={inter.id} 
                className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group cursor-pointer"
                onClick={() => navigate(`/interventions/${inter.id}`)}
              >
                <div className="text-center min-w-[64px]">
                  <p className="text-xs font-bold text-slate-900">{inter.startTime}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{inter.endTime}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 leading-tight">{getSiteName(inter.siteId)}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">{inter.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900">{getAgentName(inter.agentIds)}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Terrain</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${inter.id}`} alt="Agent" />
                  </div>
                </div>
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider min-w-[80px] text-center",
                  inter.status === 'completed' ? "bg-green-100 text-green-700" : 
                  inter.status === 'in_progress' ? "bg-blue-100 text-blue-700" : 
                  inter.status === 'late' ? "bg-red-100 text-red-700" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {inter.status === 'completed' ? 'Terminée' : inter.status === 'in_progress' ? 'En cours' : inter.status === 'late' ? 'Retard' : 'Planifiée'}
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Factures récentes */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Factures récentes</h3>
            <button onClick={() => navigate('/billing')} className="text-sm font-bold text-blue-600 hover:underline">Gérer la facturation</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facture</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.slice(0, 5).map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/billing/invoices/${invoice.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{invoice.number}</p>
                      <p className="text-[10px] text-slate-400">Échéance {invoice.dueDate}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-600">{getClientName(invoice.clientId)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {formatCurrency(invoice.amountTTC)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        invoice.status === 'paid' ? "bg-green-100 text-green-700" : 
                        invoice.status === 'late' ? "bg-red-100 text-red-700" : 
                        "bg-blue-100 text-blue-700"
                      )}>
                        {invoice.status === 'paid' ? 'Payée' : invoice.status === 'late' ? 'Retard' : 'Envoyée'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
