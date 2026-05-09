import { useState } from 'react';
import { useStore } from '../../store';
import { 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  Trash2,
  Edit2,
  Camera
} from 'lucide-react';
import { cn } from '../../lib/utils';
import CRMModuleLayout from './CRMModuleLayout';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function TeamPage() {
  const { crmTeam, addTeamMember, deleteTeamMember } = useStore();
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = () => {
    if(!inviteEmail) return;
    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: 'sales' as const,
      status: 'invited' as const,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${inviteEmail}`
    };
    addTeamMember(newMember);
    setInviteEmail('');
    toast.success(`Invitation envoyée à ${inviteEmail}`);
  };

  return (
    <CRMModuleLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Équipe Commerciale</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Gestion des accès & Rôles CRM</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm grow max-w-md">
           <Mail className="ml-3 text-slate-400" size={18} />
           <input 
             value={inviteEmail}
             onChange={(e) => setInviteEmail(e.target.value)}
             placeholder="Email du collaborateur..."
             className="flex-1 bg-transparent px-2 py-2 text-sm font-bold outline-none"
           />
           <button 
             onClick={handleInvite}
             className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
           >
              <UserPlus size={14} /> Inviter
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crmTeam.map((member) => (
          <motion.div 
            key={member.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-6">
                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={18} /></button>
             </div>

             <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                   <div className="w-24 h-24 rounded-[2rem] bg-slate-100 p-0.5 border-2 border-slate-50 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                      <img src={member.avatar} alt={member.name} />
                   </div>
                   <button className="absolute -bottom-2 -right-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-lg shadow-slate-100 text-slate-400 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                      <Camera size={14} />
                   </button>
                </div>

                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{member.name}</h3>
                   <p className="text-xs font-bold text-slate-400 mt-1">{member.email}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                   <span className={cn(
                     "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                     member.role === 'director' ? "bg-purple-100 text-purple-700 border-purple-200" :
                     member.role === 'admin' ? "bg-blue-100 text-blue-700 border-blue-200" :
                     "bg-slate-100 text-slate-700 border-slate-200"
                   )}>
                     <Shield size={10} className="inline mr-1" /> {member.role}
                   </span>
                   {member.status === 'active' ? (
                     <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border bg-emerald-100 text-emerald-700 border-emerald-200">
                       Actif
                     </span>
                   ) : (
                     <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1">
                       <Clock size={10} /> En attente
                     </span>
                   )}
                </div>

                <div className="w-full pt-6 border-t border-slate-50 flex items-center justify-between">
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">Détails perfs</button>
                   <button 
                     onClick={() => { if(confirm('Supprimer ce membre ?')) deleteTeamMember(member.id); }}
                     className="p-2 text-slate-300 hover:text-red-500 transition-all"
                   >
                      <Trash2 size={16} />
                   </button>
                </div>
             </div>
          </motion.div>
        ))}

        {crmTeam.length === 0 && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center border-dashed">
             <div className="w-20 h-20 bg-slate-100 rounded-full animate-pulse mb-4"></div>
             <div className="w-32 h-4 bg-slate-100 rounded animate-pulse mb-2"></div>
             <div className="w-24 h-3 bg-slate-100 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </CRMModuleLayout>
  );
}
