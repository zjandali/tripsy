'use client';

import { useState, useEffect } from 'react';
import { FlightResults } from './FlightResults';

interface FlightSearchProps {
  origin: string;
  destination: string;
  date: string;
}

export function FlightSearch({ origin, destination, date }: FlightSearchProps) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/flights?origin=${origin}&destination=${destination}&date=${date}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch flights');
        }
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
        setError('Unable to load flights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (origin && destination && date) {
      searchFlights();
    }
  }, [origin, destination, date]);

  return (
    <div className="space-y-6">
      {/* Add your search form here */}
      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}
      {loading ? (
        <div className="text-center text-white">Loading flights...</div>
      ) : (
        flights.length > 0 ? (
          <FlightResults flights={flights} />
        ) : (
          !error && <div className="text-center text-white/70">No flights found</div>
        )
      )}
    </div>
  );
} 