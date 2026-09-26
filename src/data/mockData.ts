export type SensorReading = {
  timestamp: string;
  stationId: string;
  ec: number;        // Electrical Conductivity (µS/cm)
  tds: number;       // Total Dissolved Solids (mg/L / ppm)
  ph: number;        // pH level
  temperature: number; // Celsius
  waterLevel: number;  // Meters
};

export type ComplaintStatus = 'Submitted' | 'Under Investigation' | 'Action Taken' | 'Resolved';

export type Complaint = {
  id: string; // added id for iteration
  userId: string;
  category: string;
  description: string;
  photo: string | null;
  location: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
};

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type Prediction = {
  stationId: string;
  timestamp: string;
  riskProbability: number; // 0.0 to 1.0
  riskLevel: RiskLevel;
  predictionHorizon: string; // e.g., '24h', '48h', '7 days'
};

export type Station = {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

// --- Mock Data Instances ---

export const mockStations: Station[] = [
  {
    id: 'ST-001',
    name: 'Vembanad Lake Inlet (North)',
    location: 'North Cherthala',
    coordinates: { lat: 9.6833, lng: 76.3333 }
  },
  {
    id: 'ST-002',
    name: 'Kuttanad Boundary Canal',
    location: 'South Cherthala',
    coordinates: { lat: 9.6100, lng: 76.3500 }
  },
  {
    id: 'ST-003',
    name: 'Arookutty Coastal Point',
    location: 'Arookutty',
    coordinates: { lat: 9.8167, lng: 76.3167 }
  }
];

export const mockCurrentReadings: Record<string, SensorReading> = {
  'ST-001': {
    timestamp: new Date().toISOString(),
    stationId: 'ST-001',
    ec: 1450.5,
    tds: 940,
    ph: 7.2,
    temperature: 28.5,
    waterLevel: 2.1
  },
  'ST-002': {
    timestamp: new Date().toISOString(),
    stationId: 'ST-002',
    ec: 820.2,
    tds: 530,
    ph: 7.0,
    temperature: 27.8,
    waterLevel: 1.8
  },
  'ST-003': {
    timestamp: new Date().toISOString(),
    stationId: 'ST-003',
    ec: 2800.0,
    tds: 1820,
    ph: 7.5,
    temperature: 29.1,
    waterLevel: 3.0
  }
};

export const mockPredictions: Prediction[] = [
  {
    stationId: 'ST-001',
    timestamp: new Date().toISOString(),
    riskProbability: 0.35,
    riskLevel: 'Moderate',
    predictionHorizon: '24h'
  },
  {
    stationId: 'ST-002',
    timestamp: new Date().toISOString(),
    riskProbability: 0.12,
    riskLevel: 'Low',
    predictionHorizon: '48h'
  },
  {
    stationId: 'ST-003',
    timestamp: new Date().toISOString(),
    riskProbability: 0.85,
    riskLevel: 'Critical',
    predictionHorizon: '24h'
  }
];

export const mockComplaints: Complaint[] = [
  {
    id: 'CMP-2023-001',
    userId: 'U-001',
    category: 'Saline Intrusion',
    description: 'Drinking water wells in my area have suddenly turned very salty over the last two days.',
    photo: null,
    location: 'Arookutty Panchayat, Ward 4',
    status: 'Under Investigation',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'CMP-2023-002',
    userId: 'U-001',
    category: 'Water Quality',
    description: 'Tap water has a yellowish tint.',
    photo: null,
    location: 'Cherthala Town',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];
