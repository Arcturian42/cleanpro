import { Building2, Shield, Bell, CreditCard, Download, Globe, Lock, Mail } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Profil Entreprise', icon: Building2, desc: 'Informations légales, logo et coordonnées.' },
  { id: 'auth', label: 'Utilisateurs & Accès', icon: Shield, desc: 'Gérez vos collaborateurs et leurs rôles.' },
  { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Alertes plannings, factures et agents.' },
  { id: 'billing', label: 'Facturation & Services', icon: CreditCard, desc: 'Catalogue de prix et paramètres de factures.' },
  { id: 'security', label: 'Sécurité', icon: Lock, desc: 'Mot de passe et authentification 2FA.' },
  { id: 'export', label: 'Données & Export', icon: Download, desc: 'Export complet de vos données au format CSV/PDF.' },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Paramètres</h2>
        <p className="text-slate-500 font-medium">Configurez votre environnement CleanPro selon vos besoins.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar for settings navigation */}
        <div className="md:col-span-1 space-y-2">
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.id}
              className={cn(
                "w-full text-left p-4 rounded-2xl flex items-start gap-4 transition-all group",
                section.id === 'profile' 
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:shadow-lg hover:shadow-slate-100"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl shrink-0 transition-colors",
                section.id === 'profile' ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50"
              )}>
                <section.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-black tracking-tight">{section.label}</p>
                <p className={cn(
                  "text-[10px] mt-0.5 font-medium leading-tight",
                  section.id === 'profile' ? "text-slate-400" : "text-slate-400"
                )}>{section.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-2 space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden"
           >
              <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                <h3 className="text-xl font-black text-slate-900">Profil de l'entreprise</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Identité & Coordonnées</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                   <div className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
                      <Globe size={24} />
                      <span className="text-[10px] font-black uppercase">Logo</span>
                   </div>
                   <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-black text-slate-900">Logo d'entreprise</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Apparaîtra sur vos devis, factures et rapports d'intervention. Format carré conseillé.</p>
                      <div className="flex gap-2 pt-2">
                         <button className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all">Modifier</button>
                         <button className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-all">Supprimer</button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nom de l'entreprise</label>
                    <input type="text" defaultValue="Nova Propreté" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email de contact</label>
                    <input type="email" defaultValue="contact@novaproprete.fr" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">SIRET</label>
                    <input type="text" defaultValue="845 223 114 00012" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Numéro TVA</label>
                    <input type="text" defaultValue="FR45845223114" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Adresse Siège Social</label>
                    <textarea defaultValue="18 rue de la Liberté, 75008 Paris, France" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all min-h-[100px]"></textarea>
                  </div>
                </div>

                <div className="pt-8 flex justify-end gap-3">
                   <button className="px-6 py-2.5 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all">Annuler</button>
                   <button className="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Enregistrer les modifications</button>
                </div>
              </div>
           </motion.div>

           <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <Mail size={40} className="mb-6 opacity-30" />
              <h4 className="text-xl font-black mb-2">Besoin d'aide pour configurer CleanPro ?</h4>
              <p className="max-w-md text-blue-100 text-sm font-medium leading-relaxed">Notre équipe support est disponible du lundi au vendredi de 09h à 18h pour vous accompagner dans le paramétrage de votre SI.</p>
              <button className="mt-8 bg-white text-blue-600 px-10 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/10">Contacter le support</button>
           </div>
        </div>
      </div>
    </div>
  );
}
