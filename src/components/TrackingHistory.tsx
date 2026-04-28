import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Trash2, ArrowRight, Package } from 'lucide-react';
import { getTrackedHistory, clearHistory } from '../lib/storage';

interface TrackingHistoryProps {
  onSelect: (id: string) => void;
}

export const TrackingHistory: React.FC<TrackingHistoryProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<string[]>([]);

  const loadHistory = () => {
    setHistory(getTrackedHistory());
  };

  useEffect(() => {
    loadHistory();
    
    // Listen for storage changes in other tabs or within this one
    const handleStorage = () => loadHistory();
    window.addEventListener('storage', handleStorage);
    
    // Custom event for same-tab updates
    const interval = setInterval(loadHistory, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearHistory();
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <section className="py-12 bg-white -mt-12 md:-mt-20 relative z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-primary/5 border border-gray-100 p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Clock className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Session Memory</div>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-navy uppercase tracking-tighter italic">Recent <span className="text-primary">Traces.</span></h2>
               </div>
            </div>
            <button 
              onClick={handleClear}
              className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors italic group"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" /> Clear History
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {history.map((id, index) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelect(id)}
                  className="group relative cursor-pointer"
                >
                  <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:border-primary/30 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-navy shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <Package className="w-5 h-5" />
                       </div>
                       <div className="truncate font-black text-sm text-navy uppercase tracking-tight italic">{id}</div>
                    </div>
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-primary italic opacity-60 group-hover:opacity-100 transition-all">
                      Relink Node <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
