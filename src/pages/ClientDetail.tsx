import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { cn } from '../lib/utils';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  Plus,
  ChevronRight,
  User,
  History,
  TrendingUp,
  Settings
} from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';
import { motion } from 'motion/react';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients, sites, interventions, invoices } = useStore();

  const client = clients.find(c => c.id === id);
  const clientSites = sites.filter(s => s.clientId === id);
  const clientInterventions = interventions.filter(i => i.clientId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const clientInvoices = invoices.filter(i => i.clientId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!client) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Client non trouvé</h2>
        <button onClick={() => navigate('/clients')} className="mt-4 text-blue-600 font-bold">Retour à la liste</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/clients')}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{client.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-widest">{client.type}</span>
            <span className="text-xs font-bold text-slate-400">Client depuis 2024</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Informations de contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><User size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact principal</p>
                  <p className="text-sm font-bold text-slate-900">{client.contactName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold text-slate-900">{client.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Phone size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</p>
                  <p className="text-sm font-bold text-slate-900">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MapPin size={18} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Siège social</p>
                  <p className="text-sm font-bold text-slate-900">{client.address}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-50">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Statistiques clés</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Sites</p>
                    <p className="text-lg font-black text-slate-900">{clientSites.length}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase">MRR</p>
                    <p className="text-lg font-black text-blue-600">{formatCurrency(client.monthlyRevenue)}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sites and Interventions */}
        <div className="md:col-span-2 space-y-8">
          {/* Sites Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Sites & Lieux ({clientSites.length})</h3>
              <button onClick={() => navigate('/sites')} className="text-xs font-black text-blue-600 uppercase flex items-center gap-1 hover:gap-2 transition-all">
                Voir tout <Plus size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientSites.map(site => (
                <div 
                  key={site.id} 
                  className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm hover:border-blue-400 transition-all cursor-pointer group"
                  onClick={() => navigate(`/sites/${site.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <MapPin size={20} />
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase tracking-widest">{site.frequency}</span>
                  </div>
                  <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{site.name}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1 truncate">{site.address}, {site.city}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 uppercase">Activité Récente</h3>
               <div className="flex gap-2">
                 <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">Interventions</button>
                 <button className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">Factures</button>
               </div>
            </div>
            <div className="divide-y divide-slate-100">
              {clientInterventions.slice(0, 5).map(inter => (
                <div key={inter.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/interventions/${inter.id}`)}>
                   <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-xl text-white",
                        inter.status === 'completed' ? "bg-green-500" : "bg-blue-500"
                      )}>
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{formatDate(new Date(inter.date))} • {inter.startTime}</p>
                        <p className="text-xs font-bold text-slate-400">{sites.find(s => s.id === inter.siteId)?.name}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded bg-slate-100 uppercase tracking-widest",
                        inter.status === 'completed' ? "text-green-600" : "text-blue-600"
                      )}>{inter.status === 'completed' ? 'Terminé' : 'Planifié'}</span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                   </div>
                </div>
              ))}
              {clientInterventions.length === 0 && (
                <div className="p-10 text-center text-slate-400 font-bold uppercase text-xs">Aucune intervention récente</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
