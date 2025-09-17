import cropData from './cropData.json';

export interface CropAnalysis {
  cropName: string;
  healthScore: number;
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  deviations: Array<{
    parameter: string;
    current: number;
    optimal: number;
    deviation: number;
    severity: 'low' | 'medium' | 'high';
  }>;
  recommendations: string[];
  predictedYield: 'excellent' | 'good' | 'fair' | 'poor';
}

export class CropAnalysisEngine {
  private static calculateDeviation(current: number, optimal: number, min: number, max: number): number {
    if (current >= min && current <= max) {
      return Math.abs(current - optimal) / optimal * 100;
    }
    
    if (current < min) {
      return ((min - current) / optimal) * 100;
    }
    
    return ((current - max) / optimal) * 100;
  }

  private static getSeverity(deviation: number): 'low' | 'medium' | 'high' {
    if (deviation <= 10) return 'low';
    if (deviation <= 25) return 'medium';
    return 'high';
  }

  private static getHealthStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    if (score >= 40) return 'poor';
    return 'critical';
  }

  public static analyzeCrop(cropType: string, currentSensorData: any): CropAnalysis {
    const crop = cropData.crops[cropType as keyof typeof cropData.crops];
    if (!crop) {
      throw new Error(`Crop type ${cropType} not found in database`);
    }

    const deviations = [];
    let totalScore = 0;
    const parameters = ['soilMoisture', 'temperature', 'humidity', 'phLevel', 'lightIntensity'];

    // Analyze each parameter
    parameters.forEach(param => {
      const optimal = crop.optimalConditions[param as keyof typeof crop.optimalConditions];
      const current = currentSensorData[param];

      if (optimal && typeof optimal === 'object' && 'ideal' in optimal) {
        const deviation = this.calculateDeviation(
          current,
          optimal.ideal,
          optimal.min,
          optimal.max
        );

        deviations.push({
          parameter: param,
          current,
          optimal: optimal.ideal,
          deviation,
          severity: this.getSeverity(deviation)
        });

        // Calculate score for this parameter (inverse of deviation)
        const paramScore = Math.max(0, 100 - deviation);
        totalScore += paramScore;
      }
    });

    const healthScore = Math.round(totalScore / parameters.length);
    const status = this.getHealthStatus(healthScore);

    // Generate recommendations based on deviations
    const recommendations = this.generateRecommendations(deviations, crop);

    // Predict yield based on health score and historical data
    const predictedYield = this.predictYield(healthScore, crop);

    return {
      cropName: crop.name,
      healthScore,
      status,
      deviations,
      recommendations,
      predictedYield
    };
  }

  private static generateRecommendations(deviations: any[], crop: any): string[] {
    const recommendations = [];

    deviations.forEach(dev => {
      if (dev.severity === 'high') {
        switch (dev.parameter) {
          case 'soilMoisture':
            if (dev.current < dev.optimal) {
              recommendations.push(`Urgent: Increase watering - soil moisture is ${dev.deviation.toFixed(1)}% below optimal`);
            } else {
              recommendations.push(`Urgent: Reduce watering - soil is oversaturated by ${dev.deviation.toFixed(1)}%`);
            }
            break;
          case 'temperature':
            if (dev.current < dev.optimal) {
              recommendations.push(`Consider greenhouse heating - temperature is ${dev.deviation.toFixed(1)}% below optimal`);
            } else {
              recommendations.push(`Provide shade or cooling - temperature is ${dev.deviation.toFixed(1)}% above optimal`);
            }
            break;
          case 'humidity':
            if (dev.current < dev.optimal) {
              recommendations.push(`Increase humidity through misting or mulching`);
            } else {
              recommendations.push(`Improve ventilation to reduce excess humidity`);
            }
            break;
          case 'phLevel':
            if (dev.current < dev.optimal) {
              recommendations.push(`Add lime to increase soil pH`);
            } else {
              recommendations.push(`Add sulfur or organic matter to lower soil pH`);
            }
            break;
          case 'lightIntensity':
            if (dev.current < dev.optimal) {
              recommendations.push(`Consider supplemental lighting or pruning for better light exposure`);
            } else {
              recommendations.push(`Provide shade during peak sun hours`);
            }
            break;
        }
      } else if (dev.severity === 'medium') {
        recommendations.push(`Monitor ${dev.parameter} - currently ${dev.deviation.toFixed(1)}% from optimal`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('All parameters are within optimal range - maintain current conditions');
    }

    return recommendations;
  }

  private static predictYield(healthScore: number, crop: any): 'excellent' | 'good' | 'fair' | 'poor' {
    // Factor in historical performance
    const historicalAverage = crop.historicalData?.lastWeek?.reduce((acc: number, day: any) => {
      const yieldScore = day.yield === 'excellent' ? 100 : 
                        day.yield === 'good' ? 80 : 
                        day.yield === 'fair' ? 60 : 40;
      return acc + yieldScore;
    }, 0) / (crop.historicalData?.lastWeek?.length || 1);

    const combinedScore = (healthScore * 0.7) + (historicalAverage * 0.3);

    if (combinedScore >= 90) return 'excellent';
    if (combinedScore >= 75) return 'good';
    if (combinedScore >= 60) return 'fair';
    return 'poor';
  }

  public static getOptimalConditions(cropType: string) {
    const crop = cropData.crops[cropType as keyof typeof cropData.crops];
    return crop?.optimalConditions || null;
  }

  public static getAllCrops() {
    return Object.keys(cropData.crops);
  }

  public static getCropData(cropType: string) {
    return cropData.crops[cropType as keyof typeof cropData.crops] || null;
  }
}