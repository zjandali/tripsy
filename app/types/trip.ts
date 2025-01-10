interface TripDetails {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  selectedDestination?: Destination;
  participants: string[];
  budget?: number;
  status: 'draft' | 'active' | 'completed';
}

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
}

export type { TripDetails, Destination }; 