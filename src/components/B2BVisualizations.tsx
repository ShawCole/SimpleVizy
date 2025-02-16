import React from 'react';
import { B2BData } from '../types/data';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import { transformData } from '../utils/dataTransformers';

interface B2BVisualizationsProps {
  data: B2BData[];
  activeColumn: string | null;
}

const VISUALIZATIONS = [
  {
    key: 'COMPANY_INDUSTRY' as keyof B2BData,
    title: 'Top Industries',
    type: 'bar' as const,
    limit: 10,
    vertical: true,
    color: '#4F46E5'
  },
  {
    key: 'JOB_TITLE' as keyof B2BData,
    title: 'Top Job Titles',
    type: 'bar' as const,
    limit: 10,
    vertical: true,
    color: '#7C3AED'
  },
  {
    key: 'COMPANY_EMPLOYEE_COUNT' as keyof B2BData,
    title: 'Company Size Distribution',
    type: 'pie' as const
  },
  {
    key: 'SENIORITY_LEVEL' as keyof B2BData,
    title: 'Seniority Level Distribution',
    type: 'pie' as const
  },
  {
    key: 'COMPANY_REVENUE' as keyof B2BData,
    title: 'Revenue Distribution',
    type: 'bar' as const,
    vertical: true,
    color: '#10B981'
  }
];

export default function B2BVisualizations({ data }: B2BVisualizationsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {VISUALIZATIONS.map(viz => {
        const chartData = transformData(data, viz.key, viz.limit);
        
        return viz.type === 'bar' ? (
          <BarChart
            key={viz.key}
            data={chartData}
            title={viz.title}
            color={viz.color}
            vertical={viz.vertical}
          />
        ) : (
          <PieChart
            key={viz.key}
            data={chartData}
            title={viz.title}
          />
        );
      })}
    </div>
  );
}