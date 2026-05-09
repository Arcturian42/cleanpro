import { useState } from 'react';
import { INTERVENTIONS, AGENTS } from '../data/mockData';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Plus, Filter, Download, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { addDays, startOfWeek, format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6:00 to 20:00

export default function PlanningPage() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-05-04')); // Demo starts on Monday May 4th
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getInterventionsForDay = (day: Date) => {
    return INTERVENTIONS.filter(inter => isSameDay(new Date(inter.date), day));
  };

  const getAgentColor = (id: string) => {
    const colors = ['bg-blue-100 border-blue-200 text-blue-700', 'bg-indigo-100 border-indigo-200 text-indigo-700', 'bg-purple-100 border-purple-200 text-purple-700', 'bg-pink-100 border-pink-200 text-pink-700', 'bg-orange-100 border-orange-200 text-orange-700'];
    const index = AGENTS.findIndex(a => a.id === id);
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Planning Hebdomadaire</h2>
          <p className="text-slate-500 font-medium">Gérez la répartition des interventions sur la semaine.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mr-2">
            <button 
              onClick={() => setCurrentDate(addDays(currentDate, -7))}
              className="p-2.5 hover:bg-slate-50 border-r border-slate-200 text-slate-500 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="px-4 py-2 text-sm font-bold text-slate-700 min-w-[180px] text-center flex items-center justify-center">
              Semaine du {format(weekStart, 'dd MMMM', { locale: fr })}
            </div>
            <button 
              onClick={() => setCurrentDate(addDays(currentDate, 7))}
              className="p-2.5 hover:bg-slate-50 text-slate-500 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
            <Filter size={16} />
            Filtrer
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">
            <Plus size={18} />
            Nouvelle
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Calendar Header */}
        <div className="grid grid-cols-8 border-b border-slate-100 bg-slate-50/50">
          <div className="p-4 border-r border-slate-100"></div>
          {weekDays.map((day) => (
            <div key={day.toString()} className={cn(
              "p-4 border-r border-slate-100 text-center last:border-r-0",
              isSameDay(day, new Date('2026-05-09')) ? "bg-blue-50/50" : ""
            )}>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{format(day, 'EEE', { locale: fr })}</p>
              <p className={cn(
                "text-2xl font-black mt-1",
                isSameDay(day, new Date('2026-05-09')) ? "text-blue-600" : "text-slate-800"
              )}>{format(day, 'dd')}</p>
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="grid grid-cols-8 min-h-full">
            {/* Time Column */}
            <div className="border-r border-slate-100 bg-slate-50/20">
              {HOURS.map((hour) => (
                <div key={hour} className="h-24 border-b border-slate-100 p-2 text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{hour}:00</span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {weekDays.map((day) => {
              const dayInterventions = getInterventionsForDay(day);
              return (
                <div key={day.toString()} className={cn(
                  "relative border-r border-slate-100 last:border-r-0 h-full group",
                  isSameDay(day, new Date('2026-05-09')) ? "bg-blue-50/10" : ""
                )}>
                  {/* Hour slots background */}
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-24 border-b border-slate-100/50 group-hover:bg-slate-50/30 transition-colors"></div>
                  ))}

                  {/* Interventions */}
                  {dayInterventions.map((inter) => {
                    const startHour = parseInt(inter.startTime.split(':')[0]);
                    const startMin = parseInt(inter.startTime.split(':')[1]);
                    const endHour = parseInt(inter.endTime.split(':')[0]);
                    const endMin = parseInt(inter.endTime.split(':')[1]);
                    
                    const top = (startHour - 6) * 96 + (startMin / 60) * 96;
                    const height = ((endHour - startHour) * 60 + (endMin - startMin)) * (96 / 60);

                    return (
                      <motion.div
                        key={inter.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                          "absolute left-1 right-1 rounded-xl p-2.5 border shadow-sm z-10 flex flex-col gap-1 overflow-hidden group/item cursor-pointer hover:shadow-md hover:z-20 transition-all",
                          getAgentColor(inter.agentIds[0])
                        )}
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-[9px] font-black uppercase tracking-tight truncate">{inter.startTime} - {inter.endTime}</p>
                          <Clock size={10} className="opacity-40" />
                        </div>
                        <p className="font-black text-[11px] leading-tight group-hover/item:underline truncate">Bureau Plus</p>
                        <p className="text-[10px] font-bold opacity-70 truncate">Étage 1</p>
                        <div className="mt-auto pt-1 flex items-center justify-between">
                           <div className="w-5 h-5 rounded-full border border-white/40 overflow-hidden shrink-0">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${inter.agentIds[0]}`} alt="Agent" />
                           </div>
                           <div className={cn(
                             "w-1.5 h-1.5 rounded-full",
                             inter.status === 'completed' ? "bg-green-500" : 
                             inter.status === 'in_progress' ? "bg-blue-500" : "bg-slate-400"
                           )}></div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
