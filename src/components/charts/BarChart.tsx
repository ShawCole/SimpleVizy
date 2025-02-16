import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
  color?: string;
  vertical?: boolean;
}

export default function BarChart({ data, title, color = '#4F46E5', vertical = false }: BarChartProps) {
  if (!data.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart 
            data={data} 
            layout={vertical ? 'vertical' : 'horizontal'}
          >
            {vertical ? (
              <>
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
              </>
            ) : (
              <>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
              </>
            )}
            <Tooltip />
            <Bar 
              dataKey="value" 
              fill={color} 
              radius={vertical ? [0, 4, 4, 0] : [4, 4, 0, 0]} 
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}