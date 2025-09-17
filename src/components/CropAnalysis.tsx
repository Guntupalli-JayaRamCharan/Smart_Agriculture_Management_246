import React, { useState, useEffect } from 'react';
import { CropAnalysisEngine, CropAnalysis } from '../data/analysisEngine';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Leaf,
  BarChart3,
  Target,
  Activity
} from 'lucide-react';

interface CropAnalysisProps {
  currentSensorData: {
    soilMoisture: number;
    temperature: number;
    humidity: number;
    phLevel: number;
    lightIntensity: number;
  };
}

const CropAnalysisComponent: React.FC<CropAnalysisProps> = ({ currentSensorData }) => {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [analysis, setAnalysis] = useState<CropAnalysis | null>(null);
  const [availableCrops] = useState(CropAnalysisEngine.getAllCrops());

  useEffect(() => {
    try {
      const cropAnalysis = CropAnalysisEngine.analyzeCrop(selectedCrop, currentSensorData);
      setAnalysis(cropAnalysis);
    } catch (error) {
      console.error('Error analyzing crop:', error);
    }
  }, [selectedCrop, currentSensorData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Crop Selection and Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Leaf className="h-5 w-5 text-green-600 mr-2" />
            Crop Analysis & Optimization
          </h3>
          <select 
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
          >
            {availableCrops.map(crop => (
              <option key={crop} value={crop}>
                {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Score */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Activity className="h-6 w-6 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Health Score</span>
            </div>
            <div className={`text-3xl font-bold ${getHealthScoreColor(analysis.healthScore)}`}>
              {analysis.healthScore}%
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(analysis.status)}`}>
              {analysis.status === 'excellent' && <CheckCircle className="h-4 w-4 mr-1" />}
              {analysis.status !== 'excellent' && <AlertCircle className="h-4 w-4 mr-1" />}
              {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
            </div>
          </div>

          {/* Predicted Yield */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="h-6 w-6 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Predicted Yield</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {analysis.predictedYield.charAt(0).toUpperCase() + analysis.predictedYield.slice(1)}
            </div>
            <div className="flex items-center justify-center">
              {analysis.predictedYield === 'excellent' || analysis.predictedYield === 'good' ? 
                <TrendingUp className="h-4 w-4 text-green-600" /> : 
                <TrendingDown className="h-4 w-4 text-red-600" />
              }
            </div>
          </div>

          {/* Critical Parameters */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-6 w-6 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Critical Issues</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {analysis.deviations.filter(d => d.severity === 'high').length}
            </div>
            <div className="text-sm text-gray-600">
              Parameters need attention
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Deviations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Parameter Analysis</h4>
        <div className="space-y-4">
          {analysis.deviations.map((deviation, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 capitalize">
                    {deviation.parameter.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(deviation.severity)}`}>
                    {deviation.severity}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Current: <strong>{deviation.current}</strong></span>
                  <span>Optimal: <strong>{deviation.optimal}</strong></span>
                  <span>Deviation: <strong>{deviation.deviation.toFixed(1)}%</strong></span>
                </div>
              </div>
              <div className="ml-4">
                {deviation.deviation > 15 ? 
                  <AlertCircle className="h-5 w-5 text-red-500" /> : 
                  <CheckCircle className="h-5 w-5 text-green-500" />
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 text-blue-600 mr-2" />
          AI Recommendations
        </h4>
        <div className="space-y-3">
          {analysis.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <p className="ml-3 text-sm text-blue-800">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropAnalysisComponent;