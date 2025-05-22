import React, { useState, useEffect } from 'react';
import HeatMap from '../components/HeatMap';
import { StatisticsData } from '../types';
import { 
  generateSyntheticData, 
  generateAIDiagnoses, 
  generateTraditionalDiagnoses,
  calculateStatistics
} from '../utils/dataFetcher';
import { AlertTriangle, MapPin, BarChart3, Thermometer } from 'lucide-react';

const MapPage: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  useEffect(() => {
    // Generate synthetic data and calculate statistics
    const patients = generateSyntheticData(100);
    const aiResults = generateAIDiagnoses(patients);
    const traditionalResults = generateTraditionalDiagnoses(patients);
    
    const stats = calculateStatistics(patients, aiResults, traditionalResults);
    setStatistics(stats);
    
    // Set default selected location
    if (stats.geographicClusters.length > 0) {
      // Select location with highest case count by default
      const highestCaseLocation = stats.geographicClusters.reduce((prev, current) => 
        (prev.count > current.count) ? prev : current
      );
      setSelectedLocation(highestCaseLocation.location);
    }
    
    setIsLoading(false);
  }, []);
  
  if (isLoading || !statistics) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-primary-600 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-primary-600 border-r-primary-200 border-b-primary-200 border-l-primary-200 rounded-full animate-spin mb-4"></div>
          <p className="text-primary-800 font-medium">Loading map data...</p>
        </div>
      </div>
    );
  }
  
  const locationData = selectedLocation ? 
    statistics.geographicClusters.find(loc => loc.location === selectedLocation) : null;
  
  // Find hotspots (locations with high concentration of severe cases)
  const hotspots = statistics.geographicClusters
    .filter(loc => loc.severeCases > loc.count * 0.2)
    .sort((a, b) => b.severeCases - a.severeCases);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HeatMap statistics={statistics} />
          
          {hotspots.length > 0 && (
            <div className="mt-6 bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-warning-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-warning-800">Disease Hotspots Detected</h3>
                  <p className="text-warning-700 mt-1">
                    The following areas show higher than expected rates of severe cases:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {hotspots.slice(0, 3).map((spot, index) => (
                      <li key={index} className="flex items-center">
                        <MapPin className="h-4 w-4 text-warning-600 mr-2" />
                        <span className="text-warning-800">
                          <strong>{spot.location}</strong>: {spot.severeCases} severe cases out of {spot.count} total cases
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-warning-700 mt-3 text-sm">
                    Recommended action: Target these areas for enhanced public health outreach and preventive measures.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              Locations
            </h3>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {statistics.geographicClusters
                .sort((a, b) => b.count - a.count)
                .map((location, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLocation(location.location)}
                    className={`w-full flex items-center justify-between p-3 rounded-md transition-colors
                      ${selectedLocation === location.location 
                        ? 'bg-primary-50 border border-primary-200' 
                        : 'hover:bg-gray-50 border border-gray-100'}`}
                  >
                    <div className="flex items-center">
                      <span 
                        className={`inline-block w-3 h-3 rounded-full mr-2 
                          ${location.severeCases > location.count * 0.3 
                            ? 'bg-danger-500' 
                            : location.severeCases > location.count * 0.15 
                              ? 'bg-warning-500' 
                              : 'bg-success-500'}`}
                      ></span>
                      <span className="font-medium">{location.location}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {location.count} cases
                    </div>
                  </button>
                ))}
            </div>
          </div>
          
          {locationData && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary-600" />
                {selectedLocation} Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Cases Severity</span>
                    <span className="text-sm text-gray-600">{locationData.severeCases} of {locationData.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        locationData.severeCases / locationData.count > 0.3 
                          ? 'bg-danger-500' 
                          : locationData.severeCases / locationData.count > 0.15 
                            ? 'bg-warning-500' 
                            : 'bg-success-500'
                      }`}
                      style={{ width: `${(locationData.severeCases / locationData.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-md p-3">
                    <p className="text-xs text-gray-500 mb-1">Total Cases</p>
                    <p className="text-xl font-semibold">{locationData.count}</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-3">
                    <p className="text-xs text-gray-500 mb-1">Severe Cases</p>
                    <p className="text-xl font-semibold">{locationData.severeCases}</p>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Thermometer className="h-4 w-4 mr-1 text-primary-600" />
                    Risk Assessment
                  </h4>
                  <p className="text-sm text-gray-600">
                    {locationData.severeCases / locationData.count > 0.3 ? (
                      <span className="text-danger-700">High risk area requiring immediate intervention. Consider deploying mobile health units and community education campaigns.</span>
                    ) : locationData.severeCases / locationData.count > 0.15 ? (
                      <span className="text-warning-700">Moderate risk area requiring enhanced monitoring and preventive measures.</span>
                    ) : (
                      <span className="text-success-700">Lower risk area, but continued surveillance is recommended.</span>
                    )}
                  </p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p className="mb-1">Recommended Actions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {locationData.severeCases / locationData.count > 0.2 && (
                      <>
                        <li>Deploy mobile diagnostic units</li>
                        <li>Conduct community awareness campaigns</li>
                        <li>Increase healthcare worker presence</li>
                      </>
                    )}
                    <li>Continue surveillance for emerging patterns</li>
                    <li>Monitor seasonal variations in disease prevalence</li>
                    <li>Ensure adequate medical supplies</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;