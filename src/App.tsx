import React from 'react';
import { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import GraphicalDashboard from './components/GraphicalDashboard';
import CropInput from './components/CropInput';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'graphical' | 'crop-input'>('dashboard');
  const [isGraphicalView, setIsGraphicalView] = useState(false);

  // Sample sensor data for graphical view
  const sensorData = {
    soilMoisture: 45,
    temperature: 24,
    humidity: 65,
    lightIntensity: 75,
    phLevel: 6.8,
    waterUsage: 125
  };

  const handleViewChange = (view: 'dashboard' | 'graphical' | 'crop-input') => {
    setCurrentView(view);
    if (view !== 'dashboard') {
      setIsGraphicalView(false);
    }
  };

  const handleToggleGraphical = () => {
    if (currentView === 'dashboard') {
      setIsGraphicalView(!isGraphicalView);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return isGraphicalView ? 
          <GraphicalDashboard sensorData={sensorData} /> : 
          <Dashboard />;
      case 'crop-input':
        return <CropInput />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentView={currentView}
        isGraphicalView={isGraphicalView}
        onViewChange={handleViewChange}
        onToggleGraphical={handleToggleGraphical}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;