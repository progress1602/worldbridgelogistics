export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'ON_HOLD' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface TrackingUpdate {
  id: string;
  shipmentId?: string;
  location: string;
  status: string;
  description?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Shipment {
  id: string;
  trackingId: string;
  senderName: string;
  receiverName: string;
  originPort: string;
  destination: string;
  currentLocation: string;
  status: ShipmentStatus;
  weight: string;
  carrier: string;
  shipmentDate: string;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
  eventLog?: { status: string; location: string }[];
  updates?: TrackingUpdate[];
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}
