import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
}

interface HorizontalBarChartProps {
  data: ChartData[];
  title: string;
  color: string;
  initialDisplay?: number;
  showUnknowns?: boolean;
}

export function HorizontalBarChart({ 
  data, 
  title, 
  color,
  initialDisplay = 5,
  showUnknowns = false
}: HorizontalBarChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chartHeight, setChartHeight] = useState(300);
  const [labelWidth, setLabelWidth] = useState(120);
  const containerRef = useRef<HTMLDivElement>(null);

  const isIndustriesChart = title === 'Industries';
  const isDepartmentsChart = title === 'Departments';
  const isJobTitlesChart = title === 'Job Titles';
  const isSeniorityChart = title === 'Seniority Levels';
  const isAgeChart = title === 'Age Distribution';
  const isGenderChart = title === 'Gender Distribution';
  const isB2BChart = isIndustriesChart || isDepartmentsChart || isJobTitlesChart || isSeniorityChart;

  // Modified logic to handle unknown values
  const unknownData = data.filter(item => item.name === 'Unknown');
  const regularData = data.filter(item => item.name !== 'Unknown');

  const getDisplayData = () => {
    // Special handling for Age Distribution chart
    if (isAgeChart) return data;
    
    // Handle B2B charts
    if (isB2BChart) {
      // When showing unknowns
      if (showUnknowns) {
        // If expanded, show all data including unknowns
        if (isExpanded) {
          return [...regularData, ...unknownData];
        }
        // If collapsed, show initial display count plus unknowns
        return [...regularData.slice(0, initialDisplay), ...unknownData];
      }
      // When not showing unknowns
      return isExpanded ? regularData : regularData.slice(0, initialDisplay);
    }

    // Handle non-B2B charts
    if (!showUnknowns) {
      return isExpanded ? regularData : regularData.slice(0, initialDisplay);
    }
    return isExpanded 
      ? [...regularData, ...unknownData]
      : [...regularData.slice(0, initialDisplay), ...unknownData];
  };

  const displayData = getDisplayData();
  const hasMoreData = !isAgeChart && regularData.length > initialDisplay;

  // Adjust bar size and gap based on chart type and state
  const barSize = isGenderChart ? 64 : (isAgeChart ? 32 : (isExpanded ? 16 : 44));
  const barGap = (() => {
    if (isB2BChart && showUnknowns) {
      return isExpanded ? 5 : 10;
    }
    return isGenderChart ? 32 : (isAgeChart ? 16 : (isExpanded ? 3 : 8));
  })();

  // Calculate dynamic label width based on content
  useEffect(() => {
    const calculateLabelWidth = () => {
      const maxLabelLength = Math.max(...displayData.map(item => item.name.length));
      // Optimized character width for departments
      const charWidth = (() => {
        if (isDepartmentsChart) {
          return isExpanded ? 7.2 : 5.6;
        }
        if (isIndustriesChart) {
          return isExpanded ? 7.2 : 6.2;
        }
        return 6.5;
      })();

      // Minimal padding for departments
      const padding = (() => {
        if (isDepartmentsChart) {
          return isExpanded ? 24 : 2;
        }
        return isExpanded ? 24 : 8;
      })();

      const calculatedWidth = Math.ceil(maxLabelLength * charWidth) + padding;
      
      // Adjusted width ranges for departments
      let finalWidth = calculatedWidth;
      if (isDepartmentsChart) {
        finalWidth = isExpanded 
          ? Math.max(Math.min(calculatedWidth, 220), 160)
          : Math.max(Math.min(calculatedWidth, 130), 90);
      } else if (isIndustriesChart) {
        finalWidth = isExpanded 
          ? Math.max(Math.min(calculatedWidth, 220), 160)
          : Math.max(Math.min(calculatedWidth, 160), 120);
      } else {
        finalWidth = Math.max(Math.min(calculatedWidth, 180), 120);
      }
      
      setLabelWidth(finalWidth);
    };

    calculateLabelWidth();
  }, [displayData, isIndustriesChart, isDepartmentsChart, isExpanded]);

  useEffect(() => {
    if (isGenderChart || isAgeChart) {
      setChartHeight(300);
    } else if (isExpanded) {
      const heightPerItem = barSize + barGap;
      const totalHeight = Math.max(300, displayData.length * heightPerItem);
      setChartHeight(totalHeight);
    } else {
      const heightPerItem = barSize + barGap;
      const totalItems = displayData.length;
      setChartHeight(Math.max(200, totalItems * heightPerItem));
    }
  }, [isExpanded, isAgeChart, isGenderChart, displayData.length, barSize, barGap]);

  // Calculate chart margins dynamically
  const getChartMargins = () => {
    const baseMargin = { top: 4, bottom: 16 };
    const rightMargin = 24;
    
    // Optimized left margin calculation
    const leftMargin = (() => {
      if (isDepartmentsChart) {
        return isExpanded ? -8 : -20;
      }
      if (isIndustriesChart) {
        if (isExpanded) {
          return -8;
        } else {
          const maxLabelLength = Math.max(...displayData.map(item => item.name.length));
          return -12 + (maxLabelLength > 25 ? 4 : 0);
        }
      }
      return isExpanded ? 0 : -8;
    })();

    return {
      ...baseMargin,
      left: leftMargin,
      right: rightMargin
    };
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6"
      ref={containerRef}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        {hasMoreData && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 inline mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 inline mr-1" />
                Show More
              </>
            )}
          </button>
        )}
      </div>
      <div 
        className="transition-all duration-300 ease-in-out overflow-y-auto"
        style={{ height: `${chartHeight}px` }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={displayData} 
            layout="vertical"
            margin={getChartMargins()}
            barSize={barSize}
            barGap={barGap}
          >
            <XAxis 
              type="number"
              tickLine={true}
              axisLine={true}
              height={24}
              tickMargin={4}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={labelWidth}
              tick={{ 
                fontSize: (isIndustriesChart || isDepartmentsChart) && isExpanded ? 11 : 12,
                fill: '#374151',
                textAnchor: 'end',
                dx: (() => {
                  if (isDepartmentsChart) {
                    return isExpanded ? -12 : -2;
                  }
                  return isExpanded ? -12 : -6;
                })()
              }}
              interval={0}
              tickLine={true}
              tickSize={4}
              axisLine={true}
            />
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill={color}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}