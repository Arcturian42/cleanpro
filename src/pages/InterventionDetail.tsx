import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Camera, 
  FileText,
  Building2,
  Users,
  AlertTriangle,
  PlayCircle,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { cn } from '../lib/utils';

export default function InterventionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { interventions, sites, clients, agents } = useStore();

  const inter = interventions.find(i => i.id === id);
  const site = inter ? sites.find(s => s.id === inter.siteId) : null;
  const client = inter ? clients.find(c => c.id === inter.clientId) : null;
  const assignedAgents = inter ? agents.filter(a => inter.agentIds.includes(a.id)) : [];

  if (!inter) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Intervention non trouvée</h2>
        <button onClick={() => navigate('/interventions')} className="mt-4 text-blue-600 font-bold uppercase text-xs tracking-widest border border-blue-100 px-4 py-2 rounded-xl">Retour à la liste</button>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'late': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/interventions')}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Intervention #{inter.id.slice(-4).toUpperCase()}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                getStatusStyle(inter.status)
              )}>{inter.status}</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">• {formatDate(new Date(inter.date))}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50">
             <FileText size={16} /> Rapport PDF
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
             <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-blue-600 transition-all"><Building2 size={18} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Site</p>
                    <p className="text-sm font-bold text-slate-900">{site?.name}</p>
                    <p className="text-[10px] font-medium text-slate-400">{site?.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><User size={18} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Client</p>
                    <p className="text-sm font-bold text-blue-600">{client?.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Clock size={18} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Horaires</p>
                    <p className="text-sm font-bold text-slate-900">{inter.startTime} - {inter.endTime}</p>
                  </div>
                </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Équipe Intervenante</h3>
              <div className="space-y-3">
                {assignedAgents.map(a => (
                   <div key={a.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden">
                        <img src={a.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${a.firstName}`} alt={a.firstName} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{a.firstName} {a.lastName}</span>
                   </div>
                ))}
              </div>
           </div>
        </div>

        {/* Report / Details Column */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
              <div className="space-y-2">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Rapport d'exécution</h3>
                 <p className="text-slate-500 font-medium text-sm leading-relaxed">
                   {inter.notes || "Aucune note particulière pour cette intervention."}
                 </p>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checklist de maintenance</h4>
                 <div className="space-y-2">
                    {[
                      "Contrôle des zones communes",
                      "Nettoyage des surfaces tactiles",
                      "Vérification des approvisionnements consommables",
                      "Gestion des déchets et tri sélectif"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-xs font-bold text-slate-700">{item}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Photos du chantier</h4>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-200 border-dashed">
                          <Camera size={24} />
                       </div>
                    ))}
                 </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Rapport validé par le client</span>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Signature</p>
                    <div className="w-32 h-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-300 italic text-[10px] font-serif">Signature client</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
