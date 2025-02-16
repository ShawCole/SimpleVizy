import React from 'react';
import { B2CData } from '../types/data';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import { transformData } from '../utils/dataTransformers';

interface B2CVisualizationsProps {
  data: B2CData[];
  activeColumn: string | null;
}

const VISUALIZATIONS = [
  {
    key: 'AGE_RANGE' as keyof B2CData,
    title: 'Age Distribution',
    type: 'bar' as const,
    color: '#4F46E5'
  },
  {
    key: 'GENDER' as keyof B2CData,
    title: 'Gender Distribution',
    type: 'pie' as const,
    variant: 'semi-doughnut' as const
  },
  {
    key: 'MARRIED' as keyof B2CData,
    title: 'Marital Status',
    type: 'pie' as const,
    variant: 'semi-doughnut' as const
  },
  {
    key: 'INCOME_RANGE' as keyof B2CData,
    title: 'Income Distribution',
    type: 'bar' as const,
    vertical: true,
    color: '#10B981'
  },
  {
    key: 'CHILDREN' as keyof B2CData,
    title: 'Children Status',
    type: 'pie' as const,
    variant: 'semi-doughnut' as const
  },
  {
    key: 'NET_WORTH' as keyof B2CData,
    title: 'Net Worth Distribution',
    type: 'bar' as const,
    vertical: true,
    color: '#7C3AED'
  }
];

export default function B2CVisualizations({ data }: B2CVisualizationsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {VISUALIZATIONS.map(viz => {
        const chartData = transformData(data, viz.key);
        
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
            variant={viz.variant}
          />
        );
      })}
    </div>
  );
}