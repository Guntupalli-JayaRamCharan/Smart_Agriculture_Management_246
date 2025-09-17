import React, { useState, useEffect } from 'react';
import CropAnalysisComponent from './CropAnalysis';
import { 
  Droplets, 
  Thermometer, 
  Eye, 
  Sun, 
  Zap, 
  AlertTriangle, 
  Power, 
  TrendingUp,
  Calendar,
  MapPin,
  Brain,
  Home
} from 'lucide-react';


interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  lightIntensity: number;
  phLevel: number;
  waterUsage: number;
}


interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
}


const Dashboard: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    soilMoisture: 45,
    temperature: 24,
    humidity: 65,
    lightIntensity: 75,
    phLevel: 6.8,
    waterUsage: 125
  });


  const [weather, setWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 72,
    condition: 'Partly Cloudy',
    windSpeed: 12
  });


  const [irrigationStatus, setIrrigationStatus] = useState(false);
  const [lastWatering, setLastWatering] = useState('2 hours ago');


  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        soilMoisture: Math.max(20, Math.min(80, prev.soilMoisture + (Math.random() - 0.5) * 4)),
        temperature: Math.max(18, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5) * 3)),
        lightIntensity: Math.max(0, Math.min(100, prev.lightIntensity + (Math.random() - 0.5) * 5))
      }));
    }, 3000);


    return () => clearInterval(interval);
  }, []);


  const toggleIrrigation = () => {
    setIrrigationStatus(!irrigationStatus);
    if (!irrigationStatus) {
      setLastWatering('Just now');
    }
  };


  const getSoilMoistureStatus = (moisture: number) => {
    if (moisture < 30) return { status: 'Low', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (moisture > 70) return { status: 'High', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    return { status: 'Optimal', color: 'text-green-600', bgColor: 'bg-green-50' };
  };


  const getTemperatureStatus = (temp: number) => {
    if (temp < 20) return { status: 'Cold', color: 'text-blue-600' };
    if (temp > 30) return { status: 'Hot', color: 'text-red-600' };
    return { status: 'Optimal', color: 'text-green-600' };
  };


  const moistureStatus = getSoilMoistureStatus(sensorData.soilMoisture);
  const tempStatus = getTemperatureStatus(sensorData.temperature);


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Home className="h-8 w-8 text-green-600" />
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              </div>
              <p className="text-gray-600">Real-time monitoring and control system</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Farm Location: Zone A</span>
              <Calendar className="h-4 w-4 ml-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>


        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Soil Moisture */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow ${moistureStatus.bgColor}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${moistureStatus.color} bg-white`}>
                {moistureStatus.status}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Soil Moisture</h3>
              <p className="text-3xl font-bold text-gray-900">{sensorData.soilMoisture.toFixed(3)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${sensorData.soilMoisture}%` }}
                ></div>
              </div>
            </div>
          </div>


          {/* Temperature */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Thermometer className="h-6 w-6 text-red-600" />
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${tempStatus.color} bg-gray-50`}>
                {tempStatus.status}
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Temperature</h3>
              <p className="text-3xl font-bold text-gray-900">{sensorData.temperature.toFixed(3)}°C</p>
              <p className="text-sm text-gray-600">Weather: {weather.temperature.toFixed(3)}°C</p>
            </div>
          </div>


          {/* Humidity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-50">
                Normal
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Humidity</h3>
              <p className="text-3xl font-bold text-gray-900">{sensorData.humidity.toFixed(3)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${sensorData.humidity}%` }}
                ></div>
              </div>
            </div>
          </div>


          {/* Light Intensity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Sun className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium text-yellow-600 bg-yellow-50">
                Good
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Light Intensity</h3>
              <p className="text-3xl font-bold text-gray-900">{sensorData.lightIntensity.toFixed(3)}%</p>
              <p className="text-sm text-gray-600">Condition: {weather.condition}</p>
            </div>
          </div>
        </div>


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Water Management System */}
          <div className="xl:col-span-2 space-y-6">
            {/* Irrigation Control */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                  Water Management System
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  irrigationStatus ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'
                }`}>
                  {irrigationStatus ? 'Active' : 'Inactive'}
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Irrigation Status</p>
                      <p className="text-lg font-bold text-blue-900">
                        {irrigationStatus ? 'Running' : 'Stopped'}
                      </p>
                    </div>
                    <button
                      onClick={toggleIrrigation}
                      className={`p-3 rounded-full transition-all ${
                        irrigationStatus 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                    >
                      <Power className="h-5 w-5" />
                    </button>
                  </div>


                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Last Watering</p>
                    <p className="text-lg font-semibold text-gray-900">{lastWatering}</p>
                  </div>


                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-600">Water Usage Today</p>
                    <p className="text-lg font-semibold text-green-900">{sensorData.waterUsage.toFixed(3)}L</p>
                  </div>
                </div>


                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Soil Parameters</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">pH Level</span>
                        <span className="font-medium">{sensorData.phLevel.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Moisture</span>
                        <span className="font-medium">{sensorData.soilMoisture.toFixed(3)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Temperature</span>
                        <span className="font-medium">{sensorData.temperature.toFixed(3)}°C</span>
                      </div>
                    </div>
                  </div>


                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800">Recommendations</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      {sensorData.soilMoisture < 40 
                        ? 'Consider watering - soil moisture is getting low'
                        : 'Soil moisture levels are adequate'}
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* Analytics Chart Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  Sensor Analytics (24h)
                </h3>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              
              {/* Simple Chart Representation */}
              <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Interactive charts will display here</p>
                  <p className="text-sm text-gray-500 mt-2">Connect to Chart.js or similar library for real-time data visualization</p>
                </div>
              </div>
            </div>
          </div>


          {/* Crop Analysis Section */}
          <div className="xl:col-span-2 space-y-6">
            <CropAnalysisComponent currentSensorData={sensorData} />
          </div>


          {/* Right Sidebar */}
          <div className="xl:col-span-4 lg:grid lg:grid-cols-3 lg:gap-6 xl:block xl:space-y-6">
            {/* Weather Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 lg:mb-0 xl:mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Sun className="h-5 w-5 text-yellow-600 mr-2" />
                Weather Conditions
              </h3>
              
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold text-gray-900">{weather.temperature.toFixed(3)}°C</div>
                  <div className="text-gray-600">{weather.condition}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-blue-600 font-medium">Humidity</div>
                    <div className="text-blue-900 font-bold">{weather.humidity.toFixed(3)}%</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-green-600 font-medium">Wind</div>
                    <div className="text-green-900 font-bold">{weather.windSpeed.toFixed(3)} km/h</div>
                  </div>
                </div>
              </div>
            </div>


            {/* System Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 lg:mb-0 xl:mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                System Alerts
              </h3>
              
              <div className="space-y-3">
                {sensorData.soilMoisture < 30 && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                    <p className="text-sm text-red-800 font-medium">Low Soil Moisture</p>
                    <p className="text-xs text-red-600">Consider immediate watering</p>
                  </div>
                )}
                
                {sensorData.temperature > 32 && (
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800 font-medium">High Temperature</p>
                    <p className="text-xs text-yellow-600">Monitor plant stress levels</p>
                  </div>
                )}


                {sensorData.soilMoisture >= 30 && sensorData.temperature <= 32 && (
                  <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <p className="text-sm text-green-800 font-medium">All Systems Normal</p>
                    <p className="text-xs text-green-600">Optimal growing conditions</p>
                  </div>
                )}
              </div>
            </div>


            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-green-600 mr-2" />
                System Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sensors</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Water Pump</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    irrigationStatus ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {irrigationStatus ? 'Active' : 'Standby'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Connectivity</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Strong</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Battery Level</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
