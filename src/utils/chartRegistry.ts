import { B2BData, B2CData } from '../types/data';
import { transformData } from './dataTransformers';

export interface ChartDefinition {
    id: string;
    type: 'b2b' | 'b2c';
    title: string;
    component: React.ComponentType<any>;
    getProps: (data: B2BData[] | B2CData[]) => any;
}

export const chartRegistry: ChartDefinition[] = [
    {
        id: 'industries',
        type: 'b2b',
        title: 'Industries',
        component: HorizontalBarChart,
        getProps: (data: B2BData[]) => ({
            data: transformData(data, 'COMPANY_INDUSTRY'),
            color: '#60A5FA',
            initialDisplay: 5
        })
    },
    // Add more chart definitions
];

export function getAvailableCharts(type: 'b2b' | 'b2c') {
    return chartRegistry.filter(chart => chart.type === type);
} 