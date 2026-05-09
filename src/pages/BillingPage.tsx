import { useState } from 'react';
import { useStore } from '../store';
import { cn, formatCurrency } from '../lib/utils';
import { 
  Search, 
  Plus, 
  Filter, 
  FileText, 
  Receipt, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  Download,
  Send,
  Zap,
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion } from 'motion/react';
import Modal from '../components/ui/Modal';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

const invoiceSchema = z.object({
  number: z.string().min(1, 'Le numéro est requis'),
  clientId: z.string().min(1, 'Le client est requis'),
  siteId: z.string().min(1, 'Le site est requis'),
  amountHT: z.number().min(0),
  amountTTC: z.number().min(0),
  date: z.string().min(1, 'La date est requise'),
  dueDate: z.string().min(1, 'L\'échéance est requise'),
  status: z.enum(['draft', 'sent', 'paid', 'late', 'cancelled']),
});

const quoteSchema = z.object({
  number: z.string().min(1, 'Le numéro est requis'),
  clientId: z.string().min(1, 'Le client est requis'),
  siteId: z.string().min(1, 'Le site est requis'),
  amountHT: z.number().min(0),
  amountTTC: z.number().min(0),
  date: z.string().min(1, 'La date est requise'),
  validUntil: z.string().min(1, 'La validité est requise'),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired']),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;
type QuoteFormValues = z.infer<typeof quoteSchema>;

export default function BillingPage() {
  const { invoices, quotes, clients, sites, addInvoice, updateInvoice, deleteInvoice, addQuote, updateQuote, deleteQuote } = useStore();
  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices'>('invoices');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const invoiceForm = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { status: 'sent', amountHT: 0, amountTTC: 0 } as any
  });

  const quoteForm = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: { status: 'sent', amountHT: 0, amountTTC: 0 } as any
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || 'Inconnu';

  const filteredInvoices = invoices.filter(i => 
    i.number.toLowerCase().includes(search.toLowerCase()) ||
    getClientName(i.clientId).toLowerCase().includes(search.toLowerCase())
  );

  const filteredQuotes = quotes.filter(q => 
    q.number.toLowerCase().includes(search.toLowerCase()) ||
    getClientName(q.clientId).toLowerCase().includes(search.toLowerCase())
  );

  const onInvoiceSubmit = (data: InvoiceFormValues) => {
    if (editingId) {
      updateInvoice(editingId, data as any);
      toast.success('Facture mise à jour');
    } else {
      addInvoice({ 
        ...data, 
        id: Math.random().toString(36).substr(2, 9), 
        syncStatus: 'none',
        paymentStatus: 'unpaid'
      } as any);
      toast.success('Facture créée');
    }
    setIsModalOpen(false);
    setEditingId(null);
    invoiceForm.reset();
  };

  const onQuoteSubmit = (data: QuoteFormValues) => {
    if (editingId) {
      updateQuote(editingId, { ...data, expiryDate: data.validUntil } as any);
      toast.success('Devis mis à jour');
    } else {
      addQuote({ 
        ...data, 
        id: Math.random().toString(36).substr(2, 9),
        expiryDate: data.validUntil 
      } as any);
      toast.success('Devis créé');
    }
    setIsModalOpen(false);
    setEditingId(null);
    quoteForm.reset();
  };

  const handleDelete = (id: string, type: 'invoice' | 'quote') => {
    if (confirm(`Supprimer ${type === 'invoice' ? 'cette facture' : 'ce devis'} ?`)) {
      if (type === 'invoice') deleteInvoice(id);
      else deleteQuote(id);
      toast.success('Supprimé');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Facturation & Devis</h2>
          <p className="text-slate-500 font-medium">Gérez vos revenus, vos devis clients et l'export vers Pennylane.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setEditingId(null);
              if (activeTab === 'invoices') invoiceForm.reset();
              else quoteForm.reset();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <Plus size={18} />
            Nouveau {activeTab === 'invoices' ? 'Facture' : 'Devis'}
          </button>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl w-full max-sm mb-4">
        <button 
          onClick={() => { setActiveTab('quotes'); setSearch(''); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all",
            activeTab === 'quotes' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <FileText size={16} />
          Devis
        </button>
        <button 
          onClick={() => { setActiveTab('invoices'); setSearch(''); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black transition-all",
            activeTab === 'invoices' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Receipt size={16} />
          Factures
        </button>
      </div>

      {activeTab === 'invoices' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total à encaisser</p>
              <h3 className="text-2xl font-black text-slate-900">{formatCurrency(invoices.reduce((acc, i) => i.status !== 'paid' ? acc + i.amountTTC : acc, 0))}</h3>
              <p className="text-[10px] text-blue-600 font-bold mt-1">{invoices.filter(i => i.status !== 'paid').length} factures en attente</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 border-l-orange-400 border-l-4 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paiements en retard</p>
              <h3 className="text-2xl font-black text-orange-600">{formatCurrency(invoices.reduce((acc, i) => i.status === 'late' ? acc + i.amountTTC : acc, 0))}</h3>
              <p className="text-[10px] text-orange-400 font-bold mt-1">{invoices.filter(i => i.status === 'late').length} relances suggérées</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Encaissé total</p>
              <h3 className="text-2xl font-black text-green-600">{formatCurrency(invoices.reduce((acc, i) => i.status === 'paid' ? acc + i.amountTTC : acc, 0))}</h3>
              <p className="text-[10px] text-green-400 font-bold mt-1">{invoices.filter(i => i.status === 'paid').length} factures réglées</p>
            </div>
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between group cursor-pointer hover:bg-slate-800 transition-all">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-slate-400">Export Pennylane</p>
                <h3 className="text-lg font-bold text-white">{invoices.filter(i => i.syncStatus === 'ready').length} factures prêtes</h3>
              </div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mt-2">
                Exporter maintenant <ArrowUpRight size={14} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher une facture..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Numéro</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Montant TTC</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-5">Synchronisation</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((invoice, i) => (
                    <motion.tr 
                      key={invoice.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                      onClick={() => navigate(`/billing/invoices/${invoice.id}`)}
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{invoice.number}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Fait le {invoice.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-700">{getClientName(invoice.clientId)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-900">{formatCurrency(invoice.amountTTC)}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Échéance {invoice.dueDate}</p>
                      </td>
                      <td className="px-6 py-4">
                         <div className={cn(
                           "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                           invoice.status === 'paid' ? "bg-green-100 text-green-700 border-green-200" : 
                           invoice.status === 'late' ? "bg-red-100 text-red-700 border-red-200" :
                           "bg-blue-100 text-blue-700 border-blue-200"
                         )}>
                           {invoice.status === 'paid' ? 'Payée' : invoice.status === 'late' ? 'Retard' : invoice.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className={cn(
                           "flex items-center gap-2 p-1.5 px-2.5 rounded-lg text-[9px] font-black uppercase tracking-wide w-fit",
                           invoice.syncStatus === 'exported' ? "bg-slate-900 text-white" : 
                           invoice.syncStatus === 'ready' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                           "bg-slate-100 text-slate-400"
                         )}>
                           <Zap size={10} className={invoice.syncStatus === 'none' ? "opacity-30" : ""} />
                           {invoice.syncStatus === 'exported' ? 'Exporté Pennylane' : invoice.syncStatus === 'ready' ? 'Prêt pour export' : 'Non synchronisé'}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all" onClick={(e) => e.stopPropagation()}>
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit2 size={16} onClick={() => { setEditingId(invoice.id); invoiceForm.reset(invoice); setIsModalOpen(true); }} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(invoice.id, 'invoice')}>
                              <Trash2 size={16} />
                            </button>
                         </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {filteredQuotes.map(quote => (
                 <div key={quote.id} className="bg-white border border-slate-200 p-5 rounded-3xl text-left hover:border-blue-400 transition-all cursor-pointer group shadow-sm flex flex-col" onClick={() => navigate(`/billing/quotes/${quote.id}`)}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-100 p-2.5 rounded-xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <FileText size={20} />
                      </div>
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider border",
                        quote.status === 'accepted' ? "bg-green-100 text-green-700 border-green-200" : 
                        quote.status === 'rejected' ? "bg-red-100 text-red-700 border-red-200" :
                        "bg-blue-100 text-blue-700 border-blue-200"
                      )}>
                        {quote.status === 'accepted' ? 'Accepté' : quote.status === 'rejected' ? 'Refusé' : 'Envoyé'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{quote.number}</p>
                      <p className="text-sm font-bold text-slate-900 mt-1 uppercase tracking-tight truncate">{getClientName(quote.clientId)}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <p className="text-xl font-black text-slate-900">{formatCurrency(quote.amountTTC)}</p>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => { setEditingId(quote.id); quoteForm.reset(quote); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(quote.id, 'quote')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
             
             {filteredQuotes.length === 0 && (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <FileText size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase">Aucun devis trouvé</h3>
                </div>
             )}
           </div>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingId(null); }}
        title={editingId ? `Modifier ${activeTab === 'invoices' ? 'Facture' : 'Devis'}` : `Nouveau ${activeTab === 'invoices' ? 'Facture' : 'Devis'}`}
      >
        {activeTab === 'invoices' ? (
          <form onSubmit={invoiceForm.handleSubmit(onInvoiceSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Numéro de facture</label>
              <input {...invoiceForm.register('number')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" placeholder="FA-2026-001" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Client</label>
                <select {...invoiceForm.register('clientId')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white">
                  <option value="">Sélectionner</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Site</label>
                <select {...invoiceForm.register('siteId')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white">
                  <option value="">Sélectionner</option>
                  {sites.filter(s => s.clientId === invoiceForm.watch('clientId')).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Montant HT (€)</label>
                <input type="number" {...invoiceForm.register('amountHT', { valueAsNumber: true })} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Montant TTC (€)</label>
                <input type="number" {...invoiceForm.register('amountTTC', { valueAsNumber: true })} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                <input type="date" {...invoiceForm.register('date')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Échéance</label>
                <input type="date" {...invoiceForm.register('dueDate')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">
                {editingId ? "Mettre à jour" : "Créer la facture"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={quoteForm.handleSubmit(onQuoteSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Numéro de devis</label>
              <input {...quoteForm.register('number')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" placeholder="DE-2026-001" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Client</label>
                <select {...quoteForm.register('clientId')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white">
                  <option value="">Sélectionner</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Site</label>
                <select {...quoteForm.register('siteId')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white">
                  <option value="">Sélectionner</option>
                  {sites.filter(s => s.clientId === quoteForm.watch('clientId')).map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Montant HT (€)</label>
                <input type="number" {...quoteForm.register('amountHT', { valueAsNumber: true })} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Montant TTC (€)</label>
                <input type="number" {...quoteForm.register('amountTTC', { valueAsNumber: true })} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                <input type="date" {...quoteForm.register('date')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Valide jusqu'au</label>
                <input type="date" {...quoteForm.register('validUntil')} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">
                {editingId ? "Mettre à jour" : "Créer le devis"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
