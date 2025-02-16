import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface VerticalBarChartProps {
  data: ChartData[];
  title: string;
  color: string;
}

export function VerticalBarChart({ data, title, color }: VerticalBarChartProps) {
  const isFinancialChart = title.includes('Income') || title.includes('Net Worth');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ 
              left: 20, 
              right: 20, 
              top: 20, 
              bottom: 16
            }}
          >
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              interval={0}
              tick={{ 
                fontSize: isFinancialChart ? 12 : 12 // Increased from 10 to 12 for financial charts
              }}
              tickMargin={4}
            />
            <YAxis 
              tick={{
                fontSize: isFinancialChart ? 12 : 11 // Also increased Y-axis font size for consistency
              }}
            />
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}