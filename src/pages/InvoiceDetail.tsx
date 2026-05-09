import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar, 
  CreditCard, 
  Download, 
  Mail, 
  Printer,
  History,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  Edit
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, clients, sites, deleteInvoice } = useStore();

  const invoice = invoices.find(i => i.id === id);
  const client = invoice ? clients.find(c => c.id === invoice.clientId) : null;
  const site = invoice ? sites.find(s => s.id === invoice.siteId) : null;

  if (!invoice) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold uppercase tracking-tight">Facture non trouvée</h2>
        <button onClick={() => navigate('/billing')} className="mt-4 text-blue-600 font-bold uppercase text-xs tracking-widest border border-blue-100 px-4 py-2 rounded-xl">Retour à la liste</button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      deleteInvoice(invoice.id);
      toast.success('Facture supprimée');
      navigate('/billing');
    }
  };

  const statusMap = {
    draft: { label: 'Brouillon', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    sent: { label: 'Envoyée', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    paid: { label: 'Payée', color: 'bg-green-100 text-green-700 border-green-200' },
    late: { label: 'Retard', color: 'bg-red-100 text-red-700 border-red-200' },
    cancelled: { label: 'Annulée', color: 'bg-slate-300 text-slate-800 border-slate-400' },
  };

  const status = statusMap[invoice.status] || statusMap.draft;

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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Facture {invoice.number}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                status.color
              )}>{status.label}</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">• Émise le {formatDate(new Date(invoice.date))}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 transition-colors tooltip" title="Exporter PDF">
             <Download size={20} />
           </button>
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 transition-colors" title="Imprimer">
             <Printer size={20} />
           </button>
           <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 transition-colors" title="Envoyer par mail">
             <Mail size={20} />
           </button>
           <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
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
                       <p className="text-sm font-bold text-slate-400 font-mono">SIRET: 123 456 789 00010</p>
                    </div>
                 </div>
                 <div className="space-y-4 text-left md:text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destinataire</p>
                    <div className="space-y-1">
                       <p className="font-black text-slate-900 uppercase">{client?.name}</p>
                       <p className="text-sm font-bold text-slate-400">{client?.address}</p>
                       <p className="text-sm font-bold text-slate-400">{client?.contactName}</p>
                       <p className="text-sm font-bold text-slate-400">{client?.email}</p>
                    </div>
                 </div>
              </div>

              <div className="p-8 space-y-8">
                 <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-slate-100">
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Facture</p>
                          <p className="font-bold text-slate-900">{formatDate(new Date(invoice.date))}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Échéance</p>
                          <p className="font-bold text-slate-900">{formatDate(new Date(invoice.dueDate))}</p>
                       </div>
                    </div>
                    <div className="md:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total à payer</p>
                        <p className="text-4xl font-black text-blue-600 tracking-tighter">{formatCurrency(invoice.amountTTC)}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Détails de la prestation</h3>
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-slate-100">
                             <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                             <th className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Montant HT</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          <tr>
                             <td className="py-4">
                                <p className="font-bold text-slate-900">Services de nettoyage - {site?.name}</p>
                                <p className="text-xs text-slate-400">{site?.address}</p>
                             </td>
                             <td className="py-4 text-right">
                                <p className="font-bold text-slate-900">{formatCurrency(invoice.amountHT)}</p>
                             </td>
                          </tr>
                       </tbody>
                       <tfoot>
                          <tr className="border-t-2 border-slate-100">
                             <td className="py-4 text-right font-bold text-slate-400 uppercase text-xs">Total HT</td>
                             <td className="py-4 text-right font-bold text-slate-900">{formatCurrency(invoice.amountHT)}</td>
                          </tr>
                          <tr>
                             <td className="py-2 text-right font-bold text-slate-400 uppercase text-xs">TVA (20%)</td>
                             <td className="py-2 text-right font-bold text-slate-900">{formatCurrency(invoice.amountTTC - invoice.amountHT)}</td>
                          </tr>
                          <tr className="bg-slate-50">
                             <td className="py-4 px-4 text-right font-black text-slate-900 uppercase text-sm">Total TTC</td>
                             <td className="py-4 px-4 text-right font-black text-blue-600 text-lg tracking-tight">{formatCurrency(invoice.amountTTC)}</td>
                          </tr>
                       </tfoot>
                    </table>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">État du paiement</h3>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className={cn(
                    "p-2.5 rounded-xl",
                    invoice.status === 'paid' ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                 )}>
                   {invoice.status === 'paid' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                 </div>
                 <div>
                    <p className="text-sm font-black text-slate-900 uppercase leading-none mb-1">{invoice.status === 'paid' ? 'Soldée' : 'Attente règlement'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{invoice.paymentStatus}</p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Historique</h3>
              <div className="space-y-4">
                 {[
                    { label: 'Facture créée', date: invoice.date, icon: FileText, color: 'text-blue-500' },
                    { label: invoice.status === 'sent' || invoice.status === 'paid' ? 'Envoyée au client' : 'Prête à envoyer', date: invoice.date, icon: Mail, color: invoice.status === 'sent' || invoice.status === 'paid' ? 'text-green-500' : 'text-slate-300' },
                    { label: 'Paiement reçu', date: invoice.status === 'paid' ? 'Aujourd\'hui' : null, icon: CreditCard, color: invoice.status === 'paid' ? 'text-green-500' : 'text-slate-300' },
                 ].map((event, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="relative">
                          <div className={cn("p-2 rounded-lg bg-slate-50", event.color)}>
                             <event.icon size={16} />
                          </div>
                          {i < 2 && <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-100"></div>}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-700">{event.label}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase">{event.date || '---'}</p>
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
