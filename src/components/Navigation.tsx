import React from 'react';
import { BarChart3, Grid3X3, Leaf, Home } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'graphical' | 'crop-input';
  isGraphicalView: boolean;
  onViewChange: (view: 'dashboard' | 'graphical' | 'crop-input') => void;
  onToggleGraphical: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentView,
  isGraphicalView,
  onViewChange,
  onToggleGraphical
}) => {
  return (
    <nav className="bg-white shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AgriSmart IoT</h1>
              <p className="text-xs text-gray-600">Smart Agriculture System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => onViewChange('crop-input')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'crop-input'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Leaf className="h-4 w-4" />
              <span className="font-medium">Crop Analysis</span>
            </button>

            {/* View Toggle Switch */}
            {currentView === 'dashboard' && (
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
                <span className="text-sm text-gray-600">View:</span>
                <div className="flex items-center space-x-2">
                  <Grid3X3 className={`h-4 w-4 ${!isGraphicalView ? 'text-green-600' : 'text-gray-400'}`} />
                  <button
                    onClick={onToggleGraphical}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isGraphicalView ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isGraphicalView ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <BarChart3 className={`h-4 w-4 ${isGraphicalView ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <span className="text-sm text-gray-600">
                  {isGraphicalView ? 'Graphical' : 'Normal'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;