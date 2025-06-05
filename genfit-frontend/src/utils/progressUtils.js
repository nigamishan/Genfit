import dayjs from 'dayjs';
import { 
  METRIC_DISPLAY_NAMES, 
  METRIC_UNITS, 
  CHART_COLORS, 
  WORKOUT_DAYS 
} from '../constants/progressConstants';

/**
 * Format metric type for display
 * @param {string} metricType - Raw metric type
 * @returns {string} Formatted display name
 */
export const formatMetricType = (metricType) => {
  return METRIC_DISPLAY_NAMES[metricType] || metricType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Get unit for a metric type
 * @param {string} metricType - Metric type
 * @returns {string} Unit for the metric
 */
export const getMetricUnit = (metricType) => {
  return METRIC_UNITS[metricType] || '';
};

/**
 * Generate chart data for a specific metric type
 * @param {string} metricType - Metric type
 * @param {Array} trendData - Array of trend data points
 * @returns {Object} Chart.js compatible data object
 */
export const generateChartData = (metricType, trendData) => {
  if (!trendData || trendData.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: formatMetricType(metricType),
        data: [],
        borderColor: CHART_COLORS[metricType] || 'rgb(75, 192, 192)',
        backgroundColor: CHART_COLORS[metricType] || 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
      }]
    };
  }

  const labels = trendData.map(entry => dayjs(entry.date).format('MMM D'));
  const data = trendData.map(entry => entry.value);

  return {
    labels,
    datasets: [{
      label: formatMetricType(metricType),
      data,
      borderColor: CHART_COLORS[metricType] || 'rgb(75, 192, 192)',
      backgroundColor: CHART_COLORS[metricType] || 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false,
      pointBackgroundColor: CHART_COLORS[metricType] || 'rgb(75, 192, 192)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };
};

/**
 * Generate chart options for progress charts
 * @param {string} metricType - Metric type
 * @returns {Object} Chart.js options object
 */
export const generateChartOptions = (metricType) => {
  const unit = getMetricUnit(metricType);
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: formatMetricType(metricType),
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} ${unit}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: `${formatMetricType(metricType)} (${unit})`
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };
};

/**
 * Generate workout volume chart data
 * @param {Array} volumeData - Daily volume data from API
 * @returns {Object} Chart.js compatible data object
 */
export const generateVolumeChartData = (volumeData) => {
  if (!volumeData || volumeData.length === 0) {
    // Return empty data for all 7 days
    const labels = WORKOUT_DAYS.map(day => day.short);
    const data = new Array(7).fill(0);
    
    return {
      labels,
      datasets: [{
        label: 'Total Sets',
        data,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    };
  }

  // Create data for all 7 days, filling in zeros for missing days
  const dailyData = new Array(7).fill(0);
  const labels = WORKOUT_DAYS.map(day => day.short);

  volumeData.forEach(dayData => {
    if (dayData.day >= 1 && dayData.day <= 7) {
      dailyData[dayData.day - 1] = dayData.total_sets || 0;
    }
  });

  return {
    labels,
    datasets: [{
      label: 'Total Sets',
      data: dailyData,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false
    }]
  };
};

/**
 * Generate workout volume chart options
 * @returns {Object} Chart.js options object
 */
export const generateVolumeChartOptions = () => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Workout Volume',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} sets`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Sets'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Day of Week'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };
};

/**
 * Calculate progress statistics for a metric
 * @param {Object} summaryData - Summary data from API
 * @returns {Object} Formatted statistics
 */
export const calculateProgressStats = (summaryData) => {
  if (!summaryData) {
    return {
      latest: 'No data',
      min: 'No data',
      max: 'No data',
      average: 'No data',
      latestDate: null
    };
  }

  return {
    latest: `${summaryData.latest_value} ${summaryData.unit}`,
    min: `${summaryData.min_value} ${summaryData.unit}`,
    max: `${summaryData.max_value} ${summaryData.unit}`,
    average: `${parseFloat(summaryData.average_value).toFixed(2)} ${summaryData.unit}`,
    latestDate: summaryData.latest_date ? dayjs(summaryData.latest_date).format('MMM D, YYYY') : null
  };
};

/**
 * Create an empty progress entry with default values
 * @param {string} defaultMetricType - Default metric type to set
 * @returns {Object} Empty progress entry object
 */
export const createEmptyProgressEntry = (defaultMetricType = 'weight') => {
  return {
    metric_type: defaultMetricType,
    value: '',
    unit: getMetricUnit(defaultMetricType),
    recorded_at: dayjs(),
    notes: ''
  };
};

/**
 * Validate progress entry data
 * @param {Object} entry - Progress entry to validate
 * @returns {Object} Validation result with isValid flag and error message
 */
export const validateProgressEntry = (entry) => {
  if (!entry.metric_type) {
    return { isValid: false, error: 'Metric type is required' };
  }

  if (!entry.value || isNaN(parseFloat(entry.value))) {
    return { isValid: false, error: 'Valid numeric value is required' };
  }

  if (parseFloat(entry.value) < 0) {
    return { isValid: false, error: 'Value cannot be negative' };
  }

  if (!entry.recorded_at) {
    return { isValid: false, error: 'Recording date is required' };
  }

  return { isValid: true, error: null };
};

/**
 * Format date for display in progress entries
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatProgressDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

/**
 * Calculate total weekly workout volume
 * @param {Array} volumeData - Daily volume data
 * @returns {number} Total weekly sets
 */
export const calculateTotalWeeklyVolume = (volumeData) => {
  if (!volumeData || volumeData.length === 0) return 0;
  
  return volumeData.reduce((total, dayData) => {
    return total + (dayData.total_sets || 0);
  }, 0);
}; 