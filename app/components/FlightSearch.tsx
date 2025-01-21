'use client';

import { useState } from 'react';
import { Plane, Loader } from 'lucide-react';

interface FlightSearchProps {
  origin: string;
  destination: string;
  date: string;
}

interface Flight {
  airline: string;
  departureTime: string;
  arrivalTime: string;
  price: {
    amount: number;
    currency: string;
  };
  stops: number;
  bookingUrl: string;
}

export default function FlightSearch({ origin, destination, date }: FlightSearchProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/flights?origin=${origin}&destination=${destination}&date=${date}`
      );
      if (!response.ok) throw new Error('Failed to fetch flights');
      const data = await response.json();
      setFlights(data.flights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={searchFlights}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader className="animate-spin h-5 w-5" />
        ) : (
          <Plane className="h-5 w-5" />
        )}
        <span>{loading ? 'Searching...' : 'Search Flights'}</span>
      </button>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {flights.length > 0 && (
        <div className="space-y-2">
          {flights.map((flight, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">{flight.airline}</span>
                <span className="text-white/70">
                  {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                </span>
              </div>
              <div className="flex justify-between text-white mb-2">
                <span>{flight.departureTime}</span>
                <span>{flight.arrivalTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">
                  {flight.price.currency} {flight.price.amount}
                </span>
                <a
                  href={flight.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm"
                >
                  Book
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 