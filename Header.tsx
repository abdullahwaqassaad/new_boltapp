import React from 'react';
import { Activity, Map, Thermometer, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-primary-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Activity className="h-8 w-8 mr-2 text-secondary-400" />
            <h1 className="text-2xl font-bold">MediScout Pakistan</h1>
          </div>
          <nav className="flex flex-wrap justify-center md:justify-end space-x-1 md:space-x-2">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center
              ${isActive('/') ? 'bg-primary-600 text-white' : 'text-primary-200 hover:bg-primary-700'}`}
            >
              <Users className="h-4 w-4 mr-1" />
              <span>Patients</span>
            </Link>
            <Link 
              to="/analysis" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center 
              ${isActive('/analysis') ? 'bg-primary-600 text-white' : 'text-primary-200 hover:bg-primary-700'}`}
            >
              <Activity className="h-4 w-4 mr-1" />
              <span>Analysis</span>
            </Link>
            <Link 
              to="/map" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center
              ${isActive('/map') ? 'bg-primary-600 text-white' : 'text-primary-200 hover:bg-primary-700'}`}
            >
              <Map className="h-4 w-4 mr-1" />
              <span>Map</span>
            </Link>
            <Link 
              to="/simulation" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center
              ${isActive('/simulation') ? 'bg-primary-600 text-white' : 'text-primary-200 hover:bg-primary-700'}`}
            >
              <Thermometer className="h-4 w-4 mr-1" />
              <span>Simulation</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;