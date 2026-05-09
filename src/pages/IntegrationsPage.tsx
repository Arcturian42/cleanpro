import { Zap, ArrowUpRight, CheckCircle2, ChevronRight, Puzzle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight lowercase underline decoration-blue-500/30 decoration-8 underline-offset-[-2px]">Intégrations<span className="text-blue-500 tracking-normal uppercase"> Financières</span></h2>
          <p className="text-slate-500 font-medium">Automatisez votre comptabilité avec nos partenaires tiers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pennylane Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 border-b-[6px] border-b-slate-200 hover:border-b-blue-600 translate-y-0 hover:-translate-y-2">
           <div className="p-8 flex-1">
             <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center p-2.5 shadow-lg shadow-slate-200">
                  <img src="https://assets.pennylane.com/favicon-32x32.png" className="w-full h-full grayscale brightness-200" alt="Pennylane" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  Non connecté
                </div>
             </div>
             
             <h3 className="text-2xl font-black text-slate-900 mb-2">Pennylane</h3>
             <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">Synchronisez vos clients, devis, factures et données comptables en temps-réel avec Pennylane pour une gestion financière automatisée.</p>

             <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacités & Synchro</h4>
               {[
                 'Synchronisation des fiches clients',
                 'Export automatique des factures validées',
                 'Suivi du statut de paiement biface',
                 'Journal de synchronisation détaillé',
                 'Détection des anomalies de TVA'
               ].map(item => (
                 <div key={item} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                   <CheckCircle2 size={16} className="text-blue-500" />
                   {item}
                 </div>
               ))}
             </div>
           </div>

           <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">État de la file</p>
                  <p className="text-sm font-black text-slate-800">6 factures prêtes pour export</p>
                </div>
                <button className="text-blue-600 p-2 hover:bg-blue-50 rounded-xl transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </div>
              <button 
                onClick={() => alert('La connexion Pennylane arrive bientôt !')}
                className="w-full bg-slate-950 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
              >
                Connecter Pennylane
                <ChevronRight size={18} />
              </button>
           </div>
        </div>

        {/* Qonto Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 border-b-[6px] border-b-slate-200 hover:border-b-blue-600 translate-y-0 hover:-translate-y-2">
           <div className="p-8 flex-1">
             <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center p-2.5 shadow-lg shadow-indigo-100">
                  <Zap size={28} className="text-white" fill="currentColor" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                  Non connecté
                </div>
             </div>
             
             <h3 className="text-2xl font-black text-slate-900 mb-2">Qonto</h3>
             <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">Rapprochez vos encaissements avec vos factures de manière magique. Détectez les paiements reçus et marquez vos factures comme payées automatiquement.</p>

             <div className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacités & Synchro</h4>
               {[
                 'Lecture en temps-réel du flux bancaire',
                 'Rapprochement intelligent Facture / Paiement',
                 'Alertes automatiques pour les impayés',
                 'Calcul des délais de paiement moyens',
                 'Génération des fichiers de virement agents'
               ].map(item => (
                 <div key={item} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                   <CheckCircle2 size={16} className="text-indigo-500" />
                   {item}
                 </div>
               ))}
             </div>
           </div>

           <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transactions</p>
                  <p className="text-sm font-black text-slate-800">3 nouveaux paiements détectés</p>
                </div>
                <button className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-xl transition-colors">
                  <ArrowUpRight size={20} />
                </button>
              </div>
              <button 
                onClick={() => alert('La connexion Qonto arrive bientôt !')}
                className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-slate-950 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
              >
                Connecter Qonto
                <ChevronRight size={18} />
              </button>
           </div>
        </div>
      </div>

      {/* Developer note section */}
      <div className="mt-12 p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
         <Puzzle size={48} className="text-slate-300 mb-6" />
         <h4 className="text-lg font-black text-slate-900">Plus d'intégrations à venir</h4>
         <p className="text-slate-400 text-sm max-w-md mt-2 font-medium">Nous travaillons activement à l'ajout de partenaires pour simplifier votre quotidien : Google Calendar, Sage, Cegid, et bien d'autres.</p>
      </div>
    </div>
  );
}
