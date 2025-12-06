import { LucideIcon } from 'lucide-react';

export interface SearchFilters {
  locatie: string;
  type: 'koop' | 'huur';
  minPrijs: string;
  maxPrijs: string;
  kamers: string;
  woningType: WoningType | '';
}

export type WoningType =
  | 'appartement'
  | 'rijtjeshuis'
  | 'vrijstaand'
  | 'twee-onder-een-kap'
  | 'penthouse'
  | 'studio';

export interface WoningTypeOption {
  id: WoningType;
  label: string;
  icon: LucideIcon;
}

export interface Woning {
  id: string;
  titel: string;
  adres: string;
  postcode: string;
  plaats: string;
  prijs: number;
  kamers: number;
  oppervlakte: number;
  foto: string;
  fotos?: string[];
  type: string;
  url: string;
  makelaar?: string;
  beschrijving?: string;
  bouwjaar?: number;
  energielabel?: string;
}

export interface SearchResponse {
  success: boolean;
  data?: Woning[];
  error?: string;
  totalResults?: number;
}

export interface ApifyRunInput {
  location: string;
  propertyType: 'koop' | 'huur';
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  houseType?: string;
}
