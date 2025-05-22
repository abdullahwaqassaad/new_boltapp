export interface Patient {
  id: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  symptoms: string[];
  temperature: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  weight: number;
  height: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  diagnosis?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  dateReported: string;
  imageUrl?: string;
  notes?: string;
  isPregnant?: boolean;
  immunizationStatus?: 'none' | 'partial' | 'full';
  riskScore?: number;
  aiDiagnosis?: string;
  aiConfidence?: number;
  referralRecommended?: boolean;
  followUpDate?: string;
}

export interface Diagnosis {
  condition: string;
  symptoms: string[];
  riskFactors: string[];
  emergencySymptoms: string[];
  recommendedTests: string[];
  baseRiskScore: number;
}

export interface DiagnosticResult {
  patientId: string;
  originalDiagnosis?: string;
  aiDiagnosis: string;
  confidence: number;
  riskScore: number;
  needsReferral: boolean;
  diagnosisTime: number; // in milliseconds
  isCorrect?: boolean;
}

export interface StatisticsData {
  totalCases: number;
  highRiskCases: number;
  detectionSpeed: number; // in hours
  accuracyRate: number; // percentage
  referralReduction: number; // percentage
  geographicClusters: {
    location: string;
    count: number;
    severeCases: number;
  }[];
  conditionBreakdown: {
    condition: string;
    count: number;
    accuratelyDiagnosed: number;
  }[];
  timelineData: {
    date: string;
    cases: number;
    accuratelyDiagnosed: number;
  }[];
}