import React, { useState, useEffect } from 'react';
import { 
  Package, LayoutDashboard, Truck, LogOut, Plus, Search, 
  MapPin, Edit, Trash2, X, ChevronRight, Save, History, PlusCircle,
  Database, User as UserIcon, Settings, ShieldCheck, Globe, 
  ArrowUpRight, Activity, Terminal, Lock, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Shipment, ShipmentStatus, TrackingUpdate } from '../types';
import { getShipments, saveShipment, deleteShipment } from '../lib/storage';
import { StatusBadge } from './StatusBadge';

interface AdminProps {
  onLogout: () => void;
}

export const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@totalexpress.com' && password === 'total123') {
      onLogin();
    } else {
      setError('Operational Breach: Credentials mismatch detected.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/30 -skew-x-12 origin-top translate-x-1/4 -z-0" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <Terminal className="w-[800px] h-[800px] absolute -bottom-1/4 -left-1/4 text-navy" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-50 overflow-hidden">
           <div className="bg-navy p-12 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
             <div className="relative z-10">
               <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/10 text-primary">
                 <Lock className="w-8 h-8" />
               </div>
               <h1 className="font-display font-black text-3xl tracking-tighter text-white uppercase leading-none mb-2">INFRASTRUCTURE GATE</h1>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Accessing TED Global Mainframe</p>
             </div>
           </div>
           
           <div className="p-12">
             <form onSubmit={handleSubmit} className="space-y-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Operator ID</label>
                 <div className="relative group">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 px-14 py-4 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 ring-primary/5 transition-all font-bold text-navy placeholder:text-gray-300 placeholder:italic placeholder:font-normal"
                      placeholder="admin@totalexpress.com"
                      required
                    />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Security Hash</label>
                 <div className="relative group">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 px-14 py-4 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 ring-primary/5 transition-all font-bold text-navy"
                      placeholder="••••••••"
                      required
                    />
                 </div>
               </div>

               {error && (
                 <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[10px] font-black uppercase tracking-widest italic">
                    <AlertTriangle className="w-4 h-4" />
                    {error}
                 </div>
               )}

               <button 
                 type="submit"
                 className="w-full bg-primary hover:bg-navy text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/20 active:scale-[0.98] italic flex items-center justify-center gap-3 group"
               >
                 Authorize Access
                 <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
               </button>
             </form>
             
             <div className="mt-12 flex items-center justify-center gap-4 text-gray-300">
                <div className="h-px flex-1 bg-gray-50" />
                <div className="text-[9px] font-black uppercase tracking-[0.3em]">Encrypted Session</div>
                <div className="h-px flex-1 bg-gray-50" />
             </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminProps> = ({ onLogout }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [activeTab, setActiveTab] = useState<'shipments' | 'add' | 'settings'>('shipments');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<Shipment | null>(null);

  const [newUpdate, setNewUpdate] = useState({
    location: '',
    status: 'IN_TRANSIT' as ShipmentStatus,
    description: ''
  });

  useEffect(() => {
    setShipments(getShipments());
  }, []);

  const refreshShipments = () => {
    setShipments(getShipments());
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment({ ...shipment });
    setActiveTab('add');
  };

  const handleDelete = (id: string) => {
    if (confirm('Operational Override: Purge this logistics node?')) {
      deleteShipment(id);
      refreshShipments();
    }
  };

  const handleSaveShipment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const shipmentData: Shipment = {
      id: editingShipment?.id || `ID-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      trackingId: editingShipment?.trackingId || `TED-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(Math.random()*900)+100}`,
      senderName: formData.get('senderName') as string,
      receiverName: formData.get('receiverName') as string,
      originPort: formData.get('originPort') as string,
      destination: formData.get('destination') as string,
      weight: formData.get('weight') as string,
      carrier: formData.get('carrier') as string,
      shipmentDate: formData.get('shipmentDate') as string,
      deliveryDate: formData.get('deliveryDate') as string,
      status: (formData.get('status') as ShipmentStatus) || 'PENDING',
      currentLocation: formData.get('currentLocation') as string,
      createdAt: editingShipment?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: editingShipment?.updates || [
        {
          id: Date.now().toString(),
          shipmentId: editingShipment?.id || 'NEW',
          status: (formData.get('status') as ShipmentStatus) || 'PENDING',
          location: (formData.get('originPort') as string) || (formData.get('origin') as string),
          description: 'Logistics manifest initialized in global infrastructure.',
          date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString().slice(0, 5)
        }
      ]
    };

    saveShipment(shipmentData);
    refreshShipments();
    setEditingShipment(null);
    setActiveTab('shipments');
  };

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showUpdateModal) return;

    const update: TrackingUpdate = {
      id: Date.now().toString(),
      shipmentId: showUpdateModal.id,
      status: newUpdate.status,
      location: newUpdate.location,
      description: newUpdate.description,
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString().slice(0, 5)
    };

    const updatedShipment = {
      ...showUpdateModal,
      status: newUpdate.status,
      currentLocation: newUpdate.location,
      updatedAt: new Date().toISOString(),
      updates: [update, ...showUpdateModal.updates]
    };

    saveShipment(updatedShipment);
    refreshShipments();
    setShowUpdateModal(null);
    setNewUpdate({ location: '', status: 'IN_TRANSIT', description: '' });
  };

  const filteredShipments = shipments.filter(s => 
    s.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.receiverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar - High Tech Slate */}
      <aside className="w-80 bg-navy text-white flex flex-col shrink-0 border-r border-white/5">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tighter text-white uppercase leading-none">WORLDBRIDGE</span>
              <span className="font-display font-bold text-[9px] tracking-[0.4em] text-primary uppercase leading-none mt-1">Operational OS</span>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'shipments', label: 'Global Manifest', icon: Database },
              { id: 'add', label: 'Deploy Node', icon: PlusCircle },
              { id: 'settings', label: 'Hyper Config', icon: Settings },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => {setActiveTab(tab.id as any); setEditingShipment(null);}}
                className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative group
                  ${activeTab === tab.id ? 'bg-primary text-white shadow-2xl shadow-primary/20 italic' : 'text-gray-500 hover:text-white hover:bg-white/5'}
                `}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-primary/40 group-hover:text-primary transition-colors'}`} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-pill" className="absolute left-0 w-1 h-1/2 bg-white rounded-full opacity-50" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-10">
           <div className="bg-white/5 rounded-[2rem] p-6 mb-8 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="w-3 h-3 text-primary" />
                 </div>
                 <div className="text-[9px] font-black text-white uppercase tracking-widest italic">Node Status: LIVE</div>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full w-[85%] bg-primary" />
              </div>
              <div className="mt-3 text-[8px] font-black text-gray-500 uppercase tracking-widest">Inbound Traffic: High</div>
           </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all italic underline decoration-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            Abort Operational Link
          </button>
        </div>
      </aside>

      {/* Modern Dashboard Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <header className="h-28 bg-white border-b border-gray-100 px-12 flex justify-between items-center shrink-0">
           <div>
             <h2 className="text-3xl font-display font-black text-navy uppercase tracking-tighter italic">
               {activeTab === 'shipments' ? 'Global Intelligence Cluster' : activeTab === 'add' ? (editingShipment ? 'Hash Mutation' : 'Node Vector Genesis') : 'Neural Interface Parameters'}
             </h2>
             <div className="flex items-center gap-2 mt-1">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-0.5">TED-OS v4.5.18 Stable Build</p>
             </div>
           </div>
           
           {activeTab === 'shipments' && (
             <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search Consignment Node..."
                  className="bg-gray-50 border border-gray-100 rounded-2xl px-14 py-4 text-[10px] font-black uppercase tracking-widest w-96 outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all text-navy placeholder:text-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
           )}
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-12">
          <AnimatePresence mode="wait">
            {activeTab === 'shipments' && (
              <motion.div 
                key="list"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 italic">
                          <th className="px-10 py-8 text-[10px] uppercase font-black tracking-[0.2em] text-navy">Vector Hash</th>
                          <th className="px-10 py-8 text-[10px] uppercase font-black tracking-[0.2em] text-navy">Target Flow</th>
                          <th className="px-10 py-8 text-[10px] uppercase font-black tracking-[0.2em] text-navy">Node State</th>
                          <th className="px-10 py-8 text-[10px] uppercase font-black tracking-[0.2em] text-navy text-right">Overrides</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredShipments.map((s) => (
                          <tr key={s.id} className="hover:bg-accent/20 transition-colors group">
                            <td className="px-10 py-10 font-display font-black text-sm text-primary tracking-tight">{s.trackingId}</td>
                            <td className="px-10 py-10">
                               <div className="text-[11px] font-black text-navy uppercase tracking-tight">{s.senderName}</div>
                               <div className="flex items-center gap-2 mt-1">
                                 <ArrowUpRight className="w-3 h-3 text-gray-300" />
                                 <div className="text-[10px] font-bold text-gray-400 italic">{s.receiverName}</div>
                               </div>
                            </td>
                            <td className="px-10 py-10">
                              <StatusBadge status={s.status} />
                            </td>
                            <td className="px-10 py-10 text-right">
                               <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                 <button onClick={() => setShowUpdateModal(s)} className="w-10 h-10 rounded-xl border border-gray-100 bg-white text-gray-400 hover:border-emerald-500 hover:text-emerald-500 hover:-translate-y-0.5 transition-all shadow-sm flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                                 <button onClick={() => handleEdit(s)} className="w-10 h-10 rounded-xl border border-gray-100 bg-white text-gray-400 hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all shadow-sm flex items-center justify-center"><Edit className="w-4 h-4" /></button>
                                 <button onClick={() => handleDelete(s.id)} className="w-10 h-10 rounded-xl border border-gray-100 bg-white text-gray-400 hover:border-rose-500 hover:text-rose-500 hover:-translate-y-0.5 transition-all shadow-sm flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredShipments.length === 0 && (
                    <div className="p-24 text-center">
                       <Database className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                       <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">No operational data nodes found.</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'add' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-5xl mx-auto"
              >
                <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-50 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                  
                  <form onSubmit={handleSaveShipment} className="p-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-10">
                         <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.4em] text-[10px] border-b border-primary/10 pb-4 italic">
                           <UserIcon className="w-4 h-4" /> Personnel Vector
                         </div>
                         <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Consignor Identity</label>
                               <input name="senderName" defaultValue={editingShipment?.senderName} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all" required />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Consignee Identity</label>
                               <input name="receiverName" defaultValue={editingShipment?.receiverName} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all" required />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-10">
                         <div className="flex items-center gap-4 text-primary font-black uppercase tracking-[0.4em] text-[10px] border-b border-primary/10 pb-4 italic">
                           <Globe className="w-4 h-4" /> Global Topology
                         </div>
                         <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Entry Port Node</label>
                               <input name="originPort" defaultValue={editingShipment?.originPort} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all" required />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Exit Port Node</label>
                               <input name="destination" defaultValue={editingShipment?.destination} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all" required />
                            </div>
                         </div>
                      </div>

                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-10">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Payload Mass (KG)</label>
                            <input name="weight" defaultValue={editingShipment?.weight} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all" required />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Carrier Fleet Unit</label>
                            <input name="carrier" defaultValue={editingShipment?.carrier} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all" required />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Active Processing Node</label>
                            <input name="currentLocation" defaultValue={editingShipment?.currentLocation} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all" required />
                         </div>
                      </div>

                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-3 md:col-span-1">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Operational Flow State</label>
                          <select name="status" defaultValue={editingShipment?.status} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-black text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all appearance-none uppercase italic tracking-widest leading-tight">
                            <option value="PENDING">PENDING</option>
                            <option value="IN_TRANSIT">IN TRANSIT</option>
                            <option value="ON_HOLD">ON HOLD</option>
                            <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Genesis Date</label>
                          <input type="date" name="shipmentDate" defaultValue={editingShipment?.shipmentDate} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all" required />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 italic">Calculated ETA</label>
                          <input type="date" name="deliveryDate" defaultValue={editingShipment?.deliveryDate} className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all" required />
                        </div>
                      </div>
                    </div>

                    <div className="mt-20 flex gap-6">
                      <button type="submit" className="flex-1 bg-primary hover:bg-navy text-white font-black py-6 rounded-[2rem] uppercase tracking-[0.3em] transition-all shadow-[0_32px_64px_-16px_rgba(255,107,0,0.3)] active:scale-[0.98] italic flex items-center justify-center gap-4 group">
                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {editingShipment ? 'Commit Vector Mutation' : 'Genesis Node Deployment'}
                      </button>
                      <button type="button" onClick={() => {setActiveTab('shipments'); setEditingShipment(null);}} className="px-12 bg-white border border-gray-100 rounded-[2rem] text-gray-400 font-black py-6 uppercase tracking-widest text-[11px] hover:bg-gray-50 transition-all">Abort</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modern High-Performance Trace Modal */}
      <AnimatePresence>
        {showUpdateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUpdateModal(null)} className="absolute inset-0 bg-navy/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-white rounded-[3rem] p-16 shadow-2xl border border-white/10 group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-primary" />
              
              <div className="mb-12 flex justify-between items-start">
                 <div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-3 italic">Event Mutation Interface</div>
                    <h3 className="text-4xl font-display font-black text-navy tracking-tighter uppercase leading-none italic">{showUpdateModal.id}</h3>
                 </div>
                 <button onClick={() => setShowUpdateModal(null)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all">
                   <X className="w-6 h-6" />
                 </button>
              </div>

              <form onSubmit={handleAddUpdate} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Target Cluster Node</label>
                  <input type="text" required className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all placeholder:text-gray-300" placeholder="e.g. Amsterdam Hub 7" value={newUpdate.location} onChange={(e) => setNewUpdate({...newUpdate, location: e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Vector State Transition</label>
                  <div className="relative">
                    <select className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-black text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all appearance-none uppercase italic tracking-widest" value={newUpdate.status} onChange={(e) => setNewUpdate({...newUpdate, status: e.target.value as ShipmentStatus})}>
                      <option value="PENDING">PENDING</option>
                      <option value="IN_TRANSIT">IN TRANSIT</option>
                      <option value="ON_HOLD">ON HOLD</option>
                      <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Manifest Audit Log</label>
                   <textarea rows={4} required className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 font-bold text-navy outline-none focus:border-primary/40 focus:ring-4 ring-primary/5 transition-all resize-none placeholder:text-gray-300" placeholder="Describe the operational event..." value={newUpdate.description} onChange={(e) => setNewUpdate({...newUpdate, description: e.target.value})} />
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-navy text-white font-black py-6 rounded-[2rem] uppercase tracking-[0.3em] transition-all shadow-[0_32px_64px_-16px_rgba(255,107,0,0.3)] italic flex items-center justify-center gap-4 group">
                  <Activity className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Inject Trace Hash
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

