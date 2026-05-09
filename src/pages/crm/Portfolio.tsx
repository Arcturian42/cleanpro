import { useState } from 'react';
import { useStore } from '../../store';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight,
  TrendingUp,
  Mail,
  Phone,
  Building2,
  FileText,
  Upload,
  MoreVertical,
  Trash2,
  Edit2,
  Clock
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import CRMModuleLayout from './CRMModuleLayout';
import { motion, AnimatePresence } from 'motion/react';

export default function Portfolio() {
  const { clients, deleteClient } = useStore();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contactName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CRMModuleLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Client List */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="relative mb-6">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Rechercher client..."
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:bg-white transition-all"
                 />
              </div>
              <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                 {filteredClients.map((client) => (
                    <button 
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-2xl transition-all group",
                        selectedClient?.id === client.id 
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-200 ring-4 ring-slate-50" 
                          : "hover:bg-slate-50 text-slate-600"
                      )}
                    >
                       <div className="flex justify-between items-start">
                          <p className="text-xs font-black uppercase tracking-tight truncate flex-1">{client.name}</p>
                          <ChevronRight size={14} className={cn(
                            "opacity-0 transition-opacity",
                            selectedClient?.id === client.id ? "opacity-100" : "group-hover:opacity-40"
                          )} />
                       </div>
                       <p className={cn(
                         "text-[10px] font-bold mt-1",
                         selectedClient?.id === client.id ? "text-slate-400" : "text-slate-400"
                       )}>{formatCurrency(client.monthlyRevenue)} / mois</p>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Client Detail / Success Dashboard */}
        <div className="lg:col-span-3 space-y-8">
           {selectedClient ? (
             <motion.div 
               key={selectedClient.id}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-8"
             >
                {/* Header */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
                   
                   <div className="z-10 bg-white/40 backdrop-blur-sm">
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">{selectedClient.name}</h2>
                      <div className="flex flex-wrap items-center gap-4">
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-slate-500">
                            <Building2 size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{selectedClient.type}</span>
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl text-emerald-600">
                            <TrendingUp size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Compte Actif</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col items-end gap-2 z-10 bg-white/40 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">MRR (Revenu Récurrent)</p>
                      <h3 className="text-4xl font-black text-blue-600 tracking-tighter">{formatCurrency(selectedClient.monthlyRevenue)}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Prochaine facture: 01/06/2026</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Info Card */}
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                      <div className="flex items-center justify-between">
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Informations Générales</h3>
                         <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                         <div className="flex items-start gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><Mail size={18} /></div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Principal</p>
                               <p className="text-sm font-bold text-slate-900">{selectedClient.contactName}</p>
                               <p className="text-xs font-bold text-blue-600">{selectedClient.email}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><Phone size={18} /></div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                               <p className="text-sm font-bold text-slate-900">{selectedClient.phone}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><Building2 size={18} /></div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Adresse Siège</p>
                               <p className="text-sm font-bold text-slate-900">{selectedClient.address}</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Actions & Health */}
                   <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-8">
                      <div>
                         <h3 className="text-sm font-black uppercase tracking-widest mb-2">Customer Success</h3>
                         <p className="text-xs font-bold text-slate-400 tracking-tight">Analyse de la santé du compte et satisfaction.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white/10 p-5 rounded-3xl border border-white/10">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Score Santé</p>
                            <div className="flex items-baseline gap-2">
                               <p className="text-3xl font-black text-emerald-400">92</p>
                               <span className="text-[8px] font-black uppercase text-emerald-400/60">Excellent</span>
                            </div>
                         </div>
                         <div className="bg-white/10 p-5 rounded-3xl border border-white/10">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Ancienneté</p>
                            <p className="text-3xl font-black text-white">2.4 <span className="text-xs uppercase text-slate-400">Ans</span></p>
                         </div>
                      </div>

                      <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                         <TrendingUp size={16} /> Planifier Bilan Annuel
                      </button>
                   </div>
                </div>

                {/* Documents Management */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                   <div className="flex items-center justify-between">
                      <div>
                         <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Dossier Client Digital</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Devis, Factures & Contrats</p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                         <Upload size={14} /> Déposer un document
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "Contrat de maintenance 2026.pdf", size: "1.2 MB", type: "PDF", date: "20/01/2026" },
                        { name: "Attestation assurance RC.pdf", size: "0.8 MB", type: "PDF", date: "15/02/2026" },
                        { name: "Devis - Extension Annexe B.pdf", size: "1.5 MB", type: "PDF", date: "05/05/2026" },
                        { name: "RIB CleanPro Services.pdf", size: "0.2 MB", type: "PDF", date: "10/01/2026" }
                      ].map((doc, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-slate-200 transition-all group">
                            <div className="flex items-center gap-4">
                               <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm group-hover:scale-110 transition-transform"><FileText size={20} /></div>
                               <div>
                                  <p className="text-xs font-black text-slate-700 uppercase tracking-tight">{doc.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{doc.size} • {doc.date}</p>
                               </div>
                            </div>
                            <button className="p-2 text-slate-300 hover:text-slate-600"><MoreVertical size={16} /></button>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="flex justify-end pt-8">
                   <button 
                    onClick={() => { if(confirm('Supprimer ce client du portefeuille ?')) deleteClient(selectedClient.id); }}
                    className="flex items-center gap-2 text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-all"
                   >
                      <Trash2 size={14} /> Résiliation du contrat & Archivage
                   </button>
                </div>
             </motion.div>
           ) : (
             <div className="h-full flex items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-[3rem]">
                <div className="text-center">
                   <Building2 size={64} className="mx-auto text-slate-200 mb-4" />
                   <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Sélectionnez un client</h3>
                </div>
             </div>
           )}
        </div>
      </div>
    </CRMModuleLayout>
  );
}
