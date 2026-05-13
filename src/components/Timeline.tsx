import React from 'react';
import { TrackingUpdate } from '../types';
import { CheckCircle2, Circle, MapPin, Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface TimelineProps {
  updates: TrackingUpdate[];
}

export const Timeline: React.FC<TimelineProps> = ({ updates }) => {
  const sortedUpdates = [...updates].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-accent before:rounded-full">
      {sortedUpdates.map((update, index) => (
        <motion.div
          key={update.id || index}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
        >
          {/* Node Pulse Icon */}
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl border-4 border-white bg-navy text-primary shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 overflow-hidden relative">
            {index === 0 ? (
              <>
                 <div className="absolute inset-0 bg-primary opacity-20 animate-pulse" />
                 <Activity className="w-6 h-6 relative z-10" />
              </>
            ) : (
              <ShieldCheck className="w-5 h-5 text-gray-500 opacity-50" />
            )}
          </div>

          {/* Intelligence Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-4rem)] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-gray-50 bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-16px_rgba(255,107,0,0.05)] transition-all duration-500 hover:scale-[1.02]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4">
               <div>
                  <div className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${index === 0 ? 'text-primary' : 'text-gray-400'}`}>
                    {index === 0 ? 'Latest Node Capture' : 'Historic Trace'}
                  </div>
                  <h4 className="font-display font-black text-lg md:text-xl text-navy uppercase tracking-tight italic leading-tight">
                    {update.status.replace(/_/g, ' ')}
                  </h4>
               </div>
               {update.date && (
                 <div className="bg-accent px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black text-primary font-mono shadow-sm w-fit">
                    {update.date}
                 </div>
               )}
            </div>
            
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
               <MapPin className="w-3.5 h-3.5 text-primary" />
               <span className="text-xs font-black text-navy uppercase tracking-tight italic">{update.location}</span>
            </div>
            
            {update.description && (
              <p className="text-gray-400 text-sm font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4">
                {update.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
