import { useState } from 'react';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { 
  Plus, 
  Search, 
  Filter, 
  HardHat, 
  Phone, 
  Mail, 
  Calendar, 
  Award,
  MoreVertical,
  ExternalLink,
  ChevronRight,
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

const agentSchema = z.object({
  firstName: z.string().min(2, 'Le prénom est requis'),
  lastName: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Téléphone invalide'),
  role: z.enum(['terrain', 'chef', 'superviseur']),
  status: z.enum(['available', 'busy', 'break', 'absent']),
});

type AgentFormValues = z.infer<typeof agentSchema>;

export default function AgentsPage() {
  const { agents, addAgent, updateAgent, deleteAgent } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AgentFormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      role: 'terrain',
      status: 'available',
    }
  });

  const filteredAgents = agents.filter(a => 
    a.firstName.toLowerCase().includes(search.toLowerCase()) || 
    a.lastName.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = (data: AgentFormValues) => {
    if (editingAgent) {
      updateAgent(editingAgent, data);
      toast.success('Agent mis à jour avec succès');
    } else {
      const newAgent = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}${Math.random()}`,
      };
      addAgent(newAgent);
      toast.success('Agent ajouté avec succès');
    }
    setIsModalOpen(false);
    setEditingAgent(null);
    reset();
  };

  const handleEdit = (agent: any) => {
    setEditingAgent(agent.id);
    reset(agent);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
      deleteAgent(id);
      toast.success('Agent supprimé');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des Agents</h2>
          <p className="text-slate-500 font-medium">Suivez la disponibilité et les performances de vos équipes de terrain.</p>
        </div>
        <button 
          onClick={() => {
            setEditingAgent(null);
            reset({ role: 'terrain', status: 'available' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 shrink-0"
        >
          <Plus size={18} />
          Ajouter un Agent
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un agent par nom ou compétence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgents.map((agent, i) => (
          <motion.div 
            key={agent.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-100 transition-all group relative overflow-hidden flex flex-col"
          >
            <div className="flex items-start gap-4 mb-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <img src={agent.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.firstName}`} alt={agent.firstName} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                   <h4 className="text-lg font-black text-slate-900 truncate tracking-tight">{agent.firstName} {agent.lastName}</h4>
                </div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{agent.role}</p>
                <div className={cn(
                  "inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border",
                  agent.status === 'available' ? "bg-green-100 text-green-700 border-green-200" : 
                  agent.status === 'busy' ? "bg-blue-100 text-blue-700 border-blue-200" :
                  "bg-orange-100 text-orange-700 border-orange-200"
                )}>
                  {agent.status === 'available' ? 'Disponible' : agent.status === 'busy' ? 'En mission' : 'En pause'}
                </div>
              </div>
            </div>

            <div className="space-y-3 relative z-10 flex-1">
               <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone size={14} />
                  </div>
                  <span className="text-xs font-bold">{agent.phone}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail size={14} />
                  </div>
                  <span className="text-xs font-bold truncate">{agent.email}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 relative z-10 pt-6 border-t border-slate-50">
               <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Score Qualité</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full w-[94%]"></div>
                    </div>
                    <span className="text-xs font-black text-emerald-600 uppercase">94%</span>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Missions/Sem</p>
                  <p className="text-sm font-black text-slate-800 tracking-tighter">12 / 15</p>
               </div>
            </div>

            <div className="mt-6 flex items-center gap-2 relative z-10">
              <button 
                onClick={() => navigate(`/agents/${agent.id}`)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 text-xs font-black py-2.5 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Calendar size={14} />
                Profil
              </button>
              <button 
                onClick={() => handleEdit(agent)}
                className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(agent.id)}
                className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingAgent(null);
        }}
        title={editingAgent ? "Modifier Agent" : "Ajouter un Agent"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
              <input 
                {...register('firstName')}
                className={cn(
                  "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                  errors.firstName ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                )}
              />
              {errors.firstName && <p className="text-[10px] text-red-500 font-bold">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
              <input 
                {...register('lastName')}
                className={cn(
                  "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                  errors.lastName ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                )}
              />
              {errors.lastName && <p className="text-[10px] text-red-500 font-bold">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
            <input 
              {...register('email')}
              placeholder="marie@cleanpro.demo"
              className={cn(
                "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                errors.email ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              )}
            />
            {errors.email && <p className="text-[10px] text-red-500 font-bold">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Téléphone</label>
            <input 
              {...register('phone')}
              placeholder="06 12 34 56 78"
              className={cn(
                "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                errors.phone ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Rôle</label>
              <select 
                {...register('role')}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              >
                <option value="terrain">Terrain</option>
                <option value="chef">Chef d'équipe</option>
                <option value="superviseur">Superviseur</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Statut</label>
              <select 
                {...register('status')}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              >
                <option value="available">Disponible</option>
                <option value="busy">En mission</option>
                <option value="break">En pause</option>
                <option value="absent">Absent</option>
              </select>
            </div>
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
              {editingAgent ? "Mettre à jour" : "Ajouter l'agent"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


