import React from 'react';
import { VerticalBarChart } from '../charts/VerticalBarChart';
import { B2BData } from '../../types/data';
import { transformData } from '../../utils/dataTransformers';

interface CompanyDetailsProps {
  data: B2BData[];
  showUnknowns: boolean;
}

const COMPANY_CHARTS = [
  {
    key: 'COMPANY_EMPLOYEE_COUNT' as keyof B2BData,
    title: 'Company Size Distribution',
    color: '#60A5FA'
  },
  {
    key: 'COMPANY_REVENUE' as keyof B2BData,
    title: 'Company Revenue Distribution',
    color: '#818CF8'
  }
];

export default function CompanyDetails({ data, showUnknowns }: CompanyDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {COMPANY_CHARTS.map(chart => (
        <VerticalBarChart
          key={chart.key}
          data={transformData(data, chart.key, undefined, showUnknowns)}
          title={chart.title}
          color={chart.color}
        />
      ))}
    </div>
  );
}