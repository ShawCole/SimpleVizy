import React from 'react';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { B2BData } from '../../types/data';
import { transformData } from '../../utils/dataTransformers';

interface TopHighlightsProps {
  data: B2BData[];
  showUnknowns: boolean;
}

const HIGHLIGHT_CHARTS = [
  {
    key: 'COMPANY_INDUSTRY' as keyof B2BData,
    title: 'Industries',
    color: '#60A5FA',
    initialDisplay: 5,
    maxDisplay: 15
  },
  {
    key: 'JOB_TITLE' as keyof B2BData,
    title: 'Job Titles',
    color: '#818CF8',
    initialDisplay: 5,
    maxDisplay: 15
  },
  {
    key: 'DEPARTMENT' as keyof B2BData,
    title: 'Departments',
    color: '#A78BFA',
    initialDisplay: 5,
    maxDisplay: 15
  },
  {
    key: 'SENIORITY_LEVEL' as keyof B2BData,
    title: 'Seniority Levels',
    color: '#C084FC',
    initialDisplay: 5
  }
];

export default function TopHighlights({ data, showUnknowns }: TopHighlightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {HIGHLIGHT_CHARTS.map(chart => (
        <HorizontalBarChart
          key={chart.key}
          data={transformData(data, chart.key, chart.maxDisplay, showUnknowns)}
          title={chart.title}
          color={chart.color}
          initialDisplay={chart.initialDisplay}
          showUnknowns={showUnknowns}
        />
      ))}
    </div>
  );
}