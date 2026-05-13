import { Shipment, ShipmentStatus } from '../types';

const SHIPMENTS_KEY = 'swifttrack_shipments';

// Self-healing: if localStorage exists but schema is old, clear it.
const checkAndClearStaleStorage = () => {
  const stored = localStorage.getItem(SHIPMENTS_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (!parsed[0].trackingId) {
          localStorage.removeItem(SHIPMENTS_KEY);
        }
      }
    } catch (e) {
      localStorage.removeItem(SHIPMENTS_KEY);
    }
  }
};

checkAndClearStaleStorage();

const initialShipments: Shipment[] = [
  {
    id: '1',
    trackingId: 'ST123456789',
    senderName: 'John Global',
    receiverName: 'Jane Smith',
    originPort: 'London, UK',
    destination: 'Lagos, Nigeria',
    weight: '2.5kg',
    carrier: 'WorldBridge Air',
    shipmentDate: '2026-04-18',
    deliveryDate: '2026-04-25',
    status: 'IN_TRANSIT',
    currentLocation: 'Lagos, Nigeria',
    createdAt: '2026-04-18T10:00:00Z',
    updatedAt: '2026-04-21T16:38:22Z',
    updates: [
      {
        id: '101',
        shipmentId: '1',
        status: 'IN_TRANSIT',
        location: 'Lagos, Nigeria',
        description: 'Package arrived at the local sorting facility.',
        date: '2026-04-22 09:00'
      },
      {
        id: '102',
        shipmentId: '1',
        status: 'IN_TRANSIT',
        location: 'Dubai, UAE',
        description: 'Shipment in transit through Dubai hub.',
        date: '2026-04-20 14:30'
      },
      {
        id: '103',
        shipmentId: '1',
        status: 'PENDING',
        location: 'London, UK',
        description: 'Shipment created and picked up by carrier.',
        date: '2026-04-18 10:00'
      }
    ]
  }
];

export const getShipments = (): Shipment[] => {
  const stored = localStorage.getItem(SHIPMENTS_KEY);
  if (!stored) {
    localStorage.setItem(SHIPMENTS_KEY, JSON.stringify(initialShipments));
    return initialShipments;
  }
  return JSON.parse(stored);
};

export const saveShipment = (shipment: Shipment): void => {
  const shipments = getShipments();
  const index = shipments.findIndex(s => s.id === shipment.id);
  if (index >= 0) {
    shipments[index] = shipment;
  } else {
    shipments.push(shipment);
  }
  localStorage.setItem(SHIPMENTS_KEY, JSON.stringify(shipments));
};

export const deleteShipment = (id: string): void => {
  const shipments = getShipments().filter(s => s.id !== id);
  localStorage.setItem(SHIPMENTS_KEY, JSON.stringify(shipments));
};

export const findShipment = (queryId: string): Shipment | undefined => {
  const shipments = getShipments();
  return shipments.find(s => 
    s.trackingId.toUpperCase() === queryId.toUpperCase() || 
    s.id.toUpperCase() === queryId.toUpperCase()
  );
};

// Dummy Mapping Function: Generates a believable shipment if ID follows a pattern or as a fallback
export const generateDummyShipment = (id: string): Shipment => {
  const status: ShipmentStatus = 'IN_TRANSIT';
  const now = new Date();
  const created = new Date(now.getTime() - 86400000 * 3).toISOString();
  
  return {
    id: `DUMMY-${id}`,
    trackingId: id.toUpperCase(),
    senderName: 'EXPRESS NODE ALPHA',
    receiverName: 'GLOBAL RECIPIENT',
    originPort: 'New York, USA',
    destination: 'London, UK',
    currentLocation: 'Transit Hub 04',
    status: status,
    weight: '4.2kg',
    carrier: 'WorldBridge Global',
    shipmentDate: created.split('T')[0],
    deliveryDate: new Date(now.getTime() + 86400000 * 4).toISOString().split('T')[0],
    createdAt: created,
    updatedAt: now.toISOString(),
    updates: [
      {
        id: 'u1',
        shipmentId: `DUMMY-${id}`,
        location: 'Transit Hub 04',
        status: 'IN_TRANSIT',
        description: 'Arrived at international distribution center.',
        date: now.toISOString().replace('T', ' ').slice(0, 16)
      },
      {
        id: 'u2',
        shipmentId: `DUMMY-${id}`,
        location: 'New York, USA',
        status: 'PENDING',
        description: 'Package received at originating terminal.',
        date: created.replace('T', ' ').slice(0, 16)
      }
    ]
  };
};
