import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Users,
  Calendar, 
  Clock, 
  Settings,
  Plus,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  History,
  DoorOpen,
  Maximize2
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sites, clients, agents, interventions } = useStore();

  const site = sites.find(s => s.id === id);
  const client = site ? clients.find(c => c.id === site.clientId) : null;
  const assignedAgents = site ? agents.filter(a => site.assignedAgentIds.includes(a.id)) : [];
  const siteInterventions = interventions.filter(i => i.siteId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!site) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Site non trouvé</h2>
        <button onClick={() => navigate('/sites')} className="mt-4 text-blue-600 font-bold">Retour à la liste</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/sites')}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{site.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-widest">{client?.name}</span>
            <span className="text-xs font-bold text-slate-400">{site.address}, {site.city}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Caractéristiques</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                 <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Maximize2 size={18} /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Surface</p>
                    <p className="text-sm font-bold text-slate-900">{site.surface} m²</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Calendar size={18} /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Fréquence</p>
                    <p className="text-sm font-bold text-slate-900">{site.frequency}</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="p-2 bg-amber-50 rounded-lg text-amber-600 border border-amber-100"><TrendingUp size={18} /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Score Qualité</p>
                    <p className="text-sm font-black text-amber-600">{site.qualityScore || 0}%</p>
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
               <div className="flex items-center gap-2 mb-4">
                 <AlertTriangle size={16} className="text-orange-500" />
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Informations Accès</h3>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl text-xs font-bold text-slate-600 leading-relaxed border border-slate-100 italic">
                  {site.accessInfo || "Aucune information d'accès spécifique."}
                  {site.doorCode && <div className="mt-2 text-slate-900 not-italic">Code Porte : <span className="p-1 px-2 bg-slate-200 rounded font-black">{site.doorCode}</span></div>}
               </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Agents Assignés</h3>
             <div className="space-y-3">
               {assignedAgents.map(agent => (
                 <div key={agent.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      <img src={agent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.firstName}`} alt={agent.firstName} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{agent.firstName} {agent.lastName}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{agent.role}</p>
                    </div>
                 </div>
               ))}
               {assignedAgents.length === 0 && (
                 <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase">Aucun agent assigné</div>
               )}
             </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
           <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 uppercase">Historique d'interventions</h3>
              <button 
                onClick={() => navigate('/interventions')}
                className="bg-blue-600 text-white p-2 rounded-xl"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {siteInterventions.map(inter => (
                <div key={inter.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/interventions/${inter.id}`)}>
                   <div className="flex items-center gap-5">
                      <div className={cn(
                        "p-3 rounded-2xl flex flex-col items-center justify-center min-w-[60px]",
                        inter.status === 'completed' ? "bg-green-50 text-green-600 border border-green-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                      )}>
                        <span className="text-[10px] font-black uppercase leading-none mb-1">{inter.date.split('-')[1]}/{inter.date.split('-')[2]}</span>
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className={cn(
                             "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                             inter.status === 'completed' ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"
                           )}>{inter.status === 'completed' ? 'Terminé' : 'En cours'}</span>
                           <p className="text-xs font-black text-slate-900 tracking-tight">{inter.startTime} - {inter.endTime}</p>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                           {inter.agentIds.map(aid => agents.find(a => a.id === aid)?.firstName).join(', ')}
                        </p>
                      </div>
                   </div>
                   <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-all" />
                </div>
              ))}
              {siteInterventions.length === 0 && (
                <div className="p-20 text-center">
                  <Clock size={40} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Aucune intervention enregistrée</p>
                </div>
              )}
            </div>
           </div>
        </div>
      </div>
    </div>
  );
}
