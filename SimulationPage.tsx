import React, { useState } from 'react';
import SimulationControls from '../components/SimulationControls';
import { Patient, DiagnosticResult, StatisticsData } from '../types';
import ImpactChart from '../components/ImpactChart';
import HeatMap from '../components/HeatMap';
import { 
  generateSyntheticData, 
  generateAIDiagnoses, 
  generateTraditionalDiagnoses,
  calculateStatistics
} from '../utils/dataFetcher';
import { Activity, AlertTriangle, BarChart2, FileBadge as FileBar2, FilePlus2, Play } from 'lucide-react';

const SimulationPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [aiResults, setAiResults] = useState<DiagnosticResult[]>([]);
  const [traditionalResults, setTraditionalResults] = useState<DiagnosticResult[]>([]);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulationRun, setSimulationRun] = useState<boolean>(false);
  
  const handleSimulate = (patientCount: number, includeSwat: boolean) => {
    setIsLoading(true);
    
    // Use setTimeout to prevent UI freeze
    setTimeout(() => {
      try {
        let data = generateSyntheticData(patientCount);
        
        // If includeSwat is true, ensure at least 10 dengue cases in Swat/Mingora
        if (includeSwat) {
          // Filter out some existing patients from Swat/Mingora
          data = data.filter(p => !(p.location === 'Swat' || p.location === 'Mingora'));
          
          // Generate dengue cases for Swat
          const dengueCount = Math.max(10, Math.floor(patientCount * 0.1));
          const dengueCases = [];
          
          for (let i = 0; i < dengueCount; i++) {
            dengueCases.push({
              id: `PAT-SWAT-${i.toString().padStart(3, '0')}`,
              age: Math.floor(Math.random() * 70) + 5,
              gender: Math.random() > 0.5 ? 'male' : 'female',
              location: Math.random() > 0.5 ? 'Swat' : 'Mingora',
              symptoms: ['fever', 'headache', 'rash', 'joint pain', 'muscle pain', 'eye pain'].slice(0, 3 + Math.floor(Math.random() * 3)),
              temperature: 38 + Math.random() * 2, // 38-40°C
              bloodPressure: {
                systolic: 90 + Math.floor(Math.random() * 60),
                diastolic: 60 + Math.floor(Math.random() * 40),
              },
              weight: 30 + Math.random() * 70,
              height: 100 + Math.random() * 100,
              respiratoryRate: 12 + Math.floor(Math.random() * 18),
              oxygenSaturation: 90 + Math.random() * 10,
              diagnosis: 'Suspected Dengue',
              severity: Math.random() < 0.3 ? 'critical' : (Math.random() < 0.6 ? 'high' : 'medium'),
              dateReported: new Date(
                new Date('2024-05-01').getTime() + 
                Math.random() * (new Date('2024-06-30').getTime() - new Date('2024-05-01').getTime())
              ).toISOString().split('T')[0],
              imageUrl: 'https://www.cdc.gov/dengue/images/symptoms/dengue-rash-min.jpg'
            });
          }
          
          // Combine regular data with dengue cases
          data = [...data, ...dengueCases].slice(0, patientCount);
        }
        
        const ai = generateAIDiagnoses(data);
        const traditional = generateTraditionalDiagnoses(data);
        const stats = calculateStatistics(data, ai, traditional);
        
        setPatients(data);
        setAiResults(ai);
        setTraditionalResults(traditional);
        setStatistics(stats);
        setSimulationRun(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Simulation error:', error);
        setIsLoading(false);
      }
    }, 500);
  };
  
  const handleDownload = () => {
    if (!patients.length) return;
    
    // Combine patient data with AI diagnosis results
    const data = patients.map((patient, index) => {
      const aiResult = aiResults[index];
      const traditionalResult = traditionalResults[index];
      
      return {
        ...patient,
        ai_diagnosis: aiResult.aiDiagnosis,
        ai_confidence: aiResult.confidence.toFixed(2),
        ai_risk_score: aiResult.riskScore.toFixed(2),
        ai_referral_recommended: aiResult.needsReferral,
        ai_diagnosis_time_ms: aiResult.diagnosisTime,
        traditional_diagnosis: traditionalResult.aiDiagnosis,
        traditional_confidence: traditionalResult.confidence.toFixed(2),
        traditional_risk_score: traditionalResult.riskScore.toFixed(2),
        traditional_referral_recommended: traditionalResult.needsReferral,
        traditional_diagnosis_time_ms: traditionalResult.diagnosisTime,
      };
    });
    
    // Convert to CSV
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle arrays and objects by JSON stringifying them
          if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          // Handle strings with commas
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'mediscout_simulation_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Calculate dengue referral reduction specifically
  const calculateDengueReferralReduction = () => {
    if (!patients.length || !aiResults.length || !traditionalResults.length) {
      return '0%';
    }
    
    const denguePatients = patients.filter(p => p.diagnosis === 'Suspected Dengue');
    if (denguePatients.length === 0) return '0%';
    
    const dengueIndices = denguePatients.map(dp => patients.findIndex(p => p.id === dp.id));
    
    const aiReferrals = dengueIndices.filter(i => aiResults[i].needsReferral).length;
    const traditionalReferrals = dengueIndices.filter(i => traditionalResults[i].needsReferral).length;
    
    if (traditionalReferrals === 0) return '0%';
    
    const reduction = ((traditionalReferrals - aiReferrals) / traditionalReferrals) * 100;
    return `${Math.round(reduction)}%`;
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SimulationControls 
            onSimulate={handleSimulate}
            onDownload={handleDownload}
            isLoading={isLoading}
          />
          
          {simulationRun && statistics && (
            <div className="bg-white rounded-lg shadow-md p-5 mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary-600" />
                Simulation Results
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Total patients simulated</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics.totalCases}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Simulation timeframe</p>
                  <p className="text-lg text-gray-800">May - June 2024</p>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-primary-700 mb-2">Key Impact Metrics:</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI diagnostic accuracy:</span>
                      <span className="font-medium text-gray-900">{Math.round(statistics.accuracyRate)}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reduction in referrals:</span>
                      <span className="font-medium text-gray-900">{Math.round(statistics.referralReduction)}%</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dengue referral reduction:</span>
                      <span className="font-medium text-gray-900">{calculateDengueReferralReduction()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diagnosis speed:</span>
                      <span className="font-medium text-gray-900">{statistics.detectionSpeed < 0.1 ? 'Seconds' : 'Minutes'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 flex items-center mb-2">
                    <FilePlus2 className="h-4 w-4 mr-1 text-gray-500" />
                    <span>Dataset Summary</span>
                  </p>
                  
                  <div className="space-y-1 text-sm">
                    {statistics.conditionBreakdown.map((condition, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{condition.condition}:</span>
                        <span className="font-medium text-gray-900">{condition.count} cases</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-md">
              <div className="animate-pulse text-primary-600 flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-primary-600 border-r-primary-200 border-b-primary-200 border-l-primary-200 rounded-full animate-spin mb-4"></div>
                <p className="text-primary-800 font-medium">Running simulation...</p>
              </div>
            </div>
          ) : simulationRun && statistics ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-primary-600" />
                  Impact Assessment
                </h3>
                
                <div className="mb-6">
                  <div className="flex items-center bg-success-50 border border-success-200 rounded-md p-3">
                    <div className="rounded-full bg-success-100 p-2 mr-3">
                      <AlertTriangle className="h-5 w-5 text-success-600" />
                    </div>
                    <div>
                      <p className="text-success-800 font-medium">Projected Impact on Dengue Cases</p>
                      <p className="text-success-700 text-sm mt-1">
                        MediScout's AI system could reduce severe dengue referrals by {calculateDengueReferralReduction()} 
                        in real-world settings by enabling earlier detection and intervention.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <ImpactChart
                    data={[
                      { name: 'Case Identification', ai: Math.round(statistics.accuracyRate), traditional: 65 },
                      { name: 'Appropriate Referrals', ai: 90, traditional: 70 },
                      { name: 'Early Intervention', ai: 85, traditional: 45 },
                      { name: 'Cost Efficiency', ai: 80, traditional: 50 }
                    ]}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FileBar2 className="h-5 w-5 mr-2 text-primary-600" />
                  Disease Distribution
                </h3>
                
                {statistics && <HeatMap statistics={statistics} />}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8 h-96">
              <div className="bg-primary-100 rounded-full p-3 mb-4">
                <Activity className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Simulation Data</h3>
              <p className="text-gray-600 text-center mb-6">
                Use the controls on the left to generate synthetic health data and run AI diagnostics.
              </p>
              <button
                onClick={() => handleSimulate(50, true)}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Play className="-ml-1 mr-2 h-4 w-4" />
                Run Default Simulation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;