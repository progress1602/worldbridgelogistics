import { Shipment } from '../types';

const GRAPHQL_URL = 'https://world-bridge-7zfq.onrender.com/graphql';

const TRACKING_QUERY = `
query TrackShipment($trackingId: String!) {
  trackShipment(trackingId: $trackingId) {
    id
    trackingId
    senderName
    receiverName
    originPort
    destination
    currentLocation
    status
    weight
    carrier
    shipmentDate
    deliveryDate
    eventLog {
      status
      location
    }
    createdAt
    updatedAt
  }
}
`;

export async function fetchShipmentData(trackingId: string): Promise<Shipment | null> {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: TRACKING_QUERY,
        variables: { trackingId },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      return null;
    }

    const data = result.data?.trackShipment;

    if (!data) {
      return null;
    }

    // Map eventLog to updates for back-compatibility with UI
    const shipment: Shipment = {
      ...data,
      updates: data.eventLog?.map((log: any, index: number) => ({
        id: `log-${index}`,
        status: log.status,
        location: log.location,
        description: "", // Leave empty for a cleaner UI if not provided by backend
        date: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
      })) || [],
    };

    return shipment;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}
