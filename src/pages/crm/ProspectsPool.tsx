import { useState } from 'react';
import { useStore } from '../../store';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Trash2, 
  Mail, 
  Phone, 
  ExternalLink,
  Target,
  MoreVertical,
  X,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../lib/utils';
import CRMModuleLayout from './CRMModuleLayout';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Prospect } from '../../types';

import { sourceProspectsWithAI } from '../../services/crmService';

export default function ProspectsPool() {
  const { prospects, addProspect, updateProspect, deleteProspect } = useStore();
  const [search, setSearch] = useState('');
  const [isAISourcing, setIsAISourcing] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectedReasons, setRejectedReasons] = useState<string[]>([]);

  const filteredProspects = prospects.filter(p => 
    p.companyName.toLowerCase().includes(search.toLowerCase()) ||
    p.sector.toLowerCase().includes(search.toLowerCase())
  );

  const startAISourcing = async () => {
    setIsAISourcing(true);
    try {
      const result = await sourceProspectsWithAI(prospects, rejectedReasons);
      const newProspect: Prospect = {
        id: Math.random().toString(36).substr(2, 9),
        companyName: result.companyName || "Nouveau Prospect",
        sector: result.sector || "Tertiaire",
        contactName: result.contactName || "À définir",
        email: result.email || "",
        phone: result.phone || "",
        score: result.score || 75,
        stage: 'new',
        createdAt: new Date().toISOString(),
        notes: result.notes,
        suggestedByAI: true,
      };
      addProspect(newProspect);
      toast.success("Nouveau prospect identifié par l'IA !", {
        description: result.notes
      });
    } catch (error) {
      toast.error("Erreur lors du sourcing IA");
    } finally {
      setIsAISourcing(false);
    }
  };

  const handleReject = () => {
    if (rejectingId && rejectionReason) {
      setRejectedReasons(prev => [...prev, rejectionReason]);
      deleteProspect(rejectingId, rejectionReason);
      setRejectingId(null);
      setRejectionReason('');
      toast('Feedback enregistré', { description: "L'IA affinera ses futures suggestions." });
    }
  };

  return (
    <CRMModuleLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Bassin de Prospects</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sourcing intelligent & Qualification</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={startAISourcing}
             disabled={isAISourcing}
             className={cn(
               "flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100",
               isAISourcing && "opacity-50 cursor-not-allowed"
             )}
           >
             {isAISourcing ? (
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                 IA en cours...
               </div>
             ) : (
               <>
                 <Sparkles size={16} /> AI Sourcing
               </>
             )}
           </button>
           <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Plus size={20} />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Chercher par nom, secteur..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:bg-white transition-all"
              />
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>{filteredProspects.length} Prospect(s)</span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom / Client</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score IA</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Secteur</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Étape</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredProspects.map((p) => (
                  <motion.tr 
                    key={p.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                           "p-2 rounded-xl flex items-center justify-center text-white",
                           p.score > 80 ? "bg-emerald-500 shadow-emerald-100 shadow-lg" : "bg-slate-800"
                         )}>
                            {p.suggestedByAI ? <Sparkles size={16} /> : <Target size={16} />}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{p.companyName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.contactName}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={cn(
                         "text-xs font-black p-1.5 rounded-lg",
                         p.score > 80 ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-50"
                       )}>{p.score}%</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 rounded-md px-2 py-0.5">{p.sector}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={cn(
                         "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                         p.stage === 'new' ? "bg-blue-100 text-blue-700 border-blue-200" :
                         p.stage === 'contacted' ? "bg-amber-100 text-amber-700 border-amber-200" :
                         "bg-green-100 text-green-700 border-green-200"
                       )}>
                         {p.stage}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <button className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"><Mail size={14} /></button>
                          <button className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"><Phone size={14} /></button>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => updateProspect(p.id, { stage: 'qualified' })}
                            className="text-[10px] font-black uppercase text-blue-600 hover:underline"
                          >
                            Qualifier
                          </button>
                          <button 
                            onClick={() => setRejectingId(p.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {rejectingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setRejectingId(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pourquoi rejeter ce prospect ?</h3>
              </div>

              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 leading-relaxed">
                Votre feedback est essentiel. Il aide l'algorithme Gemini à mieux cibler vos besoins futurs.
              </p>

              <div className="space-y-3">
                 {[
                   "Secteur d'activité inadapté",
                   "Taille d'entreprise trop petite",
                   "Concurrent déjà implémenté",
                   "Localisation hors zone"
                 ].map((reason) => (
                   <button 
                    key={reason}
                    onClick={() => setRejectionReason(reason)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border-2 transition-all font-bold text-sm",
                      rejectionReason === reason ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-100 hover:border-slate-200 text-slate-600"
                    )}
                   >
                     {reason}
                   </button>
                 ))}
                 <input 
                  placeholder="Autre raison..."
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-300 outline-none text-sm font-bold"
                  onChange={(e) => setRejectionReason(e.target.value)}
                 />
              </div>

              <div className="mt-8 flex gap-3">
                 <button 
                  onClick={() => setRejectingId(null)}
                  className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                 >
                   Annuler
                 </button>
                 <button 
                  onClick={handleReject}
                  disabled={!rejectionReason}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-slate-200"
                 >
                   Confirmer & Envoyer
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CRMModuleLayout>
  );
}
