import { useStore } from '../../store';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Target,
  DollarSign,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { formatCurrency } from '../../lib/utils';
import CRMModuleLayout from './CRMModuleLayout';

const DATA = [
  { name: 'Jan', revenue: 45000, prospects: 12 },
  { name: 'Fév', revenue: 52000, prospects: 18 },
  { name: 'Mar', revenue: 48000, prospects: 15 },
  { name: 'Avr', revenue: 61000, prospects: 22 },
  { name: 'Mai', revenue: 59000, prospects: 20 },
  { name: 'Juin', revenue: 72000, prospects: 28 },
];

const PIPELINE_DATA = [
  { name: 'Découverte', value: 12, color: '#94a3b8' },
  { name: 'Proposition', value: 8, color: '#6366f1' },
  { name: 'Négociation', value: 5, color: '#f59e0b' },
  { name: 'Clôturé', value: 3, color: '#10b981' },
];

export default function CRMDashboard() {
  const { clients, prospects, opportunities } = useStore();

  const totalMRR = clients.reduce((acc, c) => acc + c.monthlyRevenue, 0);
  const conversionRate = 12.5; // Calculated or mock

  return (
    <CRMModuleLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI: MRR */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Revenu Récurrent (MRR)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{formatCurrency(totalMRR)}</h3>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
              <ArrowUpRight size={10} /> +8.4%
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">Objectif: 100k€</p>
          <div className="h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(totalMRR / 100000) * 100}%` }}></div>
          </div>
        </div>

        {/* KPI: AI Prospects */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Target size={80} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Prospects Qualifiés</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{prospects.length || 24}</h3>
            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
              IA Suggestion
            </span>
          </div>
          <div className="flex items-center gap-1 mt-6">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden -ml-1.5 first:ml-0">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=P${i}`} alt="" />
               </div>
             ))}
             <span className="text-[10px] font-black text-slate-400 ml-1">+12 Nouveaux</span>
          </div>
        </div>

        {/* KPI: Taux de conversion */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <Activity size={80} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Taux de Conversion</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{conversionRate}%</h3>
            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
              Dernier mois
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2">
             <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '12.5%' }}></div>
             </div>
          </div>
        </div>

        {/* KPI: Pipeline Value */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
            <TrendingUp size={80} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Valeur du Pipeline</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-blue-600 tracking-tighter">{formatCurrency(145000)}</h3>
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase mt-4 tracking-tighter">Probabilité moyenne: 45%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Performance Mensuelle</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenus & Nouveaux prospects</p>
            </div>
            <select className="text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-lg px-2 py-1 outline-none">
              <option value="2026">2026</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                   dataKey="name" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                   dy={10}
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   itemStyle={{ fontSize: '12px', fontWeight: 800 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8">Pipeline Ventes</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PIPELINE_DATA} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                   dataKey="name" 
                   type="category" 
                   axisLine={false} 
                   tickLine={false}
                   tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }}
                   width={80}
                />
                <Tooltip cursor={{ fill: 'transparent' }}  contentStyle={{ borderRadius: '1rem', border: 'none' }}/>
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {PIPELINE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl mt-4">
             <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temps de cycle moyen</span>
                <span className="text-xs font-bold text-slate-900">18 Jours</span>
             </div>
             <div className="h-1 bg-slate-200 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
             </div>
          </div>
        </div>
      </div>
    </CRMModuleLayout>
  );
}
