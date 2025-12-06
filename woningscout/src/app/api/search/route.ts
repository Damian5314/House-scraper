import { NextRequest, NextResponse } from 'next/server';
import { runWoningScraper } from '@/lib/apify';
import { SearchFilters, SearchResponse, ApifyRunInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: SearchFilters = await request.json();

    if (!body.locatie) {
      return NextResponse.json<SearchResponse>(
        { success: false, error: 'Locatie is verplicht' },
        { status: 400 }
      );
    }

    const apifyInput: ApifyRunInput = {
      location: body.locatie,
      propertyType: body.type,
      minPrice: body.minPrijs ? parseInt(body.minPrijs) : undefined,
      maxPrice: body.maxPrijs ? parseInt(body.maxPrijs) : undefined,
      minRooms: body.kamers ? parseInt(body.kamers.replace('+', '')) : undefined,
      houseType: body.woningType || undefined,
    };

    // Check if Apify token is configured
    if (!process.env.APIFY_API_TOKEN) {
      console.log('No APIFY_API_TOKEN configured, returning mock data');
      return NextResponse.json<SearchResponse>({
        success: true,
        data: getMockData(body.locatie),
        totalResults: 4,
      });
    }

    const woningen = await runWoningScraper(apifyInput);

    return NextResponse.json<SearchResponse>({
      success: true,
      data: woningen,
      totalResults: woningen.length,
    });
  } catch (error) {
    console.error('Search API error:', error);

    // Return mock data for development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json<SearchResponse>({
        success: true,
        data: getMockData('Amsterdam'),
        totalResults: 4,
      });
    }

    return NextResponse.json<SearchResponse>(
      { success: false, error: 'Er is een fout opgetreden bij het zoeken' },
      { status: 500 }
    );
  }
}

function getMockData(location: string) {
  return [
    {
      id: '1',
      titel: 'Prachtig appartement in centrum',
      adres: 'Keizersgracht 123',
      postcode: '1015 CJ',
      plaats: location || 'Amsterdam',
      prijs: 425000,
      kamers: 3,
      oppervlakte: 85,
      foto: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
      type: 'Appartement',
      url: 'https://funda.nl',
      makelaar: 'Makelaardij Amsterdam',
      energielabel: 'A',
    },
    {
      id: '2',
      titel: 'Ruime gezinswoning met tuin',
      adres: 'Willemstraat 45',
      postcode: '3511 RJ',
      plaats: location || 'Utrecht',
      prijs: 550000,
      kamers: 5,
      oppervlakte: 140,
      foto: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
      type: 'Rijtjeshuis',
      url: 'https://funda.nl',
      makelaar: 'Makelaars Groep',
      energielabel: 'B',
    },
    {
      id: '3',
      titel: 'Moderne nieuwbouwwoning',
      adres: 'Parkweg 78',
      postcode: '5611 AH',
      plaats: location || 'Eindhoven',
      prijs: 389000,
      kamers: 4,
      oppervlakte: 110,
      foto: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
      type: '2-onder-1-kap',
      url: 'https://funda.nl',
      makelaar: 'Vastgoed Plus',
      energielabel: 'A++',
    },
    {
      id: '4',
      titel: 'Karakteristiek herenhuis',
      adres: 'Oude Haven 12',
      postcode: '3011 GE',
      plaats: location || 'Rotterdam',
      prijs: 675000,
      kamers: 6,
      oppervlakte: 180,
      foto: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
      type: 'Vrijstaand',
      url: 'https://funda.nl',
      makelaar: 'Rotterdam Huizen',
      energielabel: 'C',
    },
    {
      id: '5',
      titel: 'Luxe penthouse met uitzicht',
      adres: 'Skyline Tower 42',
      postcode: '1012 AB',
      plaats: location || 'Amsterdam',
      prijs: 895000,
      kamers: 4,
      oppervlakte: 150,
      foto: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
      type: 'Penthouse',
      url: 'https://funda.nl',
      makelaar: 'Luxury Living',
      energielabel: 'A+',
    },
    {
      id: '6',
      titel: 'Gezellige studio in de stad',
      adres: 'Centrumplein 8',
      postcode: '2511 VJ',
      plaats: location || 'Den Haag',
      prijs: 189000,
      kamers: 1,
      oppervlakte: 35,
      foto: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
      type: 'Studio',
      url: 'https://funda.nl',
      makelaar: 'City Makelaars',
      energielabel: 'B',
    },
  ];
}
