import { useState } from 'react';
import { useStore } from '../../store';
import { OpportunityStage } from '../../types';
import { 
  Plus, 
  MoreVertical, 
  DollarSign, 
  Clock, 
  User, 
  ChevronRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import CRMModuleLayout from './CRMModuleLayout';
import { motion, AnimatePresence } from 'motion/react';

const STAGES: { id: OpportunityStage; label: string; color: string }[] = [
  { id: 'discovery', label: 'Découverte', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  { id: 'proposal', label: 'Proposition', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'negotiation', label: 'Négociation', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'closed_won', label: 'Gagné', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
];

export default function Pipeline() {
  const { opportunities, updateOpportunity } = useStore();

  const getOppForStage = (stage: OpportunityStage) => opportunities.filter(o => o.stage === stage);

  const calculateStageTotal = (stage: OpportunityStage) => {
    return getOppForStage(stage).reduce((acc, current) => acc + current.value, 0);
  };

  return (
    <CRMModuleLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Pipeline de Vente</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Suivi des opportunités & Prévisions</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
           <Plus size={16} /> Nouvelle Opp
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {STAGES.map((stage) => {
          const stageOpps = getOppForStage(stage.id);
          const totalValue = calculateStageTotal(stage.id);

          return (
            <div key={stage.id} className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-4 min-h-[500px]">
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                      stage.color
                    )}>{stage.label}</span>
                    <span className="text-[10px] font-black text-slate-400">{stageOpps.length}</span>
                 </div>
                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{formatCurrency(totalValue)}</p>
              </div>

              <div className="space-y-3">
                 <AnimatePresence>
                    {stageOpps.map((opp) => (
                      <motion.div 
                        key={opp.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                      >
                         <div className="flex justify-between items-start mb-4">
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none group-hover:text-blue-600 transition-colors">{opp.title}</p>
                            <button className="p-1 text-slate-300 hover:text-slate-600"><MoreVertical size={14} /></button>
                         </div>

                         <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                               <DollarSign size={12} className="text-emerald-500" />
                               <p className="text-xs font-black text-slate-900">{formatCurrency(opp.value)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                               <TrendingUp size={12} className="text-blue-500" />
                               <p className="text-[10px] font-black text-slate-400">{opp.probability}%</p>
                            </div>
                         </div>

                         <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                  <User size={12} className="text-slate-400" />
                               </div>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID: {opp.assignedTo.slice(0, 4)}</p>
                            </div>
                            <div className="flex items-center gap-1 text-slate-400">
                               <Clock size={12} />
                               <p className="text-[10px] font-bold uppercase tracking-tight">{formatDate(new Date(opp.expectedCloseDate))}</p>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              {stageOpps.length === 0 && (
                <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl mt-2">
                   <Briefcase size={24} className="mx-auto text-slate-200 mb-2" />
                   <p className="text-[9px] font-black text-slate-300 uppercase">Aucune opp</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </CRMModuleLayout>
  );
}
