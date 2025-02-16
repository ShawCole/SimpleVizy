import React, { useCallback, useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import { B2BData, B2CData, DatasetType } from '../types/data';
import { validateCSVColumns, cleanData, validateDataTypes } from '../utils/validation';

interface FileUploadProps {
  type: DatasetType;
  onDataLoaded: (data: B2BData[] | B2CData[], fileName: string) => void;
}

export default function FileUpload({ type, onDataLoaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const parseCSV = useCallback((file: File) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            const errorMessage = results.errors
              .map(err => `Row ${err.row}: ${err.message}`)
              .join(', ');
            setError(`CSV parsing errors: ${errorMessage}`);
            setIsLoading(false);
            return;
          }

          const columnError = validateCSVColumns(results.meta.fields || [], type);
          if (columnError) {
            setError(columnError);
            setIsLoading(false);
            return;
          }

          const cleanedData = cleanData(results.data, type);
          if (cleanedData.length === 0) {
            setError('No valid data rows found after cleaning');
            setIsLoading(false);
            return;
          }

          const dataError = validateDataTypes(cleanedData, type);
          if (dataError) {
            setError(dataError);
            setIsLoading(false);
            return;
          }

          onDataLoaded(cleanedData, file.name.replace('.csv', ''));
          setSuccess(true);
        } catch (err) {
          setError('Error processing data: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
          setIsLoading(false);
        }
      },
      error: (error) => {
        setError('Error reading file: ' + error.message);
        setIsLoading(false);
      },
    });
  }, [onDataLoaded, type]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'text/csv') {
        parseCSV(file);
      } else {
        setError('Please upload a CSV file');
      }
    },
    [parseCSV]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        parseCSV(file);
      }
    },
    [parseCSV]
  );

  const getStateStyles = () => {
    if (success) return 'border-green-400 bg-green-50';
    if (error) return 'border-red-400 bg-red-50';
    if (isLoading) return 'border-blue-400 bg-blue-50';
    return 'border-gray-200 hover:border-blue-400 bg-gradient-to-br from-white to-gray-50';
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`w-full max-w-md p-8 rounded-xl shadow-lg border-2 border-dashed transition-all cursor-pointer group ${getStateStyles()}`}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        className="hidden"
        id={`file-upload-${type}`}
      />
      <label
        htmlFor={`file-upload-${type}`}
        className="flex flex-col items-center gap-4 cursor-pointer"
      >
        <div className={`p-4 rounded-full ${success ? 'bg-green-100' : error ? 'bg-red-100' : 'bg-blue-50 group-hover:bg-blue-100'} transition-colors`}>
          {success ? (
            <CheckCircle className="w-8 h-8 text-green-500" />
          ) : error ? (
            <AlertCircle className="w-8 h-8 text-red-500" />
          ) : isLoading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-blue-500 group-hover:text-blue-600" />
          )}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Upload {type.toUpperCase()} Data
          </h3>
          {error ? (
            <p className="text-sm text-red-600 max-w-xs">{error}</p>
          ) : success ? (
            <p className="text-sm text-green-600">File uploaded successfully!</p>
          ) : (
            <p className="text-sm text-gray-500">
              {isLoading ? 'Processing...' : 'Drag and drop your CSV file here, or click to select'}
            </p>
          )}
        </div>
      </label>
    </div>
  );
}