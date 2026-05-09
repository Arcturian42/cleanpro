import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus,
  ChevronRight,
  TrendingUp,
  History,
  ShieldCheck,
  Star,
  Award
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents, interventions, sites } = useStore();

  const agent = agents.find(a => a.id === id);
  const agentInterventions = interventions.filter(i => i.agentIds.includes(id as string)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!agent) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Agent non trouvé</h2>
        <button onClick={() => navigate('/agents')} className="mt-4 text-blue-600 font-bold">Retour à la liste</button>
      </div>
    );
  }

  const completedCount = agentInterventions.filter(i => i.status === 'completed').length;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/agents')}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 overflow-hidden shadow-sm border-2 border-white">
            <img src={agent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.firstName}`} alt={agent.firstName} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{agent.firstName} {agent.lastName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                agent.status === 'available' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              )}>{agent.status === 'available' ? 'Disponible' : 'Occupé'}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">• Chef d'équipe</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Informations Agent</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                 <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail size={18} /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Email professionnel</p>
                    <p className="text-sm font-bold text-slate-900">{agent.email}</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Phone size={18} /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Téléphone</p>
                    <p className="text-sm font-bold text-slate-900">{agent.phone}</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100"><ShieldCheck size={18} /></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Badge</p>
                    <p className="text-sm font-bold text-slate-900">Niveau 4 • Certifié</p>
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Qualité</p>
                  <div className="flex items-center justify-center gap-1 text-slate-900">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="text-xl font-black">4.9</span>
                  </div>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Missions</p>
                  <p className="text-xl font-black text-blue-600 uppercase leading-none">{completedCount}</p>
               </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
           <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 uppercase">Dernières Missions</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {agentInterventions.slice(0, 8).map(inter => {
                const site = sites.find(s => s.id === inter.siteId);
                return (
                  <div key={inter.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/interventions/${inter.id}`)}>
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{site?.name || 'Site inconnu'}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(new Date(inter.date))} • {inter.startTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest",
                          inter.status === 'completed' ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"
                        )}>{inter.status === 'completed' ? 'Terminé' : 'Planifié'}</span>
                       <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                );
              })}
              {agentInterventions.length === 0 && (
                <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs">Aucune mission trouvée</div>
              )}
            </div>
           </div>
        </div>
      </div>
    </div>
  );
}
