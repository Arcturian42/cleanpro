import { useState, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { useStore } from '../store';
import { cn, formatDate } from '../lib/utils';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Camera, 
  Edit3, 
  ArrowLeft,
  User,
  LogOut,
  Wifi,
  History,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function AgentMobileView() {
  const { user, logout } = useAuth();
  const { interventions, sites, clients, updateIntervention } = useStore();
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'profile'>('today');
  const [selectedInterventionId, setSelectedInterventionId] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  
  // Find which agent this user is (matching by name or email for the demo)
  const today = '2026-05-09'; // Demo date
  
  const myInterventions = useMemo(() => {
    // In a real app, we'd filter by user.id matching agentIds
    // For demo, if user is 'agent', we show interventions assigned to them
    return interventions.filter(i => {
      const isToday = i.date === today;
      // If user is admin/manager, show all for today in mobile view demo
      if (user?.role !== 'agent') return isToday;
      // If agent, filter by their ID (assuming name matching for demo simplicity if IDs differ)
      return isToday && i.agentIds.includes(user.id);
    });
  }, [interventions, user, today]);

  const selectedIntervention = useMemo(() => 
    interventions.find(i => i.id === selectedInterventionId),
    [interventions, selectedInterventionId]
  );

  const selectedSite = useMemo(() => 
    selectedIntervention ? sites.find(s => s.id === selectedIntervention.siteId) : null,
    [sites, selectedIntervention]
  );

  const selectedClient = useMemo(() => 
    selectedIntervention ? clients.find(c => c.id === selectedIntervention.clientId) : null,
    [clients, selectedIntervention]
  );

  const handleToggleItem = (label: string) => {
    setCompletedItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleFinish = () => {
    if (!selectedInterventionId) return;
    
    updateIntervention(selectedInterventionId, { 
      status: 'completed',
      hasReport: true
    } as any);
    
    toast.success('Fiche d\'intervention envoyée !');
    setSelectedInterventionId(null);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col font-sans max-w-md mx-auto border-x border-slate-200 overflow-hidden shadow-2xl">
      {/* Mobile Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Bonjour {user?.name.split(' ')[0]} 👋</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Connectée • {formatDate(new Date())}</p>
          </div>
        </div>
        <div className="bg-blue-50 text-blue-600 p-2 rounded-xl border border-blue-100">
          <Wifi size={18} />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && !selectedInterventionId && (
            <motion.div 
              key="today"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-6"
            >
              {/* Stats Mini Row */}
              <div className="flex gap-4">
                <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                  <p className="text-3xl font-black text-slate-900 leading-none mb-1">{myInterventions.length}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missions</p>
                </div>
                <div className="flex-1 bg-blue-600 p-5 rounded-3xl border border-blue-700 shadow-lg shadow-blue-100">
                  <p className="text-3xl font-black text-white leading-none mb-1">{myInterventions.filter(i => i.status === 'completed').length}</p>
                  <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Terminées</p>
                </div>
              </div>

              {/* Sync Banner */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center gap-4 text-xs font-bold shadow-xl shadow-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/5 relative z-10 text-blue-400">
                  <CheckCircle2 size={18} />
                </div>
                <span className="relative z-10 leading-snug">Vos données se synchronisent automatiquement en temps réel.</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Missions du jour</h3>
                  <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 uppercase tracking-widest">9 Mai 2026</div>
                </div>

                {myInterventions.length > 0 ? (
                  myInterventions.map((inter) => {
                    const site = sites.find(s => s.id === inter.siteId);
                    return (
                      <button
                        key={inter.id}
                        onClick={() => setSelectedInterventionId(inter.id)}
                        className="w-full bg-white rounded-3xl border border-slate-200 p-5 shadow-sm text-left hover:border-blue-400 active:scale-[0.98] transition-all flex items-center gap-4 group hover:shadow-md"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={cn(
                              "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                              inter.status === 'completed' ? "bg-green-100 text-green-700 border-green-200" :
                              inter.status === 'in_progress' ? "bg-blue-100 text-blue-700 border-blue-200" :
                              "bg-slate-100 text-slate-500 border-slate-200"
                            )}>
                              {inter.status === 'completed' ? 'Terminée' : inter.status === 'in_progress' ? 'En cours' : 'Planifiée'}
                            </div>
                            <div className="flex items-center gap-1 text-slate-400 font-bold text-[10px]">
                              <Clock size={12} />
                              {inter.startTime} - {inter.endTime}
                            </div>
                          </div>
                          <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-tight mb-1">
                            {site?.name || 'Site Inconnu'}
                          </h4>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <MapPin size={12} />
                            <span className="text-[11px] font-bold truncate max-w-[200px]">{site?.address || 'Pas d\'adresse'}</span>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all text-slate-300 border border-transparent group-hover:border-blue-100">
                          <ChevronRight size={20} />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <CalendarDays size={32} />
                    </div>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-tight">Aucune mission prévue pour aujourd'hui</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'today' && selectedInterventionId && selectedIntervention && (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white min-h-full"
            >
              {/* Detail Header */}
              <div className="bg-slate-900 text-white p-6 pb-14 rounded-b-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <button 
                  onClick={() => setSelectedInterventionId(null)}
                  className="bg-white/10 p-2 rounded-xl mb-6 hover:bg-white/20 transition-all flex items-center gap-2 border border-white/10 group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">Retour</span>
                </button>
                <h2 className="text-2xl font-black mb-2 relative z-10 tracking-tight leading-tight">
                  {selectedSite?.name || 'Détails Intervention'}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-white/60 relative z-10">
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-tight">{selectedIntervention.startTime}h - {selectedIntervention.endTime}h</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                    <MapPin size={16} className="text-emerald-400" />
                    <span className="text-xs font-bold underline cursor-pointer">Itinéraire</span>
                  </div>
                </div>
              </div>

              {/* Content Panel Overlap */}
              <div className="px-6 -mt-10 space-y-8 relative z-10">
                <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-slate-200 border border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={16} className="text-orange-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consignes d'accès</h3>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl text-slate-600 text-sm font-bold leading-relaxed border border-slate-100 italic">
                    {selectedSite?.accessInfo || "Aucune consigne spécifique. Entrée principale du bâtiment."}
                    {selectedSite?.doorCode && <div className="mt-2 text-slate-900 not-italic">Code : <span className="p-1 bg-slate-200 rounded font-black">{selectedSite.doorCode}</span></div>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Actions à effectuer</h3>
                  <div className="space-y-3">
                    {[
                      'Prise de poste sécurisée',
                      'Vider les corbeilles & Tri sélectif',
                      'Dépoussiérage des bureaux',
                      'Sanitaires : Nettoyage & Consommables',
                      'Sols : Aspiration & Lavage',
                      'Photos de fin de chantier',
                      'Remise des clés / Badge'
                    ].map((item) => (
                      <label 
                        key={item}
                        className={cn(
                          "flex items-center gap-4 p-5 rounded-3xl border transition-all cursor-pointer select-none",
                          completedItems[item] 
                            ? "bg-green-50 border-green-200 text-green-700 shadow-sm" 
                            : "bg-white border-slate-200 text-slate-600 shadow-sm hover:border-blue-200"
                        )}
                      >
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={!!completedItems[item]} 
                          onChange={() => handleToggleItem(item)}
                        />
                        <div className={cn(
                          "w-7 h-7 rounded-xl flex items-center justify-center transition-all border-2",
                          completedItems[item] 
                            ? "bg-green-500 border-green-500 text-white" 
                            : "border-slate-300 text-transparent"
                        )}>
                          <CheckCircle2 size={18} />
                        </div>
                        <span className="text-sm font-black tracking-tight">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Photos & Preuves</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-slate-100 hover:border-blue-300 transition-all group">
                      <Camera size={28} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Avant</span>
                    </button>
                    <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-slate-100 hover:border-blue-300 transition-all group">
                      <Camera size={28} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Après</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Notes & Signalement</h3>
                  <textarea 
                    placeholder="Un problème ? Un manque de produit ? Signalez-le ici..."
                    className="w-full bg-slate-100 border border-slate-200 rounded-3xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] transition-all placeholder:text-slate-400 shadow-inner"
                  ></textarea>
                </div>

                <button 
                  onClick={handleFinish}
                  className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 active:scale-[0.98] transition-all mb-12 flex items-center justify-center gap-3"
                >
                  <CheckCircle2 size={24} />
                  Terminer ma mission
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'week' && (
            <motion.div 
               key="week"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="p-6 space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Ma Semaine</h2>
                <div className="text-[10px] bg-slate-900 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">Mai 2026</div>
              </div>
              <div className="space-y-4">
                {['Lun 11', 'Mar 12', 'Mer 13', 'Jeu 14', 'Ven 15'].map((day) => (
                  <div key={day} className="bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between shadow-sm group hover:border-blue-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-all">
                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1 group-hover:text-blue-400 transition-colors">{day.split(' ')[0]}</span>
                        <span className="text-lg font-black text-slate-900 leading-none group-hover:text-blue-600 transition-colors">{day.split(' ')[1]}</span>
                      </div>
                      <div>
                        <span className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">Prochaines missions</span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Voir le planning complet</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-xl border border-blue-200 uppercase">2 missions</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 space-y-8"
            >
              <div className="flex flex-col items-center gap-5 text-center mt-12 bg-white p-8 rounded-[3rem] shadow-xl shadow-slate-100 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="w-24 h-24 rounded-full bg-blue-600 border-4 border-white shadow-2xl overflow-hidden ring-1 ring-slate-100 relative z-10 scale-110">
                   <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{user?.name}</h2>
                  <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-1">Agent de terrain Certifié</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between font-black text-slate-700 hover:bg-slate-50 hover:border-blue-200 transition-all shadow-sm group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-all border border-transparent group-hover:border-blue-100">
                      <User size={20} />
                    </div>
                    <span className="uppercase text-[11px] tracking-widest">Informations profil</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-all" />
                </button>
                <button className="w-full bg-white p-5 rounded-3xl border border-slate-200 flex items-center justify-between font-black text-slate-700 hover:bg-slate-50 hover:border-blue-200 transition-all shadow-sm group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-all border border-transparent group-hover:border-blue-100">
                      <History size={20} />
                    </div>
                    <span className="uppercase text-[11px] tracking-widest">Historique missions</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-all" />
                </button>
                
                <div className="pt-6">
                  <button 
                    onClick={logout}
                    className="w-full bg-red-50 p-5 rounded-[2rem] border border-red-100 flex items-center justify-center gap-3 font-black text-red-600 hover:bg-red-100 transition-all shadow-sm shadow-red-50 text-sm uppercase tracking-widest"
                  >
                    <LogOut size={20} />
                    Se déconnecter
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Nav Tab Bar */}
      {!selectedInterventionId && (
        <nav className="bg-white/80 backdrop-blur-xl border-t border-slate-100 h-24 px-6 flex items-center justify-between fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[3rem]">
          {[
            { id: 'today', icon: CalendarDays, label: 'Missions' },
            { id: 'week', icon: Clock, label: 'Semaine' },
            { id: 'profile', icon: User, label: 'Profil' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all px-6 py-3 rounded-2xl relative",
                activeTab === tab.id ? "text-blue-600 font-black" : "text-slate-400 font-bold"
              )}
            >
              {activeTab === tab.id && (
                <motion.div layoutId="activeTabIcon" className="absolute inset-0 bg-blue-50 rounded-[1.5rem] -z-10 shadow-sm border border-blue-100" />
              )}
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 3 : 2} />
              <span className="text-[10px] uppercase tracking-widest font-black leading-none">{tab.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
