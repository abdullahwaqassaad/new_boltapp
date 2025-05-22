import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PatientsPage from './pages/PatientsPage';
import AnalysisPage from './pages/AnalysisPage';
import MapPage from './pages/MapPage';
import SimulationPage from './pages/SimulationPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-6 pb-12">
          <Routes>
            <Route path="/" element={<PatientsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
          </Routes>
        </main>
        <footer className="bg-primary-800 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-sm text-primary-200">
                © 2024 MediScout Pakistan | Developed for Community Health Workers
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;