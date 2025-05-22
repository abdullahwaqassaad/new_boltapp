import axios from 'axios';
import { Patient, DiagnosticResult } from '../types';

/**
 * Fetch data from the provided URL
 */
export async function fetchDataset(): Promise<any> {
  try {
    const response = await axios.get('https://anadeem.wordpress.com/data/p2');
    return response.data;
  } catch (error) {
    console.error('Error fetching dataset:', error);
    throw new Error('Failed to fetch the dataset');
  }
}

/**
 * Generate synthetic health data based on epidemiological assumptions for Pakistan
 */
export function generateSyntheticData(count: number = 100): Patient[] {
  const locations = [
    'Swat', 'Mingora', 'Lahore', 'Karachi', 'Islamabad', 
    'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Rawalpindi'
  ];
  
  const commonSymptoms = [
    'fever', 'headache', 'fatigue', 'cough', 'diarrhea', 
    'vomiting', 'abdominal pain', 'rash', 'joint pain', 'shortness of breath',
    'chest pain', 'dizziness', 'weakness', 'loss of appetite', 'chills'
  ];
  
  const dengueSymptoms = ['fever', 'headache', 'rash', 'joint pain', 'muscle pain', 'eye pain'];
  const tbSymptoms = ['cough', 'weight loss', 'night sweats', 'fatigue', 'fever', 'chest pain'];
  const diarrheaSymptoms = ['diarrhea', 'abdominal pain', 'dehydration', 'nausea', 'vomiting'];
  const ari = ['cough', 'difficulty breathing', 'fever', 'chest pain', 'shortness of breath'];
  const obstetricSymptoms = ['weakness', 'body aches', 'abdominal pain', 'headache', 'vomiting', 'shortness of breath', 'fever'];
  
  // Generate patients according to epidemiological assumptions
  const patients: Patient[] = [];
  
  const startDate = new Date('2024-05-01');
  const endDate = new Date('2024-06-30');
  
  for (let i = 0; i < count; i++) {
    const random = Math.random();
    let patient: Patient = {
      id: `PAT-${i.toString().padStart(5, '0')}`,
      age: Math.floor(Math.random() * 90) + 1,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      location: locations[Math.floor(Math.random() * locations.length)],
      symptoms: [],
      temperature: 36.5 + Math.random() * 3, // 36.5 - 39.5
      bloodPressure: {
        systolic: 90 + Math.floor(Math.random() * 60), // 90-150
        diastolic: 60 + Math.floor(Math.random() * 40), // 60-100
      },
      weight: 30 + Math.random() * 70, // 30-100 kg
      height: 100 + Math.random() * 100, // 100-200 cm
      respiratoryRate: 12 + Math.floor(Math.random() * 18), // 12-30
      oxygenSaturation: 90 + Math.random() * 10, // 90-100%
      dateReported: new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      ).toISOString().split('T')[0]
    };
    
    // Assign random symptoms
    const symptomCount = 3 + Math.floor(Math.random() * 4); // 3-6 symptoms
    
    // Dengue assumption - 25% present with fever during monsoon
    if (random < 0.25) {
      patient.symptoms = dengueSymptoms.slice(0, symptomCount);
      patient.diagnosis = 'Suspected Dengue';
      patient.temperature = 38 + Math.random() * 2; // 38-40°C
      patient.severity = random < 0.08 ? 'critical' : (random < 0.15 ? 'high' : 'medium');
      patient.imageUrl = 'https://www.cdc.gov/dengue/images/symptoms/dengue-rash-min.jpg';
    } 
    // TB assumption - 259 per 100,000
    else if (random < 0.25 + 0.00259) {
      patient.symptoms = tbSymptoms.slice(0, symptomCount);
      patient.diagnosis = 'Suspected Tuberculosis';
      patient.severity = random < 0.28 ? 'high' : 'medium';
      patient.imageUrl = 'https://www.cdc.gov/tb/publications/factsheets/images/tb-bacteria.jpg';
    }
    // Diarrheal disease in under-5s - 39%
    else if (patient.age < 5 && random < 0.52) {
      patient.symptoms = diarrheaSymptoms.slice(0, symptomCount);
      patient.diagnosis = 'Acute Diarrheal Disease';
      patient.severity = random < 0.3 ? 'high' : 'medium';
      patient.imageUrl = 'https://www.who.int/images/default-source/imported/dehydration-child.jpg';
    }
    // Acute respiratory infection in under-5s - 75% two-week prevalence in Punjab
    else if (patient.age < 5 && random < 0.95) {
      patient.symptoms = ari.slice(0, symptomCount);
      patient.diagnosis = 'Acute Respiratory Infection';
      patient.severity = random < 0.25 ? 'high' : 'medium';
      patient.imageUrl = 'https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2013/11/15/17/35/ds00967_-ds00312_-ds00574_im00343_r7_bronchitisjpgt_jpeg.jpg';
    }
    // Obstetric complications - 10% of pregnancies
    else if (patient.gender === 'female' && patient.age >= 15 && patient.age <= 45 && random < 0.97) {
      patient.symptoms = obstetricSymptoms.slice(0, symptomCount);
      patient.diagnosis = 'Obstetric Complication';
      patient.isPregnant = true;
      patient.severity = random < 0.4 ? 'high' : 'medium';
      patient.imageUrl = 'https://www.who.int/images/default-source/departments/reproductive-health/maternal-health.jpg';
    }
    // Hypertension in adults - 37.3%
    else if (patient.age >= 18 && random < 0.985) {
      patient.symptoms = ['headache', 'dizziness', 'blurred vision'].slice(0, Math.min(3, symptomCount));
      patient.bloodPressure.systolic = 140 + Math.floor(Math.random() * 40); // 140-180
      patient.bloodPressure.diastolic = 90 + Math.floor(Math.random() * 20); // 90-110
      patient.diagnosis = 'Hypertension';
      patient.severity = random < 0.3 ? 'high' : 'medium';
      patient.imageUrl = 'https://www.cdc.gov/bloodpressure/images/measuring-blood-pressure.jpg';
    }
    // Diabetes in adults - 31.4%
    else {
      patient.symptoms = ['excessive thirst', 'frequent urination', 'fatigue', 'blurred vision'].slice(0, symptomCount);
      patient.diagnosis = 'Suspected Diabetes';
      patient.severity = 'medium';
      patient.imageUrl = 'https://www.niddk.nih.gov/sites/default/files/styles/4_3_aspect_ratio/public/2018-07/1_h0DBY9FD8uelYYkmS22QeQ.jpeg';
    }
    
    // Assign immunization status to children
    if (patient.age < 5) {
      const immunizationRandom = Math.random();
      if (immunizationRandom < 0.66) {
        patient.immunizationStatus = 'full';
      } else if (immunizationRandom < 0.85) {
        patient.immunizationStatus = 'partial';
      } else {
        patient.immunizationStatus = 'none';
      }
    }
    
    // Add random notes
    if (Math.random() > 0.7) {
      patient.notes = "Patient reports symptoms started " + Math.floor(Math.random() * 14 + 1) + " days ago.";
    }
    
    patients.push(patient);
  }
  
  return patients;
}

/**
 * Simulate AI diagnosis for a single patient
 */
export function simulateAIDiagnosis(patient: Patient): DiagnosticResult {
  // Diagnostic accuracy simulation
  const accuracyMap: Record<string, number> = {
    'Suspected Dengue': 0.92,
    'Suspected Tuberculosis': 0.88,
    'Acute Diarrheal Disease': 0.94,
    'Acute Respiratory Infection': 0.91,
    'Obstetric Complication': 0.86,
    'Hypertension': 0.95,
    'Suspected Diabetes': 0.93
  };
  
  const baseAccuracy = patient.diagnosis ? accuracyMap[patient.diagnosis] || 0.85 : 0.85;
  
  // Add noise to make it realistic
  const accuracy = Math.min(0.99, Math.max(0.7, baseAccuracy + (Math.random() * 0.1 - 0.05)));
  
  // Calculate diagnosis time (faster than human)
  const diagnosisTime = Math.floor(Math.random() * 400) + 100; // 100-500ms
  
  // Determine if AI diagnosis is correct
  const isCorrect = Math.random() < accuracy;
  
  // If correct, use the same diagnosis, otherwise select a different one
  let aiDiagnosis = patient.diagnosis || '';
  if (!isCorrect && patient.diagnosis) {
    const possibleDiagnoses = [
      'Suspected Dengue', 'Suspected Tuberculosis', 'Acute Diarrheal Disease',
      'Acute Respiratory Infection', 'Obstetric Complication', 'Hypertension', 'Suspected Diabetes'
    ].filter(d => d !== patient.diagnosis);
    aiDiagnosis = possibleDiagnoses[Math.floor(Math.random() * possibleDiagnoses.length)];
  }
  
  // Calculate risk score
  let riskScore = 0;
  
  // Base risk from severity
  if (patient.severity === 'critical') riskScore += 80;
  else if (patient.severity === 'high') riskScore += 60;
  else if (patient.severity === 'medium') riskScore += 40;
  else riskScore += 20;
  
  // Adjust risk score based on age (children and elderly higher risk)
  if (patient.age < 5 || patient.age > 65) riskScore += 15;
  
  // Adjust for fever
  if (patient.temperature > 38.5) riskScore += 10;
  
  // Adjust for blood pressure
  if (patient.bloodPressure.systolic > 160 || patient.bloodPressure.systolic < 90) riskScore += 10;
  
  // Adjust for oxygen saturation
  if (patient.oxygenSaturation < 94) riskScore += 15;
  
  // Adjust for respiratory rate
  if (patient.respiratoryRate > 25) riskScore += 10;
  
  // Normalize to 0-100
  riskScore = Math.min(100, Math.max(0, riskScore));
  
  return {
    patientId: patient.id,
    originalDiagnosis: patient.diagnosis,
    aiDiagnosis,
    confidence: accuracy * 100,
    riskScore,
    needsReferral: riskScore > 70,
    diagnosisTime,
    isCorrect: isCorrect
  };
}

/**
 * Generate multiple AI diagnoses for a batch of patients
 */
export function generateAIDiagnoses(patients: Patient[]): DiagnosticResult[] {
  return patients.map(simulateAIDiagnosis);
}

/**
 * Generate traditional (non-AI) diagnoses for comparison
 */
export function generateTraditionalDiagnoses(patients: Patient[]): DiagnosticResult[] {
  return patients.map(patient => {
    // Traditional diagnosis takes longer and is less accurate, especially for complex cases
    const baseAccuracy = 0.65 + (Math.random() * 0.15);
    const isCorrect = Math.random() < baseAccuracy;
    
    let diagnosis = patient.diagnosis || '';
    if (!isCorrect && patient.diagnosis) {
      const possibleDiagnoses = [
        'Suspected Dengue', 'Suspected Tuberculosis', 'Acute Diarrheal Disease',
        'Acute Respiratory Infection', 'Obstetric Complication', 'Hypertension', 'Suspected Diabetes'
      ].filter(d => d !== patient.diagnosis);
      diagnosis = possibleDiagnoses[Math.floor(Math.random() * possibleDiagnoses.length)];
    }
    
    // Traditional diagnosis takes longer (in minutes, converted to ms)
    const diagnosisTime = (Math.floor(Math.random() * 20) + 10) * 60 * 1000;
    
    // Risk score is less precise
    let riskScore = 0;
    if (patient.severity === 'critical') riskScore = 80 + (Math.random() * 20 - 10);
    else if (patient.severity === 'high') riskScore = 60 + (Math.random() * 20 - 10);
    else if (patient.severity === 'medium') riskScore = 40 + (Math.random() * 20 - 10);
    else riskScore = 20 + (Math.random() * 20 - 10);
    
    riskScore = Math.min(100, Math.max(0, riskScore));
    
    return {
      patientId: patient.id,
      originalDiagnosis: patient.diagnosis,
      aiDiagnosis: diagnosis,
      confidence: baseAccuracy * 100,
      riskScore,
      needsReferral: riskScore > 75, // Traditional approach may miss some cases that need referral
      diagnosisTime,
      isCorrect
    };
  });
}

/**
 * Calculate statistics from diagnostic results
 */
export function calculateStatistics(
  patients: Patient[], 
  aiResults: DiagnosticResult[], 
  traditionalResults: DiagnosticResult[]
): StatisticsData {
  // Count total cases and high risk cases
  const totalCases = patients.length;
  const highRiskCases = patients.filter(p => p.severity === 'high' || p.severity === 'critical').length;
  
  // Calculate AI and traditional accuracy
  const aiAccuracy = aiResults.filter(r => r.isCorrect).length / aiResults.length;
  const traditionalAccuracy = traditionalResults.filter(r => r.isCorrect).length / traditionalResults.length;
  
  // Calculate detection speed (in hours)
  const aiDetectionSpeed = aiResults.reduce((sum, r) => sum + r.diagnosisTime, 0) / aiResults.length / 1000 / 60 / 60;
  const traditionalDetectionSpeed = traditionalResults.reduce((sum, r) => sum + r.diagnosisTime, 0) / traditionalResults.length / 1000 / 60 / 60;
  
  // Calculate referral reduction
  const aiReferrals = aiResults.filter(r => r.needsReferral).length;
  const traditionalReferrals = traditionalResults.filter(r => r.needsReferral).length;
  const referralReduction = (traditionalReferrals - aiReferrals) / traditionalReferrals * 100;
  
  // Calculate geographic clusters
  const locationCounts: Record<string, { count: number, severeCases: number }> = {};
  
  patients.forEach(patient => {
    if (!locationCounts[patient.location]) {
      locationCounts[patient.location] = { count: 0, severeCases: 0 };
    }
    
    locationCounts[patient.location].count++;
    
    if (patient.severity === 'high' || patient.severity === 'critical') {
      locationCounts[patient.location].severeCases++;
    }
  });
  
  const geographicClusters = Object.entries(locationCounts).map(([location, data]) => ({
    location,
    count: data.count,
    severeCases: data.severeCases
  }));
  
  // Calculate condition breakdown
  const conditionCounts: Record<string, { count: number, accuratelyDiagnosed: number }> = {};
  
  patients.forEach((patient, index) => {
    const diagnosis = patient.diagnosis || 'Unknown';
    
    if (!conditionCounts[diagnosis]) {
      conditionCounts[diagnosis] = { count: 0, accuratelyDiagnosed: 0 };
    }
    
    conditionCounts[diagnosis].count++;
    
    if (aiResults[index] && aiResults[index].isCorrect) {
      conditionCounts[diagnosis].accuratelyDiagnosed++;
    }
  });
  
  const conditionBreakdown = Object.entries(conditionCounts).map(([condition, data]) => ({
    condition,
    count: data.count,
    accuratelyDiagnosed: data.accuratelyDiagnosed
  }));
  
  // Calculate timeline data
  const dateMap: Record<string, { cases: number, accuratelyDiagnosed: number }> = {};
  
  patients.forEach((patient, index) => {
    const date = patient.dateReported;
    
    if (!dateMap[date]) {
      dateMap[date] = { cases: 0, accuratelyDiagnosed: 0 };
    }
    
    dateMap[date].cases++;
    
    if (aiResults[index] && aiResults[index].isCorrect) {
      dateMap[date].accuratelyDiagnosed++;
    }
  });
  
  const timelineData = Object.entries(dateMap)
    .map(([date, data]) => ({
      date,
      cases: data.cases,
      accuratelyDiagnosed: data.accuratelyDiagnosed
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return {
    totalCases,
    highRiskCases,
    detectionSpeed: aiDetectionSpeed,
    accuracyRate: aiAccuracy * 100,
    referralReduction,
    geographicClusters,
    conditionBreakdown,
    timelineData
  };
}