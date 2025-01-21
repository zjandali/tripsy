import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  if (!origin || !destination || !date) {
    return new NextResponse('Missing required parameters', { status: 400 });
  }

  try {
    // Make request to Firecrawl API
    const app = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY
    });
    
    // Define schema to extract flight data
    const schema = z.object({
      flights: z.array(z.object({
        airline: z.string(),
        departureTime: z.string(),
        arrivalTime: z.string(),
        price: z.object({
          amount: z.number(),
          currency: z.string()
        }),
        stops: z.number(),
        bookingUrl: z.string()
      })),
      searchSummary: z.object({
        totalResults: z.number(),
        cheapestPrice: z.number()
      })
    });
    
    const response = await app.extract([
      'https://www.kayak.com/flights/*', 
      'https://www.google.com/travel/flights/*', 
      'https://www.expedia.com/Flights-Search/*'
    ], {
      prompt: `Find flights from ${origin} to ${destination} for ${date}. Include direct booking URLs for each flight.`,
      schema: schema
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return new NextResponse('Error fetching flight data', { status: 500 });
  }
}