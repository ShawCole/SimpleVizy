import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { B2BData, B2CData } from '../types/data';

interface ChartConfig {
    id: string;
    type: 'b2b' | 'b2c';
    component: React.ComponentType<any>;
    title: string;
    props: any;
}

interface CustomReportProps {
    b2bData: B2BData[] | null;
    b2cData: B2CData[] | null;
    showUnknowns: boolean;
}

export default function CustomReport({ b2bData, b2cData, showUnknowns }: CustomReportProps) {
    const [selectedCharts, setSelectedCharts] = useState<ChartConfig[]>([]);
    const [availableCharts, setAvailableCharts] = useState<ChartConfig[]>([
        // B2B Charts
        {
            id: 'industries',
            type: 'b2b',
            component: HorizontalBarChart,
            title: 'Industries',
            props: {
                data: b2bData,
                key: 'COMPANY_INDUSTRY',
                color: '#60A5FA'
            }
        },
        // ... add more chart configs
    ]);

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(selectedCharts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setSelectedCharts(items);
    };

    return (
        <div className="p-6">
            <div className="flex gap-6">
                {/* Available Charts Panel */}
                <div className="w-64 bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold mb-4">Available Charts</h3>
                    <div className="space-y-2">
                        {availableCharts.map(chart => (
                            <button
                                key={chart.id}
                                onClick={() => {
                                    setSelectedCharts([...selectedCharts, chart]);
                                    setAvailableCharts(availableCharts.filter(c => c.id !== chart.id));
                                }}
                                className="w-full p-2 text-left hover:bg-gray-50 rounded border"
                            >
                                {chart.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Report Canvas */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="report">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex-1 grid grid-cols-2 gap-6"
                            >
                                {selectedCharts.map((chart, index) => (
                                    <Draggable key={chart.id} draggableId={chart.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white rounded-lg shadow"
                                            >
                                                <div className="p-4 border-b flex justify-between items-center">
                                                    <h4 className="font-medium">{chart.title}</h4>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCharts(selectedCharts.filter(c => c.id !== chart.id));
                                                            setAvailableCharts([...availableCharts, chart]);
                                                        }}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <chart.component {...chart.props} showUnknowns={showUnknowns} />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
} 