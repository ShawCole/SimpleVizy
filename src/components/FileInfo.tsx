import React from 'react';
import { FileText, Database } from 'lucide-react';

interface FileInfoProps {
  b2bFileName: string;
  b2cFileName: string;
  b2bRecords?: number;
  b2cRecords?: number;
}

export default function FileInfo({ b2bFileName, b2cFileName, b2bRecords, b2cRecords }: FileInfoProps) {
  const hasB2BData = b2bFileName && b2bRecords;
  const hasB2CData = b2cFileName && b2cRecords;

  if (!hasB2BData && !hasB2CData) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-500" />
        Uploaded Files
      </h3>
      <div className="space-y-4">
        {hasB2BData && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">{b2bFileName}.csv</p>
                <p className="text-sm text-blue-700">B2B Dataset</p>
              </div>
            </div>
            <span className="text-sm font-medium text-blue-700">
              {b2bRecords.toLocaleString()} records
            </span>
          </div>
        )}
        {hasB2CData && (
          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="font-medium text-indigo-900">{b2cFileName}.csv</p>
                <p className="text-sm text-indigo-700">B2C Dataset</p>
              </div>
            </div>
            <span className="text-sm font-medium text-indigo-700">
              {b2cRecords.toLocaleString()} records
            </span>
          </div>
        )}
      </div>
    </div>
  );
}