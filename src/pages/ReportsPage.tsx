import { CheckCircle2, Send, Download, Eye, FileText } from 'lucide-react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function ReportsPage() {
  const { interventions, clients, sites } = useStore();
  const navigate = useNavigate();

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Inconnu';
  const getSiteName = (id: string) => sites.find(s => s.id === id)?.name || 'Site Inconnu';
  
  const completedInterventions = interventions.filter(i => i.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Rapports d'Intervention</h2>
          <p className="text-slate-500 font-medium">Bons d'intervention signés et validés par les clients.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Fait le</th>
                <th className="px-6 py-4">Client / Site</th>
                <th className="px-6 py-4">Agents</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {completedInterventions.map((inter, i) => (
                <motion.tr 
                  key={inter.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/80 transition-all group"
                >
                  <td className="px-6 py-4" onClick={() => navigate(`/interventions/${inter.id}`)}>
                    <p className="text-sm font-bold text-slate-900">{inter.date}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{inter.startTime} - {inter.endTime}</p>
                  </td>
                  <td className="px-6 py-4 cursor-pointer" onClick={() => navigate(`/interventions/${inter.id}`)}>
                     <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{getSiteName(inter.siteId)}</p>
                     <p className="text-[10px] font-bold text-slate-400">{getClientName(inter.clientId)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-1.5">
                      {inter.agentIds.map(aid => (
                        <div key={aid} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${aid}`} alt="Agent" />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                       <CheckCircle2 size={12} />
                       Signé Client
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={() => navigate(`/interventions/${inter.id}`)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                       >
                         <Eye size={14} />
                         Voir
                       </button>
                       <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-100 transition-all">
                         <Send size={14} />
                         Envoyer
                       </button>
                       <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                         <Download size={18} />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {completedInterventions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400 font-bold uppercase text-xs">
                    Aucun rapport disponible pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Preview Mockup */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white min-h-[400px] flex flex-col justify-center items-center text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#3b82f61a,transparent_40%)]"></div>
         <FileText size={48} className="text-blue-500 mb-6" />
         <h3 className="text-2xl font-black mb-2 lowercase tracking-tight">Aperçu du <span className="text-blue-500 tracking-normal uppercase">Bon d'intervention</span></h3>
         <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed font-medium">Sélectionnez un rapport pour visualiser le document complet incluant la checklist, les photos avant/après et la signature numérique du client.</p>
         <button className="mt-8 bg-blue-600 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
            Explorer les archives
         </button>
      </div>
    </div>
  );
}
