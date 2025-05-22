import React, { useState } from 'react';
import { Play, Loader, DatabaseBackup, Download } from 'lucide-react';

interface SimulationControlsProps {
  onSimulate: (patientCount: number, includeSwat: boolean) => void;
  onDownload: () => void;
  isLoading: boolean;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ onSimulate, onDownload, isLoading }) => {
  const [patientCount, setPatientCount] = useState<number>(50);
  const [includeSwat, setIncludeSwat] = useState<boolean>(true);

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Simulation Controls</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="patientCount" className="block text-sm font-medium text-gray-700 mb-1">
            Number of patients to simulate
          </label>
          <input
            type="number"
            id="patientCount"
            min={10}
            max={500}
            value={patientCount}
            onChange={(e) => setPatientCount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Min: 10</span>
            <span>Max: 500</span>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeSwat"
            checked={includeSwat}
            onChange={(e) => setIncludeSwat(e.target.checked)}
            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="includeSwat" className="ml-2 block text-sm text-gray-700">
            Include Swat district observations (for dengue hotspot)
          </label>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onSimulate(patientCount, includeSwat)}
            disabled={isLoading}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Simulating...
              </>
            ) : (
              <>
                <Play className="-ml-1 mr-2 h-4 w-4" />
                Run Simulation
              </>
            )}
          </button>
          
          <button
            onClick={onDownload}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Download className="-ml-1 mr-2 h-4 w-4" />
            Download Data
          </button>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-medium">Simulation Parameters:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Monsoon-driven febrile illness surge (25% with fever)</li>
          <li>High diarrheal disease burden in under-5s (39%)</li>
          <li>Stunting and wasting among under-5s</li>
          <li>TB incidence (259 per 100,000)</li>
          <li>Obstetric complications (10% of pregnancies)</li>
          <li>Hypertension in adults (37.3%)</li>
          <li>Diabetes in adults (31.4%)</li>
          <li>Child immunization coverage (66%)</li>
          <li>Acute respiratory infection in under-5s (75%)</li>
        </ul>
      </div>
    </div>
  );
};

export default SimulationControls;