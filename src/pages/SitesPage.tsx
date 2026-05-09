import { useState } from 'react';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { Search, Plus, Filter, Building2, MapPin, MoreVertical, ScanLine, Clock, Star, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import Modal from '../components/ui/Modal';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

const siteSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  clientId: z.string().min(1, 'Le client est requis'),
  address: z.string().min(5, 'L\'adresse est requise'),
  city: z.string().min(2, 'La ville est requise'),
  surface: z.number().min(1, 'La surface doit être supérieure à 0'),
  frequency: z.enum(['Quotidien', '3 fois / semaine', '2 fois / semaine', '1 fois / semaine', '1 fois / mois']),
  assignedAgentIds: z.array(z.string()),
  qualityScore: z.number().min(0).max(100),
  status: z.enum(['active', 'inactive']),
});

type SiteFormValues = z.infer<typeof siteSchema>;

export default function SitesPage() {
  const { sites, clients, agents, addSite, updateSite, deleteSite } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SiteFormValues>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      frequency: 'Quotidien',
      status: 'active',
      assignedAgentIds: [],
    }
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Client Inconnu';

  const filteredSites = sites.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.city.toLowerCase().includes(search.toLowerCase()) ||
    getClientName(s.clientId).toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = (data: SiteFormValues) => {
    if (editingSite) {
      updateSite(editingSite, data as any);
      toast.success('Site mis à jour avec succès');
    } else {
      const newSite = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        type: clients.find(c => c.id === data.clientId)?.type || 'entreprise',
      };
      addSite(newSite as any);
      toast.success('Site créé avec succès');
    }
    setIsModalOpen(false);
    setEditingSite(null);
    reset();
  };

  const handleEdit = (site: any) => {
    setEditingSite(site.id);
    reset(site);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
      deleteSite(id);
      toast.success('Site supprimé');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des Sites</h2>
          <p className="text-slate-500 font-medium">Visualisez et gérez les lieux d'intervention de vos agents.</p>
        </div>
        <button 
          onClick={() => {
            setEditingSite(null);
            reset({ frequency: 'Quotidien', status: 'active', assignedAgentIds: [] });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 shrink-0"
        >
          <Plus size={18} />
          Nouveau Site
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative flex-1 w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, ville, client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
          {filteredSites.map((site, i) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-100 transition-all group flex flex-col"
            >
              <div className="h-2 bg-blue-600 w-full"></div>
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="bg-slate-100 p-2.5 rounded-xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Building2 size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg">
                    <Star size={10} fill="currentColor" />
                    {site.qualityScore}/100
                  </div>
                </div>
                
                <div 
                  className="cursor-pointer"
                  onClick={() => navigate(`/sites/${site.id}`)}
                >
                  <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{site.name}</h4>
                  <p className="text-xs font-bold text-slate-400 underline decoration-slate-200 mt-1">{getClientName(site.clientId)}</p>
                </div>

                <div className="flex items-start gap-2 text-slate-500">
                  <MapPin size={16} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed italic">{site.address}, {site.city}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 px-3 py-2 rounded-xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Surface</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <ScanLine size={12} className="text-slate-400" />
                      <span className="text-xs font-black">{site.surface} m²</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-3 py-2 rounded-xl">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Fréquence</p>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-xs font-black">{site.frequency}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {(site.assignedAgentIds || []).slice(0, 3).map((aid) => (
                    <div key={aid} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${aid}`} alt="Agent" />
                    </div>
                  ))}
                  {(site.assignedAgentIds || []).length > 3 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 italic">
                      +{(site.assignedAgentIds || []).length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => navigate(`/sites/${site.id}`)}
                    className="text-xs font-bold text-blue-600 hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Détail
                  </button>
                  <button 
                    onClick={() => handleEdit(site)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(site.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingSite(null);
        }}
        title={editingSite ? "Modifier Site" : "Nouveau Site"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Nom du site</label>
            <input 
              {...register('name')}
              placeholder="Ex: Bureau Plus — Étage 1"
              className={cn(
                "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                errors.name ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              )}
            />
            {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Client</label>
            <select 
              {...register('clientId')}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            {errors.clientId && <p className="text-[10px] text-red-500 font-bold">{errors.clientId.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Adresse</label>
              <input 
                {...register('address')}
                className={cn(
                  "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                  errors.address ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                )}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Ville</label>
              <input 
                {...register('city')}
                className={cn(
                  "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                  errors.city ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Surface (m²)</label>
              <input 
                type="number"
                {...register('surface', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Fréquence</label>
              <select 
                {...register('frequency')}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              >
                <option value="Quotidien">Quotidien</option>
                <option value="3 fois / semaine">3 fois / semaine</option>
                <option value="2 fois / semaine">2 fois / semaine</option>
                <option value="1 fois / semaine">1 fois / semaine</option>
                <option value="1 fois / mois">1 fois / mois</option>
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
              {editingSite ? "Mettre à jour" : "Créer le site"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

