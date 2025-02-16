import React from 'react';
import { VerticalBarChart } from '../charts/VerticalBarChart';
import { B2CData } from '../../types/data';
import { transformData } from '../../utils/dataTransformers';

interface FinancialDetailsProps {
  data: B2CData[];
  showUnknowns: boolean;
}

const FINANCIAL_CHARTS = [
  {
    key: 'INCOME_RANGE' as keyof B2CData,
    title: 'Income Distribution',
    color: '#60A5FA'
  },
  {
    key: 'NET_WORTH' as keyof B2CData,
    title: 'Net Worth Distribution',
    color: '#818CF8'
  }
];

export default function FinancialDetails({ data, showUnknowns }: FinancialDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {FINANCIAL_CHARTS.map(chart => (
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