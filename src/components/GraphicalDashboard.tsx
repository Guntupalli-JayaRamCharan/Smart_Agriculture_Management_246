import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Droplets, 
  Thermometer, 
  Eye, 
  Sun,
  Zap
} from 'lucide-react';

interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  lightIntensity: number;
  phLevel: number;
  waterUsage: number;
}

interface GraphicalDashboardProps {
  sensorData: SensorData;
}

const GraphicalDashboard: React.FC<GraphicalDashboardProps> = ({ sensorData }) => {
  // Generate sample chart data
  const generateChartData = (baseValue: number, points: number = 24) => {
    return Array.from({ length: points }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      value: Math.max(0, baseValue + (Math.random() - 0.5) * 20)
    }));
  };

  const moistureData = generateChartData(sensorData.soilMoisture);
  const temperatureData = generateChartData(sensorData.temperature);
  const humidityData = generateChartData(sensorData.humidity);
  const lightData = generateChartData(sensorData.lightIntensity);

  const SimpleChart = ({ data, color, title, unit, icon: Icon }: any) => {
    const maxValue = Math.max(...data.map((d: any) => d.value));
    const minValue = Math.min(...data.map((d: any) => d.value));
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {data[data.length - 1]?.value.toFixed(1)}{unit}
            </div>
            <div className="text-sm text-gray-500">Current</div>
          </div>
        </div>
        
        <div className="relative h-48 bg-gray-50 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 400 160">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="0"
                y1={i * 40}
                x2="400"
                y2={i * 40}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Chart line */}
            <polyline
              fill="none"
              stroke={color.replace('text-', '').replace('-600', '')}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.map((point: any, index: number) => {
                const x = (index / (data.length - 1)) * 400;
                const y = 160 - ((point.value - minValue) / (maxValue - minValue)) * 160;
                return `${x},${y}`;
              }).join(' ')}
            />
            
            {/* Data points */}
            {data.map((point: any, index: number) => {
              const x = (index / (data.length - 1)) * 400;
              const y = 160 - ((point.value - minValue) / (maxValue - minValue)) * 160;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={color.replace('text-', '').replace('-600', '')}
                  className="opacity-80 hover:opacity-100"
                />
              );
            })}
          </svg>
          
          {/* Time labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between text-sm">
          <div className="text-gray-600">
            Min: <span className="font-medium">{minValue.toFixed(1)}{unit}</span>
          </div>
          <div className="text-gray-600">
            Max: <span className="font-medium">{maxValue.toFixed(1)}{unit}</span>
          </div>
        </div>
      </div>
    );
  };

  const CircularProgress = ({ value, max, color, title, unit }: any) => {
    const percentage = (value / max) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{value.toFixed(1)}</div>
              <div className="text-sm text-gray-500">{unit}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Target: {max}{unit}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Graphical Analytics</h1>
          </div>
          <p className="text-gray-600">Real-time sensor data visualization and trends</p>
        </div>

        {/* Circular Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CircularProgress
            value={sensorData.soilMoisture}
            max={100}
            color="#3b82f6"
            title="Soil Moisture"
            unit="%"
          />
          <CircularProgress
            value={sensorData.temperature}
            max={40}
            color="#ef4444"
            title="Temperature"
            unit="°C"
          />
          <CircularProgress
            value={sensorData.humidity}
            max={100}
            color="#10b981"
            title="Humidity"
            unit="%"
          />
          <CircularProgress
            value={sensorData.lightIntensity}
            max={100}
            color="#f59e0b"
            title="Light Intensity"
            unit="%"
          />
        </div>

        {/* Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SimpleChart
            data={moistureData}
            color="text-blue-600"
            title="Soil Moisture Trend"
            unit="%"
            icon={Droplets}
          />
          <SimpleChart
            data={temperatureData}
            color="text-red-600"
            title="Temperature Trend"
            unit="°C"
            icon={Thermometer}
          />
          <SimpleChart
            data={humidityData}
            color="text-green-600"
            title="Humidity Trend"
            unit="%"
            icon={Eye}
          />
          <SimpleChart
            data={lightData}
            color="text-yellow-600"
            title="Light Intensity Trend"
            unit="%"
            icon={Sun}
          />
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">24-Hour Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">
                {moistureData.reduce((acc, curr) => acc + curr.value, 0) / moistureData.length}%
              </div>
              <div className="text-sm text-blue-700">Avg Moisture</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Thermometer className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-900">
                {(temperatureData.reduce((acc, curr) => acc + curr.value, 0) / temperatureData.length).toFixed(1)}°C
              </div>
              <div className="text-sm text-red-700">Avg Temperature</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">
                {(humidityData.reduce((acc, curr) => acc + curr.value, 0) / humidityData.length).toFixed(1)}%
              </div>
              <div className="text-sm text-green-700">Avg Humidity</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-900">{sensorData.waterUsage}L</div>
              <div className="text-sm text-yellow-700">Water Used</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphicalDashboard;