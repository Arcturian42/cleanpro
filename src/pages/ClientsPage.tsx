import { useState } from 'react';
import { useStore } from '../store';
import { cn, formatCurrency } from '../lib/utils';
import { Search, Plus, Filter, MoreVertical, Building, Mail, Phone, ExternalLink, Users, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import Modal from '../components/ui/Modal';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

const clientSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  type: z.enum(['syndic', 'entreprise', 'hôtel', 'clinique', 'école', 'parking', 'commerce', 'particulier']),
  contactName: z.string().min(2, 'Le nom du contact est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Téléphone invalide'),
  address: z.string().min(5, 'L\'adresse est requise'),
  monthlyRevenue: z.number().min(0),
  status: z.enum(['active', 'pending', 'late', 'inactive']),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: 'active',
      type: 'entreprise',
    }
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.contactName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = (data: ClientFormValues) => {
    if (editingClient) {
      updateClient(editingClient, data);
      toast.success('Client mis à jour avec succès');
    } else {
      const newClient = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      addClient(newClient);
      toast.success('Client créé avec succès');
    }
    setIsModalOpen(false);
    setEditingClient(null);
    reset();
  };

  const handleEdit = (client: any) => {
    setEditingClient(client.id);
    reset(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      deleteClient(id);
      toast.success('Client supprimé');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Gestion des Clients</h2>
          <p className="text-slate-500 font-medium">{clients.length} clients actifs au total.</p>
        </div>
        <button 
          onClick={() => {
            setEditingClient(null);
            reset({ status: 'active', type: 'entreprise' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 shrink-0"
        >
          <Plus size={18} />
          Nouveau Client
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, contact, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contact & Infos</th>
                <th className="px-6 py-4">Finances</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client, i) => (
                <motion.tr 
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Building size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{client.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{client.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">{client.contactName}</p>
                      <div className="flex items-center gap-3 text-slate-400">
                        <div className="flex items-center gap-1">
                          <Mail size={12} />
                          <span className="text-[10px] lowercase">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={12} />
                          <span className="text-[10px]">{client.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-black text-slate-900">{formatCurrency(client.monthlyRevenue)}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Par mois</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      client.status === 'active' ? "bg-green-100 text-green-700" : 
                      client.status === 'late' ? "bg-red-100 text-red-700" : 
                      "bg-slate-100 text-slate-500"
                    )}>
                      {client.status === 'active' ? 'Actif' : client.status === 'late' ? 'Impayé' : 'Inactif'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                       <button 
                        onClick={() => handleEdit(client)}
                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors group-hover:text-blue-600"
                       >
                         <Edit2 size={16} />
                       </button>
                       <button 
                        onClick={() => handleDelete(client.id)}
                        className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
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
        
        {filteredClients.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucun client trouvé</h3>
            <p className="text-slate-400 text-sm">Creez votre premier client !</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        title={editingClient ? "Modifier Client" : "Nouveau Client"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nom de l'entreprise</label>
              <input 
                {...register('name')}
                placeholder="Ex: Résidence Les Lilas"
                className={cn(
                  "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                  errors.name ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                )}
              />
              {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
              <select 
                {...register('type')}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              >
                <option value="syndic">Syndic</option>
                <option value="entreprise">Entreprise</option>
                <option value="hôtel">Hôtel</option>
                <option value="clinique">Clinique</option>
                <option value="école">École</option>
                <option value="parking">Parking</option>
                <option value="commerce">Commerce</option>
                <option value="particulier">Particulier</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Contact</label>
              <input 
                {...register('contactName')}
                placeholder="Nom du contact"
                className={cn(
                  "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                  errors.contactName ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                )}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
              <input 
                {...register('email')}
                placeholder="email@exemple.com"
                className={cn(
                  "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                  errors.email ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Téléphone</label>
              <input 
                {...register('phone')}
                placeholder="01 23 45 67 89"
                className={cn(
                  "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                  errors.phone ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                )}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Revenu Mensuel (€)</label>
              <input 
                type="number"
                {...register('monthlyRevenue', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Adresse</label>
            <input 
              {...register('address')}
              placeholder="Adresse complète"
              className={cn(
                "w-full px-4 py-2 border rounded-xl text-sm outline-none transition-all",
                errors.address ? "border-red-500 ring-1 ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              )}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Statut</label>
            <select 
              {...register('status')}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            >
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="late">Impayé</option>
              <option value="inactive">Inactif</option>
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
              {editingClient ? "Mettre à jour" : "Créer le client"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

