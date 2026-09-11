export interface Craft {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  district: string;
  village: string;
  category: 'textile' | 'pottery' | 'painting' | 'jewelry' | 'woodcraft' | 'metalcraft' | 'leather' | 'stone' | 'other';
  image: string;
  gallery: string[];
  history: string;
  makingProcess: string;
  materials: string[];
  giStatus: boolean;
  giNumber?: string;
  verifiedGiYear?: number;
  priceRange: string;
  whereToBuy: string[];
  originalVsImitation: string;
  artisanId?: string;
  nearbyPlaces: string[];
  relatedFood: string[];
  relatedFestival: string[];
  similarTraditions: string[];
  coordinates?: { lat: number; lng: number };
  tags?: string[];
}

export interface Artisan {
  id: string;
  name: string;
  village: string;
  stateId: string;
  stateName: string;
  craft: string;
  craftId: string;
  image: string;
  familyHistory: string;
  learningStory: string;
  yearsOfExperience: number;
  awards: string[];
  products: string[];
  contact: string;
  whatsapp?: string;
  socialLink?: string;
  coordinates?: { lat: number; lng: number };
}

export interface StateData {
  id: string;
  name: string;
  capital: string;
  region: 'north' | 'south' | 'east' | 'west' | 'central' | 'northeast';
  color: string;
  image: string;
  tagline: string;
  description: string;
  crafts: string[];
  dances: string[];
  festivals: string[];
  foods: string[];
  heritageSites: string[];
  funFact: string;
  coordinates?: { lat: number; lng: number };
  musicInstruments?: string[];
  unescoSites?: string[];
}

export interface VideoReel {
  id: string;
  title: string;
  topic: string;
  stateId: string;
  stateName: string;
  thumbnail: string;
  videoUrl?: string;
  duration: string;
  description: string;
  category: 'craft' | 'festival' | 'dance' | 'food' | 'history';
  author?: string;
  likes?: number;
  craftId?: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  image: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  color: string;
}

export interface FoodItem {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  image: string;
  description: string;
  ingredients: string[];
  occasion: string;
}

export interface Festival {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  image: string;
  description: string;
  month: string;
  significance: string;
}

export interface DanceForm {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  image: string;
  description: string;
  type: string;
}

export interface UnescoSite {
  id: string;
  name: string;
  stateId: string;
  stateName: string;
  yearInscribed: number;
  category: 'cultural' | 'natural' | 'mixed';
  image: string;
  description: string;
  architecturalStyle: string;
  historicalSignificance: string;
  coordinates: { lat: number; lng: number };
}

export interface MusicalTradition {
  id: string;
  name: string;
  type: 'vocal' | 'instrument' | 'folk-tradition';
  stateId: string;
  stateName: string;
  image: string;
  description: string;
  instrumentsUsed: string[];
  significance: string;
}

export interface StudentInnovationIdea {
  id: string;
  title: string;
  tagline: string;
  domain: 'ai-vision' | 'digital-preservation' | 'blockchain-gi' | 'artisan-fairtrade' | 'gamified-learning';
  problemSolved: string;
  solutionOverview: string;
  technologiesUsed: string[];
  impactMetric: string;
  iconName: string;
}
