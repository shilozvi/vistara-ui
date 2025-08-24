/**
 * 🎯 Vistara UI - TrendAnalyzer Component
 * "Command your Design."
 * 
 * מנתח מעקב טרנדים מתקדם עם חיזויים סטטיסטיים
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { normalizeStyle } from '../../utils/normalizeStyle';

const TrendAnalyzer = forwardRef(({ 
  // Data
  data = [], // [{ timestamp, value, label? }]
  metrics = ['average', 'trend', 'volatility'], // Which metrics to calculate
  
  // Time analysis
  timeWindow = '7d',
  granularity = 'hour', // 'minute', 'hour', 'day', 'week', 'month'
  
  // Trend detection
  smoothing = 0.3, // Exponential smoothing factor
  trendThreshold = 5, // Minimum % change to detect trend
  seasonality = false, // Detect seasonal patterns
  
  // Visual options
  showChart = true,
  showMetrics = true,
  showPrediction = false,
  showAnnotations = true,
  
  // Chart options
  chartType = 'line', // 'line', 'area', 'candlestick'
  chartHeight = 300,
  showVolume = false,
  
  // Analysis depth
  analysisType = 'basic', // 'basic', 'advanced', 'ml'
  correlationData = [], // For correlation analysis
  
  // Visual variants
  size = 'normal', // 'compact', 'normal', 'expanded'
  theme = 'default', // 'default', 'minimal', 'detailed', 'professional'
  variant = 'default', // 'default', 'outlined', 'filled'
  
  // Callbacks
  onTrendDetected,
  onAnomalyDetected,
  onPeriodSelect,
  
  // Standard props
  className,
  style,
  ...props
}, ref) => {
  
  const [analysis, setAnalysis] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const chartRef = useRef(null);
  
  // Analyze data when it changes
  useEffect(() => {
    if (data.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis delay for real-world feel
    const timeout = setTimeout(() => {
      const results = analyzeData(data);
      setAnalysis(results);
      setIsAnalyzing(false);
      
      // Notify about detected trends
      if (results.trend && Math.abs(results.trend.percentage) >= trendThreshold) {
        onTrendDetected?.(results.trend);
      }
      
      // Notify about anomalies
      if (results.anomalies && results.anomalies.length > 0) {
        onAnomalyDetected?.(results.anomalies);
      }
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [data, smoothing, trendThreshold]);
  
  // Comprehensive data analysis
  const analyzeData = (rawData) => {
    if (rawData.length < 2) return null;
    
    const values = rawData.map(d => d.value).filter(v => typeof v === 'number');
    if (values.length === 0) return null;
    
    // Basic statistics
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues[Math.floor(sortedValues.length / 2)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    // Standard deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Trend analysis using linear regression
    const n = values.length;
    const xValues = values.map((_, i) => i);
    const xSum = xValues.reduce((a, b) => a + b, 0);
    const ySum = sum;
    const xySum = values.reduce((acc, y, i) => acc + (i * y), 0);
    const xSquaredSum = xValues.reduce((acc, x) => acc + (x * x), 0);
    
    const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;
    const trendPercentage = ((slope * (n - 1)) / average) * 100;
    
    // R-squared (coefficient of determination)
    const yMean = average;
    const ssRes = values.reduce((acc, y, i) => {
      const predicted = slope * i + intercept;
      return acc + Math.pow(y - predicted, 2);
    }, 0);
    const ssTot = values.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);
    
    // Volatility (coefficient of variation)
    const volatility = (standardDeviation / average) * 100;
    
    // Moving averages
    const movingAverages = calculateMovingAverages(values);
    
    // Detect anomalies (values beyond 2 standard deviations)
    const anomalies = rawData.filter((d, i) => {
      if (typeof d.value !== 'number') return false;
      const deviation = Math.abs(d.value - average);
      return deviation > (2 * standardDeviation);
    }).map((d, i) => ({
      ...d,
      deviation: Math.abs(d.value - average),
      severity: Math.abs(d.value - average) > (3 * standardDeviation) ? 'high' : 'medium'
    }));
    
    // Seasonality detection (basic)
    const seasonalPatterns = detectSeasonality(rawData);
    
    // Momentum (rate of change)
    const momentum = values.length > 1 ? 
      ((values[values.length - 1] - values[0]) / values[0]) * 100 : 0;
    
    return {
      basic: {
        count: values.length,
        average,
        median,
        min,
        max,
        range,
        sum
      },
      statistics: {
        standardDeviation,
        variance,
        volatility,
        rSquared
      },
      trend: {
        slope,
        intercept,
        percentage: trendPercentage,
        direction: trendPercentage > trendThreshold ? 'up' : 
                   trendPercentage < -trendThreshold ? 'down' : 'flat',
        strength: Math.abs(trendPercentage),
        confidence: rSquared
      },
      movingAverages,
      anomalies,
      seasonalPatterns,
      momentum,
      insights: generateInsights({
        trendPercentage,
        volatility,
        anomalies: anomalies.length,
        momentum,
        rSquared
      })
    };
  };
  
  // Calculate moving averages
  const calculateMovingAverages = (values) => {
    const periods = [5, 10, 20, 50].filter(p => p <= values.length);
    
    return periods.reduce((acc, period) => {
      const ma = [];
      for (let i = period - 1; i < values.length; i++) {
        const slice = values.slice(i - period + 1, i + 1);
        const average = slice.reduce((a, b) => a + b, 0) / slice.length;
        ma.push(average);
      }
      acc[`ma${period}`] = ma;
      return acc;
    }, {});
  };
  
  // Basic seasonality detection
  const detectSeasonality = (data) => {
    if (!seasonality || data.length < 14) return null;
    
    // Group by day of week, hour, etc.
    const patterns = {
      daily: {},
      weekly: {},
      monthly: {}
    };
    
    data.forEach(point => {
      if (!point.timestamp) return;
      
      const date = new Date(point.timestamp);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      const dayOfMonth = date.getDate();
      
      // Daily patterns (by hour)
      if (!patterns.daily[hour]) patterns.daily[hour] = [];
      patterns.daily[hour].push(point.value);
      
      // Weekly patterns (by day of week)
      if (!patterns.weekly[dayOfWeek]) patterns.weekly[dayOfWeek] = [];
      patterns.weekly[dayOfWeek].push(point.value);
      
      // Monthly patterns (by day of month)
      if (!patterns.monthly[dayOfMonth]) patterns.monthly[dayOfMonth] = [];
      patterns.monthly[dayOfMonth].push(point.value);
    });
    
    // Calculate averages for each pattern
    Object.keys(patterns).forEach(patternType => {
      Object.keys(patterns[patternType]).forEach(key => {
        const values = patterns[patternType][key];
        patterns[patternType][key] = {
          average: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length,
          values
        };
      });
    });
    
    return patterns;
  };
  
  // Generate insights based on analysis
  const generateInsights = ({ trendPercentage, volatility, anomalies, momentum, rSquared }) => {
    const insights = [];
    
    // Trend insights
    if (Math.abs(trendPercentage) >= trendThreshold) {
      const direction = trendPercentage > 0 ? 'upward' : 'downward';
      const strength = Math.abs(trendPercentage) > 20 ? 'strong' : 
                      Math.abs(trendPercentage) > 10 ? 'moderate' : 'weak';
      insights.push({
        type: 'trend',
        severity: Math.abs(trendPercentage) > 20 ? 'high' : 'medium',
        message: `${strength} ${direction} trend detected (${trendPercentage.toFixed(1)}%)`,
        confidence: rSquared
      });
    }
    
    // Volatility insights
    if (volatility > 30) {
      insights.push({
        type: 'volatility',
        severity: volatility > 50 ? 'high' : 'medium',
        message: `High volatility detected (${volatility.toFixed(1)}%)`,
        recommendation: 'Consider smoothing or investigating causes'
      });
    }
    
    // Anomaly insights
    if (anomalies > 0) {
      insights.push({
        type: 'anomaly',
        severity: anomalies > 3 ? 'high' : 'medium',
        message: `${anomalies} anomal${anomalies === 1 ? 'y' : 'ies'} detected`,
        recommendation: 'Review outliers for data quality issues'
      });
    }
    
    // Momentum insights
    if (Math.abs(momentum) > 15) {
      const direction = momentum > 0 ? 'positive' : 'negative';
      insights.push({
        type: 'momentum',
        severity: 'medium',
        message: `Strong ${direction} momentum (${momentum.toFixed(1)}%)`,
        recommendation: 'Monitor for potential reversal'
      });
    }
    
    return insights;
  };
  
  // Simple prediction using linear regression
  const generatePredictions = (analysis, periods = 5) => {
    if (!analysis?.trend) return [];
    
    const { slope, intercept } = analysis.trend;
    const lastIndex = data.length - 1;
    const predictions = [];
    
    for (let i = 1; i <= periods; i++) {
      const predictedValue = slope * (lastIndex + i) + intercept;
      predictions.push({
        index: lastIndex + i,
        value: Math.max(0, predictedValue), // Ensure non-negative
        confidence: Math.max(0, analysis.trend.confidence - (i * 0.1)) // Decreasing confidence
      });
    }
    
    return predictions;
  };
  
  // Update predictions when analysis changes
  useEffect(() => {
    if (showPrediction && analysis) {
      const newPredictions = generatePredictions(analysis);
      setPredictions(newPredictions);
    }
  }, [analysis, showPrediction]);
  
  // Container styles
  const getContainerStyles = () => {
    return normalizeStyle({
      fontFamily: 'var(--font-family-base)',
      width: '100%',
      
      // Variant styles
      ...(variant === 'outlined' && {
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-4)'
      }),
      
      ...(variant === 'filled' && {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--space-4)',
        boxShadow: 'var(--shadow-sm)'
      })
    });
  };
  
  // Chart container styles
  const getChartStyles = () => {
    return normalizeStyle({
      width: '100%',
      height: `${chartHeight}px`,
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      marginBottom: 'var(--space-4)',
      position: 'relative',
      overflow: 'hidden'
    });
  };
  
  // Metrics grid styles
  const getMetricsGridStyles = () => {
    return normalizeStyle({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-4)'
    });
  };
  
  // Metric card styles
  const getMetricCardStyles = () => {
    return normalizeStyle({
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-md)',
      padding: 'var(--space-3)',
      textAlign: 'center'
    });
  };
  
  // Render simple chart
  const renderChart = () => {
    if (!showChart || data.length === 0) return null;
    
    const values = data.map(d => d.value).filter(v => typeof v === 'number');
    if (values.length === 0) return null;
    
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;
    
    const chartWidth = 800;
    const chartPadding = 40;
    const plotWidth = chartWidth - (chartPadding * 2);
    const plotHeight = chartHeight - (chartPadding * 2);
    
    // Generate points
    const points = values.map((value, index) => {
      const x = chartPadding + (index / (values.length - 1)) * plotWidth;
      const y = chartPadding + plotHeight - ((value - minValue) / range) * plotHeight;
      return { x, y, value, index };
    });
    
    // Generate trend line
    let trendLine = null;
    if (analysis?.trend) {
      const { slope, intercept } = analysis.trend;
      const startY = chartPadding + plotHeight - ((intercept - minValue) / range) * plotHeight;
      const endY = chartPadding + plotHeight - (((slope * (values.length - 1) + intercept) - minValue) / range) * plotHeight;
      
      trendLine = (
        <line
          x1={chartPadding}
          y1={startY}
          x2={chartPadding + plotWidth}
          y2={endY}
          stroke="var(--color-warning)"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.7"
        />
      );
    }
    
    return (
      <div style={getChartStyles()}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <g key={i}>
              <line
                x1={chartPadding}
                y1={chartPadding + plotHeight * ratio}
                x2={chartPadding + plotWidth}
                y2={chartPadding + plotHeight * ratio}
                stroke="var(--color-border)"
                strokeWidth="1"
                opacity="0.3"
              />
              <text
                x={chartPadding - 10}
                y={chartPadding + plotHeight * ratio + 4}
                textAnchor="end"
                fontSize="10"
                fill="var(--color-text-muted)"
              >
                {(maxValue - (maxValue - minValue) * ratio).toFixed(1)}
              </text>
            </g>
          ))}
          
          {/* Data line */}
          {chartType === 'line' && (
            <polyline
              points={points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
          )}
          
          {/* Data area */}
          {chartType === 'area' && (
            <polygon
              points={[
                `${chartPadding},${chartPadding + plotHeight}`,
                ...points.map(p => `${p.x},${p.y}`),
                `${chartPadding + plotWidth},${chartPadding + plotHeight}`
              ].join(' ')}
              fill="var(--color-primary)"
              fillOpacity="0.2"
              stroke="var(--color-primary)"
              strokeWidth="2"
            />
          )}
          
          {/* Trend line */}
          {trendLine}
          
          {/* Data points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="var(--color-primary)"
              stroke="var(--color-surface)"
              strokeWidth="2"
            />
          ))}
          
          {/* Anomaly markers */}
          {analysis?.anomalies?.map((anomaly, i) => {
            const dataIndex = data.findIndex(d => d.timestamp === anomaly.timestamp);
            if (dataIndex === -1) return null;
            
            const point = points[dataIndex];
            if (!point) return null;
            
            return (
              <circle
                key={`anomaly-${i}`}
                cx={point.x}
                cy={point.y}
                r="6"
                fill="none"
                stroke="var(--color-danger)"
                strokeWidth="2"
                strokeDasharray="3,3"
              />
            );
          })}
        </svg>
      </div>
    );
  };
  
  // Render metrics
  const renderMetrics = () => {
    if (!showMetrics || !analysis) return null;
    
    const metricCards = [];
    
    if (metrics.includes('average')) {
      metricCards.push(
        <div key="average" style={getMetricCardStyles()}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Average</div>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
            {analysis.basic.average.toFixed(2)}
          </div>
        </div>
      );
    }
    
    if (metrics.includes('trend')) {
      const trend = analysis.trend;
      const trendColor = trend.direction === 'up' ? 'var(--color-success)' : 
                        trend.direction === 'down' ? 'var(--color-danger)' : 
                        'var(--color-text-muted)';
      
      metricCards.push(
        <div key="trend" style={getMetricCardStyles()}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Trend</div>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: trendColor }}>
            {trend.percentage.toFixed(1)}%
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            {trend.direction} ({(trend.confidence * 100).toFixed(0)}% conf.)
          </div>
        </div>
      );
    }
    
    if (metrics.includes('volatility')) {
      metricCards.push(
        <div key="volatility" style={getMetricCardStyles()}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Volatility</div>
          <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
            {analysis.statistics.volatility.toFixed(1)}%
          </div>
        </div>
      );
    }
    
    return (
      <div style={getMetricsGridStyles()}>
        {metricCards}
      </div>
    );
  };
  
  // Render insights
  const renderInsights = () => {
    if (!analysis?.insights || analysis.insights.length === 0) return null;
    
    return (
      <div style={normalizeStyle({
        backgroundColor: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-md)',
        padding: 'var(--space-3)'
      })}>
        <h4 style={{
          margin: '0 0 var(--space-2) 0',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)'
        }}>
          Insights
        </h4>
        
        {analysis.insights.map((insight, i) => {
          const severityColors = {
            high: 'var(--color-danger)',
            medium: 'var(--color-warning)',
            low: 'var(--color-info)'
          };
          
          return (
            <div key={i} style={normalizeStyle({
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
              padding: 'var(--space-2)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--border-radius-sm)',
              borderLeft: `3px solid ${severityColors[insight.severity]}`
            })}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-1)'
                }}>
                  {insight.message}
                </div>
                {insight.recommendation && (
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-muted)',
                    fontStyle: 'italic'
                  }}>
                    {insight.recommendation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  if (isAnalyzing) {
    return (
      <div style={normalizeStyle({
        ...getContainerStyles(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      })}>
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <div style={{ marginBottom: 'var(--space-2)' }}>Analyzing trends...</div>
          <div style={{ fontSize: 'var(--font-size-sm)' }}>This may take a moment</div>
        </div>
      </div>
    );
  }
  
  return (
    <div
      ref={ref}
      className={`vistara-trend-analyzer vistara-trend-analyzer--${variant} vistara-trend-analyzer--${size} ${className || ''}`}
      style={{ ...getContainerStyles(), ...style }}
      {...props}
    >
      {/* Header */}
      <div style={normalizeStyle({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--space-4)'
      })}>
        <h3 style={{
          margin: 0,
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)'
        }}>
          Trend Analysis
        </h3>
        
        <div style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)'
        }}>
          {data.length} data points • {timeWindow}
        </div>
      </div>
      
      {/* Chart */}
      {renderChart()}
      
      {/* Metrics */}
      {renderMetrics()}
      
      {/* Insights */}
      {renderInsights()}
    </div>
  );
});

TrendAnalyzer.displayName = 'TrendAnalyzer';

export default TrendAnalyzer;