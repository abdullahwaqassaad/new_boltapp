import React, { useState, useEffect } from 'react';
import PatientCard from '../components/PatientCard';
import { Patient, DiagnosticResult } from '../types';
import { 
  generateSyntheticData, 
  simulateAIDiagnosis 
} from '../utils/dataFetcher';
import { Search, Filter, AlertTriangle, ArrowDownAZ, User } from 'lucide-react';

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Generate synthetic data on component mount
    const data = generateSyntheticData(24);
    setPatients(data);
    setFilteredPatients(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Filter and sort patients whenever filters change
    let result = [...patients];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(patient => 
        patient.id.toLowerCase().includes(term) ||
        patient.location.toLowerCase().includes(term) ||
        patient.diagnosis?.toLowerCase().includes(term) ||
        patient.symptoms.some(s => s.toLowerCase().includes(term))
      );
    }
    
    // Apply severity filter
    if (severityFilter !== 'all') {
      result = result.filter(patient => patient.severity === severityFilter);
    }
    
    // Apply sorting
    if (sortBy === 'severity') {
      const severityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3, undefined: 4 };
      result.sort((a, b) => {
        const severityA = a.severity ? severityOrder[a.severity] : 4;
        const severityB = b.severity ? severityOrder[b.severity] : 4;
        return severityA - severityB;
      });
    } else if (sortBy === 'location') {
      result.sort((a, b) => a.location.localeCompare(b.location));
    } else if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime());
    }
    
    setFilteredPatients(result);
  }, [patients, searchTerm, severityFilter, sortBy]);

  const handleDiagnose = (patientId: string) => {
    setPatients(prevPatients => {
      const updatedPatients = [...prevPatients];
      const patientIndex = updatedPatients.findIndex(p => p.id === patientId);
      
      if (patientIndex !== -1) {
        const patient = updatedPatients[patientIndex];
        const result: DiagnosticResult = simulateAIDiagnosis(patient);
        
        // Update patient with AI diagnosis
        updatedPatients[patientIndex] = {
          ...patient,
          aiDiagnosis: result.aiDiagnosis,
          aiConfidence: result.confidence,
          riskScore: result.riskScore,
          referralRecommended: result.needsReferral
        };
      }
      
      return updatedPatients;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-primary-600 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-primary-600 border-r-primary-200 border-b-primary-200 border-l-primary-200 rounded-full animate-spin mb-4"></div>
          <p className="text-primary-800 font-medium">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients by ID, location, or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-max">
            <div className="relative inline-block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div className="relative inline-block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowDownAZ className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="date">Sort by Date</option>
                <option value="severity">Sort by Severity</option>
                <option value="location">Sort by Location</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-8">
          <User className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No patients found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          {severityFilter === 'critical' || patients.some(p => p.severity === 'critical') && (
            <div className="flex items-center bg-danger-50 border border-danger-200 rounded-md p-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-danger-600 mr-3" />
              <p className="text-danger-800 text-sm">
                <span className="font-medium">Alert:</span> There are patients with critical condition that require immediate attention.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map(patient => (
              <PatientCard 
                key={patient.id} 
                patient={patient}
                onDiagnose={handleDiagnose}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PatientsPage;