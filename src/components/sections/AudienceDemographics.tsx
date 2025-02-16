import React from 'react';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { DoughnutChart } from '../charts/DoughnutChart';
import { B2CData } from '../../types/data';
import { transformData } from '../../utils/dataTransformers';

interface AudienceDemographicsProps {
  data: B2CData[];
  showUnknowns: boolean;
}

const DEMOGRAPHIC_CHARTS = [
  {
    key: 'GENDER' as keyof B2CData,
    title: 'Gender Distribution',
    type: 'bar' as const,
    color: '#60A5FA'
  },
  {
    key: 'AGE_RANGE' as keyof B2CData,
    title: 'Age Distribution',
    type: 'bar' as const,
    color: '#818CF8'
  },
  {
    key: 'MARRIED' as keyof B2CData,
    title: 'Marital Status',
    type: 'doughnut' as const
  },
  {
    key: 'CHILDREN' as keyof B2CData,
    title: 'Children',
    type: 'doughnut' as const
  }
];

export default function AudienceDemographics({ data, showUnknowns }: AudienceDemographicsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {DEMOGRAPHIC_CHARTS.map(chart => (
        chart.type === 'bar' ? (
          <HorizontalBarChart
            key={chart.key}
            data={transformData(data, chart.key, undefined, showUnknowns)}
            title={chart.title}
            color={chart.color}
          />
        ) : (
          <DoughnutChart
            key={chart.key}
            data={transformData(data, chart.key, undefined, showUnknowns)}
            title={chart.title}
            variant="semi"
          />
        )
      ))}
    </div>
  );
}