import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface DoughnutChartProps {
  data: ChartData[];
  title: string;
  variant?: 'full' | 'semi';
}

const COLORS = ['#60A5FA', '#818CF8', '#A78BFA', '#C084FC'];

export function DoughnutChart({ data, title, variant = 'full' }: DoughnutChartProps) {
  const isSemi = variant === 'semi';
  const isMaritalOrChildren = title === 'Marital Status' || title === 'Children';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className={`text-lg font-semibold text-gray-800 ${isMaritalOrChildren ? 'mb-2' : 'mb-4'}`}>
        {title}
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: isMaritalOrChildren ? 0 : 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy={isSemi ? "90%" : "50%"}
              startAngle={isSemi ? 180 : 0}
              endAngle={isSemi ? 0 : 360}
              innerRadius="60%"
              outerRadius={isSemi ? "90%" : "80%"}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}