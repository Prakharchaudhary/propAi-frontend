// ─── Property Types ──────────────────────────────────────────────────────────

export interface Property {
  id: string;
  slug: string;
  title: string;
  description?: string;
  locality: string;
  city: string;
  state?: string;
  pincode?: string;
  price: string;
  priceNumeric?: number;
  pricePerSqft?: string;
  listingType: 'Sale' | 'Rent' | 'Lease';
  configuration: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  carpetArea?: number;
  isFeatured: boolean;
  isVerified: boolean;
  isReraRegistered?: boolean;
  reraNumber?: string;
  aiMatch?: number;
  badge?: string;
  images: { url: string; publicId?: string; isPrimary?: boolean; _id?: string }[];
  _id?: string;        // MongoDB id
   priceLabel?: string;
  amenities?: string[];
  floorNumber?: number;
  totalFloors?: number;
  facing?: string;
  possession?: string;
  builderName?: string;
  projectName?: string;
  status: 'Active' | 'Sold' | 'Rented' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

// ─── Lead Types ───────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyId?: string;
  propertyTitle?: string;
  city?: string;
  source: 'Website' | 'WhatsApp' | 'Chat' | 'Call' | 'Admin';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  aiScore?: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Chat Types ───────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  leadCapture?: Partial<Lead>;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface PropertyFilters {
  city?: string;
  listingType?: string;
  configuration?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  badge?: string;
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'ai_match';
}

// ─── Admin / Dashboard Types ──────────────────────────────────────────────────

export interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  totalLeads: number;
  newLeadsToday: number;
  conversionRate: number;
  monthlyRevenue: number;
  aiSearches: number;
  whatsappClicks: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

// ─── Enquiry Form ─────────────────────────────────────────────────────────────

export interface EnquiryFormData {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyId?: string;
  callbackTime?: string;
}
