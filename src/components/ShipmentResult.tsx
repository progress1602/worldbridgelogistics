import React, { useRef } from 'react';
import { Shipment } from '../types';
import { StatusBadge } from './StatusBadge';
import { Timeline } from './Timeline';
import { 
  Package, Truck, Calendar, MapPin, Scale, ChevronLeft, Map, 
  Download, Printer, ShieldCheck, Box, Info, Navigation, Globe, 
  AlertCircle, X 
} from 'lucide-react';
import { motion } from 'motion/react';
import { toPng } from 'html-to-image';

import { MapComponent } from './MapComponent';

interface ShipmentResultProps {
  shipment: Shipment;
  onBack: () => void;
}

export const ShipmentResult: React.FC<ShipmentResultProps> = ({ shipment, onBack }) => {
  const manifestRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (manifestRef.current === null) {
      return;
    }

    try {
      // Find the scrollable container inside the manifest
      const scrollable = manifestRef.current.querySelector('.overflow-y-auto');
      
      // Temporarily remove height constraints and scroll to capture everything
      const originalStyle = manifestRef.current.style.cssText;
      const originalMaxHeight = (scrollable as HTMLElement)?.style.maxHeight;
      const originalOverflow = (scrollable as HTMLElement)?.style.overflow;

      if (scrollable) {
        (scrollable as HTMLElement).style.maxHeight = 'none';
        (scrollable as HTMLElement).style.overflow = 'visible';
      }
      
      manifestRef.current.style.height = 'auto';
      manifestRef.current.style.maxHeight = 'none';

      const dataUrl = await toPng(manifestRef.current, {
        cacheBust: true,
        backgroundColor: '#f9fafb',
        pixelRatio: 2, // Higher quality
        filter: (node) => {
          if (node instanceof HTMLElement && (node.classList.contains('no-print') || node.classList.contains('no-download'))) {
            return false;
          }
          return true;
        }
      });
      
      // Restore styles
      manifestRef.current.style.cssText = originalStyle;
      if (scrollable) {
        (scrollable as HTMLElement).style.maxHeight = originalMaxHeight;
        (scrollable as HTMLElement).style.overflow = originalOverflow;
      }

      const link = document.createElement('a');
      link.download = `manifest_${shipment.trackingId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Snapshot failed:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    >
      <div 
        className="absolute inset-0 bg-navy/60 backdrop-blur-xl no-print" 
        onClick={onBack}
      />
      
        <motion.div
        ref={manifestRef}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-7xl h-full md:max-h-[90vh] bg-gray-50 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col print-content"
      >
        {/* Header Ribbon */}
        <div className="bg-white px-6 md:px-12 py-4 md:py-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
             <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg md:rounded-xl flex items-center justify-center text-white">
                <Box className="w-5 h-5 md:w-6 md:h-6" />
             </div>
             <div>
                <div className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Shipment Intelligence</div>
                <div className="text-sm md:text-lg font-black text-navy uppercase tracking-tight italic leading-none truncate max-w-[150px] md:max-w-none">ID: {shipment.trackingId}</div>
             </div>
          </div>
          <button 
            onClick={onBack}
            className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center text-navy hover:bg-primary hover:text-white transition-all no-print"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Main Information */}
            <div className="lg:col-span-8 space-y-8 md:space-y-12">
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.02] pointer-events-none no-print">
                    <Globe className="w-32 md:w-64 h-32 md:h-64" />
                 </div>
                 
                 <div className="p-6 md:p-10 border-b border-gray-50 bg-gradient-to-br from-white to-accent/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
                   <div>
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse no-print" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">System ID: {shipment.id}</span>
                      </div>
                      <h3 className="text-2xl md:text-5xl font-display font-black text-navy tracking-tighter uppercase leading-none">{shipment.trackingId}</h3>
                   </div>
                   <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                     <StatusBadge status={shipment.status} />
                     <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                        <ShieldCheck className="w-3 h-3 text-primary" /> Encrypted Manifest
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100 border-b border-gray-50">
                    {[
                      { label: 'Origin Port', val: shipment.originPort, icon: MapPin },
                      { label: 'Target Hub', val: shipment.destination, icon: Navigation },
                      { label: 'Carrier Node', val: shipment.carrier, icon: Truck },
                      { label: 'Payload Mass', val: shipment.weight, icon: Scale },
                    ].map((item, i) => (
                      <div key={i} className="p-4 md:p-6 hover:bg-accent/30 transition-colors group">
                        <div className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-4 group-hover:text-primary transition-colors">{item.label}</div>
                        <div className="flex items-center gap-2 md:gap-3">
                          <item.icon className="w-3 md:w-4 h-3 md:h-4 text-primary shrink-0" />
                          <span className="text-[10px] md:text-xs font-bold text-navy truncate">{item.val}</span>
                        </div>
                      </div>
                    ))}
                 </div>

                 <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 bg-white">
                    <div className="space-y-4 md:space-y-6">
                       <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic mb-2 md:mb-6">Entity Exchange</div>
                       <div className="flex justify-between items-center bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-100">
                         <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Originator</span>
                         <span className="text-xs md:text-sm font-black text-navy uppercase italic tracking-tight">{shipment.senderName}</span>
                       </div>
                       <div className="flex justify-between items-center bg-gray-50/50 p-4 md:p-5 rounded-2xl border border-gray-100">
                         <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient</span>
                         <span className="text-xs md:text-sm font-black text-navy uppercase italic tracking-tight">{shipment.receiverName}</span>
                       </div>
                    </div>
                    <div className="space-y-4 md:space-y-6">
                       <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic mb-2 md:mb-6">Lifecycle Metrics</div>
                       <div className="flex justify-between items-center bg-navy p-4 md:p-5 rounded-2xl text-white shadow-lg">
                         <span className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest">Dispatch</span>
                         <span className="text-xs md:text-sm font-black italic">{shipment.shipmentDate}</span>
                       </div>
                       <div className="flex justify-between items-center bg-primary p-4 md:p-5 rounded-2xl text-white shadow-xl shadow-primary/20">
                         <span className="text-[9px] md:text-[10px] font-black text-white/70 uppercase tracking-widest">Terminal ETA</span>
                         <span className="text-xs md:text-sm font-black italic">{shipment.deliveryDate}</span>
                       </div>
                    </div>
                 </div>

                 <div className="px-6 md:px-10 py-4 md:py-6 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-6 md:gap-12 justify-start">
                    <div>
                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Created At</div>
                        <div className="text-[9px] md:text-[10px] font-bold text-navy">{new Date(shipment.createdAt).toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Update</div>
                        <div className="text-[9px] md:text-[10px] font-bold text-navy">{new Date(shipment.updatedAt).toLocaleString()}</div>
                    </div>
                 </div>
              </div>

              {/* Timeline Section */}
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-gray-100 shadow-sm print-page-break">
                 <div className="flex items-center justify-between mb-8 md:mb-12">
                   <h3 className="text-xl md:text-3xl font-display font-black text-navy uppercase tracking-tighter leading-none">Event <span className="text-primary italic">Logs.</span></h3>
                   <div className="bg-accent px-3 py-1 md:px-4 md:py-2 rounded-lg text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest italic">{shipment.updates?.length || 0} Data Points</div>
                 </div>
                 <Timeline updates={shipment.updates || []} />
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-12">
              <div className="bg-navy rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                 <div className="absolute -top-10 -right-10 opacity-10 no-print">
                    <Navigation className="w-40 h-40 rotate-12" />
                 </div>
                 
                 <h4 className="text-xl font-display font-black mb-6 uppercase tracking-tight flex items-center gap-3">
                   <MapPin className="w-5 h-5 text-primary" /> Live Localization
                 </h4>
                 
                 <div className="aspect-video rounded-3xl overflow-hidden mb-8 shadow-2xl relative">
                    <MapComponent 
                      locationName={shipment.currentLocation} 
                      origin={shipment.originPort}
                      destination={shipment.destination}
                      history={shipment.updates}
                    />
                 </div>
                 
                 <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8 italic">
                   Current node processing active at {shipment.currentLocation}. Global infrastructure verified.
                 </p>
                 
                 <div className="flex gap-4 no-print no-download">
                   <button 
                     onClick={handleDownload}
                     className="flex-1 bg-white hover:bg-primary hover:text-white text-navy px-4 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all italic flex items-center justify-center gap-2 shadow-sm"
                   >
                     <Download className="w-4 h-4" /> Download Manifest
                   </button>
                   <button 
                     onClick={handlePrint}
                     className="w-14 h-14 bg-white/5 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-primary transition-all group shadow-sm"
                   >
                     <Printer className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                   </button>
                 </div>
              </div>

              <div className="bg-accent p-8 rounded-[2rem] border border-primary/5 no-print">
                 <div className="flex items-center gap-3 mb-6">
                   <ShieldCheck className="w-5 h-5 text-primary" />
                   <h5 className="font-display font-black text-navy uppercase tracking-tight text-sm italic">Cyber Security Layer</h5>
                 </div>
                 <p className="text-[10px] text-gray-500 font-medium leading-relaxed italic uppercase tracking-[0.05em]">
                   All communications regarding manifest {shipment.id} are logged via immutable ledger. Terminal activity remains private and encrypted.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
