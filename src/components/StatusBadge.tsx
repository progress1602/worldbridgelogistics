import React from 'react';
import { ShipmentStatus } from '../types';

interface StatusBadgeProps {
  status: ShipmentStatus;
}

const statusConfig: Record<ShipmentStatus, { label: string; color: string }> = {
  PENDING: { label: 'PENDING', color: 'bg-gray-100 text-gray-400 border-gray-200' },
  IN_TRANSIT: { label: 'IN TRANSIT', color: 'bg-primary/10 text-primary border-primary/20' },
  ON_HOLD: { label: 'ON HOLD', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  OUT_FOR_DELIVERY: { label: 'OUT FOR DELIVERY', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  DELIVERED: { label: 'DELIVERED', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CANCELLED: { label: 'CANCELLED', color: 'bg-rose-100 text-rose-700 border-rose-200' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.PENDING;
  
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${config.color} uppercase tracking-[0.2em] italic shadow-sm`}>
      {config.label}
    </span>
  );
};
