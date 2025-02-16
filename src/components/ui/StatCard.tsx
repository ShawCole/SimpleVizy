import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: number;
}

interface StatCardProps {
  title: string;
  items: StatItem[];
  icon: LucideIcon;
}

export function StatCard({ title, items, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600">{item.label}</span>
            <span className="text-lg font-semibold text-gray-900">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}