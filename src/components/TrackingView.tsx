import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Package, Zap } from 'lucide-react';
import { TrackingHistory } from './TrackingHistory';

interface TrackingViewProps {
  onSearch: (id: string) => void;
  isSearching: boolean;
}

export const TrackingView: React.FC<TrackingViewProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="min-h-[80vh] pt-32 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/10">
            <Zap className="w-3 h-3 fill-primary" />
            Centralized Manifest Tracker
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-navy uppercase tracking-tighter leading-none mb-8">
            Shipment <br />
            <span className="text-primary italic">Intelligence.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed italic">
            Access the global distribution hash. Monitor infrastructure checkpoints and lifecycle metrics in real-time through our secured tracking layer.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-24">
          <form 
            onSubmit={handleSubmit}
            className="relative group h-20 md:h-24"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            <div className="relative h-full flex bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden pr-2 md:pr-3">
              <div className="flex items-center pl-6 md:pl-8 text-gray-300">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Global Tracking ID..."
                className="flex-1 bg-transparent border-none outline-none px-4 md:px-6 font-display font-black text-lg md:text-xl text-navy placeholder:text-gray-200 uppercase tracking-tight"
              />
              <div className="flex items-center py-2 md:py-3">
                <button 
                  type="submit"
                  disabled={isSearching}
                  className="h-full px-8 md:px-12 bg-navy text-white rounded-[1.2rem] md:rounded-[1.5rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-primary transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 group"
                >
                  {isSearching ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    >
                      <Zap className="w-4 h-4 fill-white" />
                    </motion.div>
                  ) : (
                    <>
                      Monitor <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
             <span className="flex items-center gap-2 decoration-primary/20 underline underline-offset-4"><Package className="w-3 h-3 text-primary" /> Real-Time Nodes</span>
             <span className="flex items-center gap-2 decoration-primary/20 underline underline-offset-4"><Zap className="w-3 h-3 text-primary" /> Instant Feedback</span>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-1 shadow-sm border border-gray-100">
           <TrackingHistory onSelect={onSearch} />
        </div>
      </div>
    </div>
  );
};

// Internal Arrow icon proxy if not imported (Lucide Check)
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
