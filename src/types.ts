export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'ON_HOLD' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface TrackingUpdate {
  id: string;
  shipmentId: string;
  location: string;
  status: ShipmentStatus;
  description: string;
  date: string;
}

export interface Shipment {
  id: string; // Internal DB ID
  trackingId: string; // The visible tracking number
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  currentLocation: string;
  status: ShipmentStatus;
  weight: string;
  carrier: string;
  shipmentDate: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  updates: TrackingUpdate[];
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}
