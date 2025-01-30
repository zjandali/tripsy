'use client';

import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Airport {
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

interface AirportSelectProps {
  value: string;
  onChange: (iataCode: string) => void;
  placeholder: string;
}

const commonAirports: Airport[] = [
  { iataCode: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
  { iataCode: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { iataCode: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA' },
  { iataCode: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'USA' },
  { iataCode: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
];

export function AirportSelect({ onChange, placeholder }: AirportSelectProps) {
  const [query, setQuery] = useState('');
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setAirports(commonAirports.filter(airport => 
      airport.name.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase()) ||
      airport.iataCode.toLowerCase().includes(query.toLowerCase())
    ));
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg max-h-60 overflow-auto">
          {airports.map((airport) => (
            <div
              key={airport.iataCode}
              className="p-2 hover:bg-white/20 cursor-pointer text-white"
              onClick={() => {
                onChange(airport.iataCode);
                setQuery(airport.iataCode);
                setIsOpen(false);
              }}
            >
              <div className="font-semibold">{airport.iataCode}</div>
              <div className="text-sm text-white/70">{airport.city} - {airport.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 