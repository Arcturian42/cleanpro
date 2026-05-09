import { useState } from 'react';
import { useStore } from '../../store';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Users, 
  MapPin, 
  Clock, 
  Briefcase,
  Search,
  Filter
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import CRMModuleLayout from './CRMModuleLayout';
import { motion } from 'motion/react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays,
} from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CalendarPage() {
  const { crmEvents, crmTeam } = useStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const eventsForDay = (day: Date) => crmEvents.filter(e => isSameDay(new Date(e.start), day));

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <CRMModuleLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Agenda de l'Équipe</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Planification des visites & Rdv commerciaux</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-white p-1 rounded-xl border border-slate-200 flex gap-1 shadow-sm">
              {(['month', 'week', 'day'] as const).map((v) => (
                <button 
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    view === v ? "bg-slate-900 text-white shadow-md shadow-slate-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {v === 'month' ? 'Mois' : v === 'week' ? 'Semaine' : 'Jour'}
                </button>
              ))}
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <Plus size={16} /> Planifier
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Calendar Grid */}
        <div className="xl:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
           {/* Header */}
           <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                   {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                 </h3>
                 <div className="flex gap-1">
                    <button 
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[10px] font-black text-blue-600 border-2 border-white shadow-sm ring-2 ring-blue-50">
                   J
                 </div>
                 <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-[10px] font-black text-emerald-600 border-2 border-white shadow-sm ring-2 ring-emerald-50">
                   A
                 </div>
                 <button className="p-2 text-slate-300 hover:text-slate-500"><Filter size={16} /></button>
              </div>
           </div>

           {/* Grid Body */}
           <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30">
              {weekDays.map(day => (
                <div key={day} className="py-3 px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center border-r border-slate-100 last:border-0">{day}</div>
              ))}
           </div>

           <div className="grid grid-cols-7 border-collapse">
              {calendarDays.map((day, i) => {
                const dayEvents = eventsForDay(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);

                return (
                  <div 
                    key={i}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "min-h-[120px] p-2 border-r border-b border-slate-100 group cursor-pointer transition-all relative",
                      !isCurrentMonth && "bg-slate-50/50",
                      isSelected && "bg-blue-50/30 ring-2 ring-inset ring-blue-100"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                       <span className={cn(
                         "text-[10px] font-black p-1.5 rounded-lg flex items-center justify-center min-w-[24px]",
                         isSameDay(day, new Date()) ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : 
                         isSelected ? "bg-slate-900 text-white" : "text-slate-400"
                       )}>
                         {format(day, 'd')}
                       </span>
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div 
                          key={event.id}
                          className={cn(
                            "px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter truncate border",
                            event.type === 'visit' ? "bg-blue-50 text-blue-600 border-blue-100" :
                            event.type === 'meeting' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-slate-50 text-slate-600 border-slate-100"
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[8px] font-black text-slate-400 uppercase text-center">+ {dayEvents.length - 3} de plus</div>
                      )}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activités du {format(selectedDate, 'd MMMM', { locale: fr })}</h4>
              
              <div className="space-y-4">
                 {eventsForDay(selectedDate).length > 0 ? (
                    eventsForDay(selectedDate).map((event) => (
                      <div key={event.id} className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                         <div className="flex items-start justify-between mb-3">
                            <span className={cn(
                              "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                              event.type === 'visit' ? "bg-blue-100 text-blue-600 border-blue-200" : "bg-amber-100 text-amber-600 border-amber-200"
                            )}>{event.type}</span>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-900">{format(new Date(event.start), 'HH:mm')}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">1h30</p>
                            </div>
                         </div>
                         <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors mb-4">{event.title}</h5>
                         
                         <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-slate-400">
                               <MapPin size={12} />
                               <span className="text-[10px] font-bold">Siège Nova Propreté</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                               <Users size={12} />
                               <span className="text-[10px] font-bold">Assigné à: {event.assignedTo.length} pers.</span>
                            </div>
                         </div>
                      </div>
                    ))
                 ) : (
                    <div className="py-10 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                       <Clock size={32} className="mx-auto text-slate-200 mb-2" />
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Rien de prévu</p>
                    </div>
                 )}
              </div>

              <div className="pt-6 border-t border-slate-100">
                 <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-200 border-dashed">
                    Voir toutes les visites
                 </button>
              </div>
           </div>
        </div>
      </div>
    </CRMModuleLayout>
  );
}
