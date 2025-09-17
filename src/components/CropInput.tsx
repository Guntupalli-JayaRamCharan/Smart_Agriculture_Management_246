import React, { useState, useEffect } from 'react';
import { CropAnalysisEngine } from '../data/analysisEngine';
import { 
  Leaf, 
  Droplets, 
  Thermometer, 
  Eye, 
  Sun, 
  TestTube,
  Save,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Target
} from 'lucide-react';

interface CropInputData {
  cropType: string;
  soilMoisture: number;
  temperature: number;
  humidity: number;
  phLevel: number;
  lightIntensity: number;
}

const CropInput: React.FC = () => {
  const [cropData, setCropData] = useState<CropInputData>({
    cropType: 'tomato',
    soilMoisture: 45,
    temperature: 24,
    humidity: 65,
    phLevel: 6.8,
    lightIntensity: 75
  });

  const [optimalConditions, setOptimalConditions] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [availableCrops] = useState(CropAnalysisEngine.getAllCrops());

  useEffect(() => {
    const optimal = CropAnalysisEngine.getOptimalConditions(cropData.cropType);
    setOptimalConditions(optimal);
    
    if (optimal) {
      const cropAnalysis = CropAnalysisEngine.analyzeCrop(cropData.cropType, cropData);
      setAnalysis(cropAnalysis);
    }
  }, [cropData]);

  const handleInputChange = (field: keyof CropInputData, value: string | number) => {
    setCropData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  const resetToOptimal = () => {
    if (optimalConditions) {
      setCropData(prev => ({
        ...prev,
        soilMoisture: optimalConditions.soilMoisture.ideal,
        temperature: optimalConditions.temperature.ideal,
        humidity: optimalConditions.humidity.ideal,
        phLevel: optimalConditions.phLevel.ideal,
        lightIntensity: optimalConditions.lightIntensity.ideal
      }));
    }
  };

  const getParameterStatus = (current: number, optimal: any) => {
    if (!optimal) return { status: 'unknown', color: 'text-gray-500' };
    
    if (current >= optimal.min && current <= optimal.max) {
      return { status: 'optimal', color: 'text-green-600' };
    } else if (Math.abs(current - optimal.ideal) / optimal.ideal <= 0.15) {
      return { status: 'acceptable', color: 'text-yellow-600' };
    } else {
      return { status: 'critical', color: 'text-red-600' };
    }
  };

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step, 
    unit, 
    icon: Icon, 
    optimal 
  }: any) => {
    const status = getParameterStatus(value, optimal);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-900">{label}</label>
          </div>
          <div className={`flex items-center space-x-1 ${status.color}`}>
            {status.status === 'optimal' && <CheckCircle className="h-4 w-4" />}
            {status.status === 'acceptable' && <AlertCircle className="h-4 w-4" />}
            {status.status === 'critical' && <AlertCircle className="h-4 w-4" />}
            <span className="text-xs font-medium capitalize">{status.status}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex items-center space-x-1 min-w-[60px]">
              <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
              />
              <span className="text-sm text-gray-500">{unit}</span>
            </div>
          </div>
          
          {optimal && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Min: {optimal.min}{unit}</span>
              <span className="font-medium text-green-600">Ideal: {optimal.ideal}{unit}</span>
              <span>Max: {optimal.max}{unit}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl font-bold text-gray-900">Crop Analysis Input</h1>
              </div>
              <p className="text-gray-600">Input your crop sensor data and compare with optimal conditions</p>
            </div>
            <button
              onClick={resetToOptimal}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset to Optimal</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Crop Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Crop Type</h3>
              <select
                value={cropData.cropType}
                onChange={(e) => handleInputChange('cropType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {availableCrops.map(crop => (
                  <option key={crop} value={crop}>
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sensor Inputs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sensor Data Input</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Soil Moisture"
                  value={cropData.soilMoisture}
                  onChange={(value: number) => handleInputChange('soilMoisture', value)}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  icon={Droplets}
                  optimal={optimalConditions?.soilMoisture}
                />
                
                <InputField
                  label="Temperature"
                  value={cropData.temperature}
                  onChange={(value: number) => handleInputChange('temperature', value)}
                  min={0}
                  max={50}
                  step={0.1}
                  unit="°C"
                  icon={Thermometer}
                  optimal={optimalConditions?.temperature}
                />
                
                <InputField
                  label="Humidity"
                  value={cropData.humidity}
                  onChange={(value: number) => handleInputChange('humidity', value)}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  icon={Eye}
                  optimal={optimalConditions?.humidity}
                />
                
                <InputField
                  label="Light Intensity"
                  value={cropData.lightIntensity}
                  onChange={(value: number) => handleInputChange('lightIntensity', value)}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                  icon={Sun}
                  optimal={optimalConditions?.lightIntensity}
                />
                
                <div className="md:col-span-2">
                  <InputField
                    label="pH Level"
                    value={cropData.phLevel}
                    onChange={(value: number) => handleInputChange('phLevel', value)}
                    min={4}
                    max={9}
                    step={0.1}
                    unit="pH"
                    icon={TestTube}
                    optimal={optimalConditions?.phLevel}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {/* Health Score */}
            {analysis && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Health Analysis</h3>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {analysis.healthScore}%
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    analysis.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    analysis.status === 'good' ? 'bg-blue-100 text-blue-800' :
                    analysis.status === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Predicted Yield</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600 capitalize">
                        {analysis.predictedYield}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Critical Issues</span>
                    <span className="font-medium text-red-600">
                      {analysis.deviations.filter((d: any) => d.severity === 'high').length}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Optimal Conditions Reference */}
            {optimalConditions && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimal Conditions</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Soil Moisture</span>
                    <span className="font-medium">{optimalConditions.soilMoisture.ideal}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature</span>
                    <span className="font-medium">{optimalConditions.temperature.ideal}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humidity</span>
                    <span className="font-medium">{optimalConditions.humidity.ideal}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Light Intensity</span>
                    <span className="font-medium">{optimalConditions.lightIntensity.ideal}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">pH Level</span>
                    <span className="font-medium">{optimalConditions.phLevel.ideal}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis && analysis.recommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {analysis.recommendations.slice(0, 3).map((rec: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropInput;