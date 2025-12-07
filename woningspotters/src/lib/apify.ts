import { ApifyClient } from 'apify-client';
import { ApifyRunInput, Woning } from '@/types';

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

const ACTOR_ID = process.env.APIFY_ACTOR_ID || 'dtrungtin/funda-scraper';

export async function runWoningScraper(input: ApifyRunInput): Promise<Woning[]> {
  try {
    const actorInput = {
      location: input.location,
      propertyType: input.propertyType,
      minPrice: input.minPrice || undefined,
      maxPrice: input.maxPrice || undefined,
      minRooms: input.minRooms || undefined,
      propertyCategory: mapHouseType(input.houseType),
      maxItems: 50,
    };

    console.log('Starting Apify actor with input:', actorInput);

    const run = await client.actor(ACTOR_ID).call(actorInput, {
      waitSecs: 120,
    });

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log(`Received ${items.length} results from Apify`);

    return items.map(mapToWoning);
  } catch (error) {
    console.error('Error running Apify scraper:', error);
    throw error;
  }
}

function mapHouseType(houseType?: string): string | undefined {
  if (!houseType) return undefined;
  const mapping: Record<string, string> = {
    'appartement': 'apartment',
    'rijtjeshuis': 'terraced_house',
    'vrijstaand': 'detached',
    'twee-onder-een-kap': 'semi_detached',
    'penthouse': 'penthouse',
    'studio': 'studio',
  };
  return mapping[houseType] || undefined;
}

function mapToWoning(item: Record<string, unknown>): Woning {
  return {
    id: String(item.id || item.url || Math.random()),
    titel: String(item.title || item.naam || 'Woning'),
    adres: String(item.address || item.adres || ''),
    postcode: String(item.postalCode || item.postcode || ''),
    plaats: String(item.city || item.plaats || ''),
    prijs: parsePrice(item.price || item.prijs),
    kamers: parseInt(String(item.rooms || item.kamers)) || 0,
    oppervlakte: parseInt(String(item.area || item.oppervlakte)) || 0,
    foto: String(item.image || item.foto || (Array.isArray(item.images) ? item.images[0] : '') || '/placeholder.jpg'),
    fotos: Array.isArray(item.images) ? item.images as string[] : (Array.isArray(item.fotos) ? item.fotos as string[] : []),
    type: String(item.propertyType || item.type || 'Woning'),
    url: String(item.url || '#'),
    makelaar: item.realtor ? String(item.realtor) : (item.makelaar ? String(item.makelaar) : undefined),
    beschrijving: item.description ? String(item.description) : (item.beschrijving ? String(item.beschrijving) : undefined),
    bouwjaar: item.yearBuilt ? Number(item.yearBuilt) : (item.bouwjaar ? Number(item.bouwjaar) : undefined),
    energielabel: item.energyLabel ? String(item.energyLabel) : (item.energielabel ? String(item.energielabel) : undefined),
  };
}

function parsePrice(price: unknown): number {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    return parseInt(price.replace(/[^0-9]/g, '')) || 0;
  }
  return 0;
}
