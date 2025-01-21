import { format } from 'date-fns';

interface Segment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  duration: string;
}

interface FlightOffer {
  id: string;
  itineraries: {
    duration: string;
    segments: Segment[];
  }[];
  price: {
    total: string;
    currency: string;
  };
}

interface FlightResultsProps {
  flights: FlightOffer[];
}

export function FlightResults({ flights }: FlightResultsProps) {
  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <div
          key={flight.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          {flight.itineraries[0].segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">{format(new Date(segment.departure.at), 'HH:mm')}</p>
                    <p className="text-sm text-gray-600">{segment.departure.iataCode}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500">{segment.duration.replace('PT', '')}</p>
                    <div className="w-32 h-px bg-gray-300 my-2"></div>
                    <p className="text-xs text-gray-500">{segment.carrierCode} {segment.number}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{format(new Date(segment.arrival.at), 'HH:mm')}</p>
                    <p className="text-sm text-gray-600">{segment.arrival.iataCode}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center border-t pt-4">
            <p className="font-semibold">
              {flight.price.currency} {flight.price.total}
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Select
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 