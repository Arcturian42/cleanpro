import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  Download, 
  Mail, 
  Printer,
  History,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  Edit,
  Check,
  X
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quotes, clients, sites, deleteQuote, updateQuote } = useStore();

  const quote = quotes.find(q => q.id === id);
  const client = quote ? clients.find(c => c.id === quote.clientId) : null;
  const site = quote ? sites.find(s => s.id === quote.siteId) : null;

  if (!quote) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Devis non trouvé</h2>
        <button onClick={() => navigate('/billing')} className="mt-4 text-blue-600 font-bold uppercase text-xs tracking-widest border border-blue-100 px-4 py-2 rounded-xl">Retour à la liste</button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      deleteQuote(quote.id);
      toast.success('Devis supprimé');
      navigate('/billing');
    }
  };

  const statusMap = {
    draft: { label: 'Brouillon', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    accepted: { label: 'Accepté', color: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Refusé', color: 'bg-red-100 text-red-700 border-red-200' },
    expired: { label: 'Expiré', color: 'bg-slate-300 text-slate-800 border-slate-400' },
  };

  const status = statusMap[quote.status] || statusMap.draft;

  const handleStatusUpdate = (newStatus: any) => {
    updateQuote(quote.id, { status: newStatus });
    toast.success(`Statut mis à jour : ${newStatus}`);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/billing')}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Devis {quote.number}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                status.color
              )}>{status.label}</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">• Émis le {formatDate(new Date(quote.date))}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {quote.status === 'sent' && (
             <>
                <button onClick={() => handleStatusUpdate('accepted')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all">
                  <Check size={16} /> Accepter
                </button>
                <button onClick={() => handleStatusUpdate('rejected')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all">
                  <X size={16} /> Refuser
                </button>
             </>
           )}
           <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 transition-colors">
             <Download size={20} />
           </button>
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 transition-colors">
             <Mail size={20} />
           </button>
           <button onClick={handleDelete} className="p-2.5 bg-white border border-slate-200 rounded-xl text-red-400 hover:text-red-600 transition-colors">
             <Trash2 size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-8 bg-slate-50/50">
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Émetteur</p>
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 uppercase">CleanPro Services</p>
                       <p className="text-sm font-bold text-slate-400">123 Avenue du Progrès</p>
                       <p className="text-sm font-bold text-slate-400">75008 Paris, France</p>
                    </div>
                 </div>
                 <div className="space-y-4 text-left md:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</p>
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 uppercase">{client?.name}</p>
                       <p className="text-sm font-bold text-slate-400">{client?.address}</p>
                       <p className="text-sm font-bold text-slate-400">{client?.contactName}</p>
                    </div>
                 </div>
              </div>

              <div className="p-8 space-y-8">
                 <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-slate-100">
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Devis</p>
                          <p className="font-bold text-slate-900">{formatDate(new Date(quote.date))}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valide jusqu'au</p>
                          <p className="font-bold text-slate-900">{formatDate(new Date(quote.expiryDate))}</p>
                       </div>
                    </div>
                    <div className="md:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant Estimé</p>
                        <p className="text-4xl font-black text-blue-600 tracking-tighter">{formatCurrency(quote.amountTTC)}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-slate-100">
                             <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description des prestations</th>
                             <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total HT</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          <tr>
                             <td className="py-4">
                                <p className="font-bold text-slate-900">Forfait maintenance mensuelle - {site?.name}</p>
                                <p className="text-xs text-slate-400">Nettoyage complet, vitrerie, et gestion des déchets.</p>
                             </td>
                             <td className="py-4 text-right">
                                <p className="font-bold text-slate-900">{formatCurrency(quote.amountHT)}</p>
                             </td>
                          </tr>
                       </tbody>
                       <tfoot>
                          <tr className="border-t border-slate-100">
                             <td className="py-4 text-right font-bold text-slate-400 uppercase text-xs">Sous-total HT</td>
                             <td className="py-4 text-right font-bold text-slate-900">{formatCurrency(quote.amountHT)}</td>
                          </tr>
                          <tr>
                             <td className="py-2 text-right font-bold text-slate-400 uppercase text-xs">TVA (20%)</td>
                             <td className="py-2 text-right font-bold text-slate-900">{formatCurrency(quote.amountTTC - quote.amountHT)}</td>
                          </tr>
                          <tr className="bg-blue-50/50">
                             <td className="py-4 px-4 text-right font-black text-slate-900 uppercase text-xs">Total TTC Estimé</td>
                             <td className="py-4 px-4 text-right font-black text-blue-600 text-xl tracking-tight">{formatCurrency(quote.amountTTC)}</td>
                          </tr>
                       </tfoot>
                    </table>
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl space-y-2">
              <div className="flex items-center gap-2 text-amber-700">
                 <AlertCircle size={18} />
                 <h4 className="text-sm font-black uppercase tracking-widest">Conditions de validité</h4>
              </div>
              <p className="text-xs font-bold text-amber-600 leading-relaxed">
                 Ce devis est valable 30 jours à compter de sa date d'émission. Passé ce délai, les tarifs et conditions peuvent être révisés. L'acceptation du devis vaut pour bon de commande ferme.
              </p>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avancement</h3>
              <div className="space-y-4">
                 {[
                    { label: 'Devis préparé', completed: true, date: quote.date },
                    { label: 'Envoyé au client', completed: quote.status !== 'draft', date: quote.status !== 'draft' ? quote.date : null },
                    { label: 'Décision client', completed: quote.status === 'accepted' || quote.status === 'rejected', date: quote.status === 'accepted' || quote.status === 'rejected' ? 'Récemment' : null },
                    { label: 'Facturation', completed: false, date: null },
                 ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="relative">
                          <div className={cn(
                             "w-6 h-6 rounded-full flex items-center justify-center border-2",
                             step.completed ? "bg-green-100 border-green-500 text-green-600" : "bg-white border-slate-200 text-slate-200"
                          )}>
                             {step.completed ? <Check size={14} /> : <span className="text-[10px] font-black">{i+1}</span>}
                          </div>
                          {i < 3 && <div className={cn("absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-4", step.completed ? "bg-green-200" : "bg-slate-100")}></div>}
                       </div>
                       <div>
                          <p className={cn("text-xs font-bold", step.completed ? "text-slate-900" : "text-slate-400")}>{step.label}</p>
                          {step.date && <p className="text-[9px] font-black text-slate-400 uppercase">{step.date}</p>}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
