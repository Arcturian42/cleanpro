import { useState } from 'react';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  PlayCircle,
  FileText,
  Camera,
  ChevronRight,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion } from 'motion/react';
import Modal from '../components/ui/Modal';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

const interventionSchema = z.object({
  clientId: z.string().min(1, 'Le client est requis'),
  siteId: z.string().min(1, 'Le site est requis'),
  agentIds: z.array(z.string()).min(1, 'Au moins un agent est requis'),
  date: z.string().min(1, 'La date est requise'),
  startTime: z.string().min(1, 'L\'heure de début est requise'),
  endTime: z.string().min(1, 'L\'heure de fin est requise'),
  notes: z.string().optional(),
  status: z.enum(['planned', 'in_progress', 'completed', 'late']),
});

type InterventionFormValues = z.infer<typeof interventionSchema>;

export default function InterventionsPage() {
  const { interventions, clients, sites, agents, addIntervention, updateIntervention, deleteIntervention } = useStore();
  const [filter, setFilter] = useState<'all' | 'planned' | 'in_progress' | 'completed' | 'late'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<InterventionFormValues>({
    resolver: zodResolver(interventionSchema),
    defaultValues: {
      status: 'planned',
      agentIds: [],
    }
  });

  const selectedClientId = watch('clientId');
  const filteredSitesForForm = sites.filter(s => s.clientId === selectedClientId);

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Inconnu';
  const getSiteName = (id: string) => sites.find(s => s.id === id)?.name || 'Site Inconnu';
  const getAgentNames = (ids: string[]) => ids.map(id => agents.find(a => a.id === id)?.firstName).join(', ');

  const filteredInterventions = interventions.filter(inter => {
    const matchesFilter = filter === 'all' || inter.status === filter;
    const matchesSearch = 
      getClientName(inter.clientId).toLowerCase().includes(search.toLowerCase()) ||
      getSiteName(inter.siteId).toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const onSubmit = (data: InterventionFormValues) => {
    if (editingIntervention) {
      updateIntervention(editingIntervention, data as any);
      toast.success('Intervention mise à jour');
    } else {
      const newIntervention = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        photosCount: 0,
        hasReport: false,
      };
      addIntervention(newIntervention as any);
      toast.success('Intervention planifiée');
    }
    setIsModalOpen(false);
    setEditingIntervention(null);
    reset();
  };

  const handleEdit = (inter: any) => {
    setEditingIntervention(inter.id);
    reset(inter);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette intervention ?')) {
      deleteIntervention(id);
      toast.success('Intervention supprimée');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'late': return 'bg-red-100 text-red-700 border-red-200';
      case 'planned': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={12} />;
      case 'in_progress': return <PlayCircle size={12} />;
      case 'late': return <AlertCircle size={12} />;
      case 'planned': return <Calendar size={12} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Opérations Interventions</h2>
          <p className="text-slate-500 font-medium">Suivez l'exécution des prestations en temps réel sur le terrain.</p>
        </div>
        <button 
          onClick={() => {
            setEditingIntervention(null);
            reset({ status: 'planned', agentIds: [] });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 shrink-0"
        >
          <Plus size={18} />
          Planifier Intervention
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Toutes', count: interventions.length, type: 'all' },
          { label: 'En cours', count: interventions.filter(i => i.status === 'in_progress').length, type: 'in_progress' },
          { label: 'En retard', count: interventions.filter(i => i.status === 'late').length, type: 'late' },
          { label: 'Terminées', count: interventions.filter(i => i.status === 'completed').length, type: 'completed' },
        ].map(stat => (
          <button 
            key={stat.type}
            onClick={() => setFilter(stat.type as any)}
            className={cn(
              "p-4 rounded-2xl border transition-all text-left group",
              filter === stat.type 
                ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" 
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm"
            )}
          >
            <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", filter === stat.type ? "text-slate-400" : "text-slate-500")}>
              {stat.label}
            </p>
            <p className="text-2xl font-black">{stat.count}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/30">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par client ou site..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Date & Heure</th>
                <th className="px-6 py-4">Site / Client</th>
                <th className="px-6 py-4">Équipe</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Détails</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInterventions.map((inter, i) => (
                <motion.tr 
                  key={inter.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                  onClick={() => navigate(`/interventions/${inter.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex flex-col items-center justify-center font-bold text-slate-500">
                         <span className="text-[10px] leading-none uppercase">Mai</span>
                         <span className="text-lg leading-none mt-0.5">09</span>
                       </div>
                       <div>
                         <p className="text-sm font-black text-slate-900">{inter.startTime}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase italic">Durée 2h</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{getSiteName(inter.siteId)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <User size={10} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 tracking-wider ">{getClientName(inter.clientId)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="flex -space-x-2">
                         {(inter.agentIds || []).slice(0, 3).map(id => (
                           <div key={id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} alt="Agent" />
                           </div>
                         ))}
                       </div>
                       <span className="text-xs font-bold text-slate-600">{getAgentNames(inter.agentIds)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border",
                      getStatusStyle(inter.status)
                    )}>
                      {getStatusIcon(inter.status)}
                      {inter.status === 'completed' ? 'Terminée' : inter.status === 'in_progress' ? 'En cours' : inter.status === 'late' ? 'Retard' : 'Planifiée'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-1" title="Photos">
                        <Camera size={14} />
                        <span className="text-xs font-bold">{inter.photosCount}</span>
                      </div>
                      <div className={cn("flex items-center gap-1", inter.hasReport ? "text-blue-600" : "text-slate-200")}>
                        <FileText size={14} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleEdit(inter)}
                      className="p-2 text-slate-300 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(inter.id)}
                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingIntervention(null);
        }}
        title={editingIntervention ? "Modifier Intervention" : "Planifier Intervention"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Client</label>
            <select 
              {...register('clientId')}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            >
              <option value="">Sélectionner un client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Site</label>
            <select 
              {...register('siteId')}
              disabled={!selectedClientId}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">Sélectionner un site</option>
              {filteredSitesForForm.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Agents</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-slate-200 rounded-xl">
              {agents.map(agent => (
                <label key={agent.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded-lg">
                  <input 
                    type="checkbox"
                    value={agent.id}
                    {...register('agentIds')}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold">{agent.firstName} {agent.lastName}</span>
                </label>
              ))}
            </div>
            {errors.agentIds && <p className="text-[10px] text-red-500 font-bold">{errors.agentIds.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
              <input 
                type="date"
                {...register('date')}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Début</label>
              <input 
                type="time"
                {...register('startTime')}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Fin</label>
              <input 
                type="time"
                {...register('endTime')}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Statut</label>
            <select 
              {...register('status')}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            >
              <option value="planned">Planifiée</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
              <option value="late">En retard</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
            >
              {editingIntervention ? "Enregistrer" : "Planifier"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

