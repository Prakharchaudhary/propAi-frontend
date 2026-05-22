import apiClient from './api-client';
import type {
  Property,
  Lead,
  PropertyFilters,
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
  EnquiryFormData,
  ChartDataPoint,
} from './types';

// ─── Mock data (replace with real API calls once Postman collections arrive) ──

const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    slug: 'luxuria-heights-gurgaon',
    title: 'Luxuria Heights — 3BHK',
    description: 'Premium 3BHK apartment in the heart of DLF Phase 4, Gurgaon. Features world-class amenities, 24/7 security, club house, swimming pool, and landscaped gardens. Easy metro connectivity.',
    locality: 'DLF Phase 4',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122009',
    price: '1.65 Cr',
    priceNumeric: 16500000,
    pricePerSqft: '₹8,967/sqft',
    listingType: 'Sale',
    configuration: '3 BHK',
    bedrooms: 3,
    bathrooms: 2,
    area: 1840,
    carpetArea: 1450,
    isFeatured: true,
    isVerified: true,
    isReraRegistered: true,
    reraNumber: 'RERA/GGN/2023/001234',
    aiMatch: 97,
    badge: 'New Launch',
    images: ['/images/prop1.jpg', '/images/prop2.jpg', '/images/prop3.jpg'],
    amenities: ['Swimming Pool', 'Club House', 'Gym', '24/7 Security', 'Power Backup', 'Parking', 'Garden', 'Kids Play Area'],
    floorNumber: 12,
    totalFloors: 24,
    facing: 'East',
    possession: 'Ready to Move',
    builderName: 'DLF Limited',
    projectName: 'Luxuria Heights',
    status: 'Active',
    createdAt: '2025-01-15T10:30:00Z',
  },
  {
    id: 'prop-2',
    slug: 'serene-villa-whitefield',
    title: 'Serene Villa — 4BHK',
    description: 'Standalone 4BHK luxury villa in Whitefield\'s premium residential enclave. Expansive garden, private pool, and smart home automation. Perfect for families seeking premium suburban living.',
    locality: 'Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560066',
    price: '2.40 Cr',
    priceNumeric: 24000000,
    pricePerSqft: '₹8,571/sqft',
    listingType: 'Sale',
    configuration: '4 BHK',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    carpetArea: 2200,
    isFeatured: true,
    isVerified: true,
    isReraRegistered: true,
    reraNumber: 'RERA/KAR/2024/005678',
    aiMatch: 92,
    badge: 'Premium',
    images: ['/images/prop2.jpg', '/images/prop1.jpg', '/images/prop4.jpg'],
    amenities: ['Private Pool', 'Garden', 'Smart Home', 'Home Theatre', '4 Car Parking', 'Solar Power', 'Servant Quarter'],
    floorNumber: 1,
    totalFloors: 2,
    facing: 'North',
    possession: 'Ready to Move',
    builderName: 'Brigade Group',
    projectName: 'Serene Estates',
    status: 'Active',
    createdAt: '2025-01-20T11:00:00Z',
  },
  {
    id: 'prop-3',
    slug: 'skyview-bandra-2bhk',
    title: 'SkyView Sea-Facing 2BHK',
    description: 'Breathtaking sea-facing 2BHK in the most coveted address in Mumbai — Bandra West. Floor-to-ceiling windows, premium Italian marble flooring, and a spectacular view of the Arabian Sea.',
    locality: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    price: '1.85 Cr',
    priceNumeric: 18500000,
    pricePerSqft: '₹16,818/sqft',
    listingType: 'Sale',
    configuration: '2 BHK',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    carpetArea: 870,
    isFeatured: true,
    isVerified: false,
    isReraRegistered: true,
    reraNumber: 'RERA/MH/2024/003456',
    aiMatch: 88,
    badge: 'Hot Deal',
    images: ['/images/prop3.jpg', '/images/prop1.jpg', '/images/prop2.jpg'],
    amenities: ['Sea View', 'Concierge', 'Gym', 'Rooftop Lounge', 'Valet Parking', 'Business Centre'],
    floorNumber: 18,
    totalFloors: 22,
    facing: 'West',
    possession: 'Ready to Move',
    builderName: 'Rustomjee Developers',
    projectName: 'SkyView Heights',
    status: 'Active',
    createdAt: '2025-02-01T09:15:00Z',
  },
  {
    id: 'prop-4',
    slug: 'greenfield-noida-2bhk',
    title: 'Greenfield Township 2BHK',
    description: 'Affordable yet premium 2BHK in Noida\'s most sought-after sector. Greenfield Township offers excellent connectivity to Delhi, expressways, and metro. Great investment opportunity.',
    locality: 'Sector 137',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201305',
    price: '78 L',
    priceNumeric: 7800000,
    pricePerSqft: '₹7,428/sqft',
    listingType: 'Sale',
    configuration: '2 BHK',
    bedrooms: 2,
    bathrooms: 2,
    area: 1050,
    carpetArea: 820,
    isFeatured: false,
    isVerified: true,
    isReraRegistered: true,
    reraNumber: 'RERA/UP/2023/007890',
    aiMatch: 84,
    badge: 'Ready to Move',
    images: ['/images/prop4.jpg', '/images/prop3.jpg', '/images/prop1.jpg'],
    amenities: ['Swimming Pool', 'Gym', 'Kids Play Area', 'Jogging Track', '24/7 Security', 'Parking'],
    floorNumber: 5,
    totalFloors: 18,
    facing: 'South',
    possession: 'Ready to Move',
    builderName: 'Supertech Limited',
    projectName: 'Greenfield Township',
    status: 'Active',
    createdAt: '2025-02-10T14:30:00Z',
  },
  {
    id: 'prop-5',
    slug: 'emerald-park-pune-3bhk',
    title: 'Emerald Park 3BHK',
    description: 'Elegant 3BHK in Pune\'s thriving Baner locality. Close to Hinjawadi IT Park, offering excellent ROI for investors. Modern amenities including rooftop infinity pool.',
    locality: 'Baner',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    price: '95 L',
    priceNumeric: 9500000,
    pricePerSqft: '₹7,115/sqft',
    listingType: 'Sale',
    configuration: '3 BHK',
    bedrooms: 3,
    bathrooms: 2,
    area: 1335,
    carpetArea: 1050,
    isFeatured: false,
    isVerified: true,
    isReraRegistered: true,
    reraNumber: 'RERA/MH/2024/009012',
    aiMatch: 81,
    badge: 'Good Investment',
    images: ['/images/prop1.jpg', '/images/prop4.jpg'],
    amenities: ['Infinity Pool', 'Gym', 'Co-working Space', 'Café', 'EV Charging', 'Yoga Deck'],
    floorNumber: 8,
    totalFloors: 14,
    facing: 'East',
    possession: 'Dec 2025',
    builderName: 'Godrej Properties',
    projectName: 'Emerald Park',
    status: 'Active',
    createdAt: '2025-03-05T10:00:00Z',
  },
  {
    id: 'prop-6',
    slug: 'hyderabad-hitech-2bhk',
    title: 'HiTech City Residences 2BHK',
    description: 'Strategically located 2BHK steps away from HiTech City — Hyderabad\'s IT hub. Modern design, excellent connectivity, and high rental yield make this a top investment choice.',
    locality: 'HiTech City',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    price: '72 L',
    priceNumeric: 7200000,
    pricePerSqft: '₹6,545/sqft',
    listingType: 'Sale',
    configuration: '2 BHK',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    carpetArea: 865,
    isFeatured: false,
    isVerified: true,
    isReraRegistered: true,
    reraNumber: 'RERA/TS/2024/004321',
    aiMatch: 79,
    badge: 'High Yield',
    images: ['/images/prop2.jpg', '/images/prop3.jpg'],
    amenities: ['Swimming Pool', 'Gym', 'Amphitheatre', 'Supermarket', 'Clinic', 'School'],
    floorNumber: 3,
    totalFloors: 20,
    facing: 'North',
    possession: 'Ready to Move',
    builderName: 'My Home Group',
    projectName: 'HiTech Residences',
    status: 'Active',
    createdAt: '2025-03-12T16:00:00Z',
  },
];

const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Rahul Sharma', phone: '+91 98765 43210', email: 'rahul@email.com', message: 'Looking for 3BHK in Gurgaon', propertyId: 'prop-1', propertyTitle: 'Luxuria Heights', city: 'Gurgaon', source: 'Website', status: 'New', aiScore: 88, createdAt: '2025-05-14T09:00:00Z' },
  { id: 'l2', name: 'Priya Mehta', phone: '+91 87654 32109', email: 'priya@email.com', message: 'Interested in Mumbai flat, need callback', source: 'WhatsApp', status: 'Contacted', aiScore: 72, createdAt: '2025-05-14T10:30:00Z' },
  { id: 'l3', name: 'Amit Kumar', phone: '+91 76543 21098', city: 'Bangalore', source: 'Chat', status: 'Qualified', aiScore: 95, createdAt: '2025-05-13T14:00:00Z' },
  { id: 'l4', name: 'Sunita Verma', phone: '+91 65432 10987', email: 'sunita@email.com', message: 'Villa in Whitefield', propertyId: 'prop-2', propertyTitle: 'Serene Villa', city: 'Bangalore', source: 'Website', status: 'Converted', aiScore: 90, createdAt: '2025-05-12T11:00:00Z' },
  { id: 'l5', name: 'Vikram Singh', phone: '+91 54321 09876', city: 'Noida', source: 'Call', status: 'New', aiScore: 65, createdAt: '2025-05-14T08:00:00Z' },
  { id: 'l6', name: 'Neha Gupta', phone: '+91 43210 98765', email: 'neha@email.com', source: 'Chat', status: 'Lost', aiScore: 40, createdAt: '2025-05-11T15:00:00Z' },
];

// ─── Property Service ─────────────────────────────────────────────────────────

export const propertyService = {
  async getAll(filters?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    const res = await apiClient.get('/properties', { params: filters });
    const raw = res.data;
    const data = Array.isArray(raw) ? raw : raw.data ?? [];
    return {
      success: true,
      data,
      total: data.length,
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 12,
      totalPages: Math.ceil(data.length / (filters?.limit ?? 12)),
    };
  },

  async getBySlug(slug: string): Promise<ApiResponse<Property>> {
    const res = await apiClient.get(`/properties/${slug}`);
    const raw = res.data;
    const data = raw.data ?? raw;
    return { success: true, data };
  },

  async getSimilar(id: string, limit = 3): Promise<ApiResponse<Property[]>> {
    return apiClient.get(`/properties/similar/${id}`, { params: { limit } }).then(r => r.data);
  },

  async create(data: Partial<Property>): Promise<ApiResponse<Property>> {
    return apiClient.post('/properties', data).then(r => r.data);
  },

  async update(id: string, data: Partial<Property>): Promise<ApiResponse<Property>> {
    return apiClient.put(`/properties/${id}`, data).then(r => r.data);
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/properties/${id}`).then(r => r.data);
  },

  async getConfigurations(): Promise<ApiResponse<{ configuration: string; count: number }[]>> {
    const res = await apiClient.get('/properties', { params: { limit: 1000 } });
    const raw = res.data;
    const data: Property[] = Array.isArray(raw) ? raw : raw.data ?? [];
    const countMap: Record<string, number> = {};
    data.forEach((p) => {
      if (p.configuration) countMap[p.configuration] = (countMap[p.configuration] || 0) + 1;
    });
    const result = Object.entries(countMap)
      .map(([configuration, count]) => ({ configuration, count }))
      .sort((a, b) => b.count - a.count);
    return { success: true, data: result };
  },

  async getCities(): Promise<ApiResponse<{ city: string; count: number }[]>> {
    const res = await apiClient.get('/properties', { params: { limit: 1000 } });
    const raw = res.data;
    const data: Property[] = Array.isArray(raw) ? raw : raw.data ?? [];
    const countMap: Record<string, number> = {};
    data.forEach((p) => {
      if (p.city) countMap[p.city] = (countMap[p.city] || 0) + 1;
    });
    const result = Object.entries(countMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);
    return { success: true, data: result };
  },
};

// ─── Lead Service ─────────────────────────────────────────────────────────────

export const leadService = {
  async getAll(): Promise<PaginatedResponse<Lead>> {
    // return apiClient.get('/leads').then(r => r.data);
    return { success: true, data: MOCK_LEADS, total: MOCK_LEADS.length, page: 1, limit: 50, totalPages: 1 };
  },

  async submitEnquiry(data: EnquiryFormData): Promise<ApiResponse<Lead>> {
  return apiClient.post('/leads', data).then(r => r.data);
},

  async updateStatus(id: string, status: Lead['status']): Promise<ApiResponse<Lead>> {
    // return apiClient.patch(`/leads/${id}`, { status }).then(r => r.data);
    return { success: true, data: { id, status } as Lead };
  },
};

// ─── Dashboard Service ────────────────────────────────────────────────────────

export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    // return apiClient.get('/admin/stats').then(r => r.data);
    return {
      success: true,
      data: {
        totalProperties: 248,
        activeListings: 186,
        totalLeads: 1240,
        newLeadsToday: 34,
        conversionRate: 18.5,
        monthlyRevenue: 2840000,
        aiSearches: 18420,
        whatsappClicks: 3210,
      },
    };
  },

  async getLeadTrend(): Promise<ApiResponse<ChartDataPoint[]>> {
    // return apiClient.get('/admin/stats/leads-trend').then(r => r.data);
    return {
      success: true,
      data: [
        { label: 'Jan', value: 82, secondary: 12 },
        { label: 'Feb', value: 95, secondary: 18 },
        { label: 'Mar', value: 110, secondary: 22 },
        { label: 'Apr', value: 98, secondary: 17 },
        { label: 'May', value: 134, secondary: 28 },
        { label: 'Jun', value: 128, secondary: 24 },
        { label: 'Jul', value: 156, secondary: 32 },
      ],
    };
  },

  async getPropertyCityBreakdown(): Promise<ApiResponse<ChartDataPoint[]>> {
    // return apiClient.get('/admin/stats/city-breakdown').then(r => r.data);
    return {
      success: true,
      data: [
        { label: 'Gurgaon', value: 48 },
        { label: 'Mumbai', value: 42 },
        { label: 'Bangalore', value: 38 },
        { label: 'Noida', value: 32 },
        { label: 'Hyderabad', value: 27 },
        { label: 'Pune', value: 19 },
      ],
    };
  },
};

// ─── AI / Chat Service ────────────────────────────────────────────────────────

export const aiService = {
  async chat(message: string, history: { role: string; content: string }[]): Promise<ApiResponse<{ reply: string }>> {
    // return apiClient.post('/ai/chat', { message, history }).then(r => r.data);
    // Placeholder local AI response
    const lower = message.toLowerCase();
    let reply = 'Main samajh gaya! Aapki requirements ke basis pe best properties dhundh raha hoon...';
    if (lower.includes('villa') || lower.includes('independent')) reply = 'Villa ke liye Bangalore (Whitefield, Sarjapur) ya Pune (Baner) best hain. Budget kya hai?';
    else if (lower.includes('2bhk') || lower.includes('2 bhk')) reply = 'Great choice! Kaunsa city prefer karoge — Mumbai, Noida, ya Bangalore?';
    else if (lower.includes('3bhk') || lower.includes('3 bhk')) reply = 'Gurgaon mein 3BHK ke liye ₹1.2Cr–₹2Cr range perfect hai. Kab possession chahiye?';
    else if (lower.includes('noida')) reply = 'Noida Sector 137 aur 150 mein kaafi options hain. ₹75L–₹1Cr range mein 2BHK milenge.';
    else if (lower.includes('mumbai')) reply = 'Mumbai mein Bandra, Powai, aur Thane best value dete hain. Kaunsa area prefer?';
    else if (lower.includes('bangalore') || lower.includes('bengaluru')) reply = 'Whitefield aur Sarjapur Road pe best properties hain. IT hub ke paas connectivity bhi great hai.';
    return { success: true, data: { reply } };
  },

  async voiceToText(audioBlob: Blob): Promise<ApiResponse<{ transcript: string }>> {
    // const formData = new FormData();
    // formData.append('audio', audioBlob);
    // return apiClient.post('/ai/voice-to-text', formData).then(r => r.data);
    return { success: true, data: { transcript: '' } };
  },
};

// Sabse neeche add karo
export const localityService = {
  async getNearby(lat: number, lng: number): Promise<any> {
    return apiClient
      .get('/locality/nearby', { params: { lat, lng } })
      .then((r) => r.data);
  },
};