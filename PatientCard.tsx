import React from 'react';
import { Patient } from '../types';
import { AlertTriangle, Check, XCircle, Activity, Thermometer } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onDiagnose: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onDiagnose }) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-danger-100 border-danger-500 text-danger-900';
      case 'high': return 'bg-warning-100 border-warning-500 text-warning-900';
      case 'medium': return 'bg-accent-100 border-accent-500 text-accent-900';
      default: return 'bg-success-100 border-success-500 text-success-900';
    }
  };
  
  const getTemperatureColor = (temp: number) => {
    if (temp >= 39) return 'text-danger-600';
    if (temp >= 38) return 'text-warning-600';
    return 'text-success-600';
  };

  const getBPColor = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) return 'text-danger-600';
    if (systolic <= 90 || diastolic <= 60) return 'text-warning-600';
    return 'text-success-600';
  };

  const hasAIDiagnosis = patient.aiDiagnosis !== undefined;
  
  return (
    <div className={`border-l-4 ${getSeverityColor(patient.severity)} bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{patient.id}</h3>
            <p className="text-sm text-gray-600">{patient.age} years • {patient.gender} • {patient.location}</p>
          </div>
          {patient.severity && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
              ${patient.severity === 'critical' ? 'bg-danger-100 text-danger-800' : 
                patient.severity === 'high' ? 'bg-warning-100 text-warning-800' : 
                  patient.severity === 'medium' ? 'bg-accent-100 text-accent-800' : 
                    'bg-success-100 text-success-800'}`}>
              {patient.severity === 'critical' ? (
                <AlertTriangle className="h-3 w-3 mr-1" />
              ) : patient.severity === 'high' ? (
                <AlertTriangle className="h-3 w-3 mr-1" />
              ) : (
                <Check className="h-3 w-3 mr-1" />
              )}
              {patient.severity.charAt(0).toUpperCase() + patient.severity.slice(1)}
            </span>
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-center text-sm">
            <Thermometer className={`h-4 w-4 mr-1 ${getTemperatureColor(patient.temperature)}`} />
            <span className={`${getTemperatureColor(patient.temperature)} font-medium`}>
              {patient.temperature.toFixed(1)}°C
            </span>
            <span className="mx-2">•</span>
            <Activity className={`h-4 w-4 mr-1 ${getBPColor(patient.bloodPressure.systolic, patient.bloodPressure.diastolic)}`} />
            <span className={`${getBPColor(patient.bloodPressure.systolic, patient.bloodPressure.diastolic)} font-medium`}>
              {patient.bloodPressure.systolic}/{patient.bloodPressure.diastolic} mmHg
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Symptoms</h4>
          <div className="flex flex-wrap gap-1">
            {patient.symptoms.map((symptom, i) => (
              <span key={i} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-700">
                {symptom}
              </span>
            ))}
          </div>
        </div>

        {patient.diagnosis && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Initial Assessment</h4>
            <p className="text-sm text-gray-800">{patient.diagnosis}</p>
          </div>
        )}

        {hasAIDiagnosis ? (
          <div className="bg-primary-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-primary-900 mb-1">AI Diagnosis</h4>
            <p className="text-sm text-primary-800 font-medium">{patient.aiDiagnosis}</p>
            <div className="flex items-center mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    (patient.aiConfidence || 0) > 90 ? 'bg-success-500' : 
                    (patient.aiConfidence || 0) > 70 ? 'bg-warning-500' : 
                    'bg-danger-500'
                  }`} 
                  style={{ width: `${patient.aiConfidence || 0}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium text-gray-700 ml-2">{patient.aiConfidence?.toFixed(0)}%</span>
            </div>
            {patient.referralRecommended && (
              <div className="flex items-center text-xs text-danger-800 mt-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span>Referral recommended</span>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onDiagnose(patient.id)}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <Activity className="h-4 w-4 mr-2" />
            AI Diagnosis
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientCard;