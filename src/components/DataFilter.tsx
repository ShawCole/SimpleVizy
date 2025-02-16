import React, { useMemo, useState, useEffect } from 'react';
import { Download, Eye, EyeOff } from 'lucide-react';
import { DatasetType } from '../types/data';
import { exportToCSV } from '../utils/exportUtils';

interface DataFilterProps {
  availableColumns: string[];
  activeColumns: Set<string>;
  onColumnSelect: (column: string) => void;
  type: DatasetType;
  data: any[];
  fileName: string;
  onDataFiltered: (filteredData: any[], showUnknowns: boolean) => void;
  showUnknowns: boolean;
}

interface SubFilterState {
  [column: string]: Set<string>;
}

const B2B_SUB_FILTERABLE_COLUMNS = [
  'COMPANY_INDUSTRY',
  'JOB_TITLE',
  'COMPANY_EMPLOYEE_COUNT',
  'COMPANY_REVENUE',
  'SENIORITY_LEVEL',
  'EMAIL'
];

const B2C_SUB_FILTERABLE_COLUMNS = [
  'AGE_RANGE',
  'GENDER',
  'MARRIED',
  'CHILDREN',
  'INCOME_RANGE',
  'NET_WORTH',
  'EMAIL'
];

const EMAIL_TYPES = {
  'PERSONAL_EMAIL': 'Personal Email',
  'BUSINESS_EMAIL': 'Business Email'
};

const DISPLAY_NAME_MAPPINGS: Record<string, Record<string, string>> = {
  'GENDER': {
    'F': 'Female',
    'M': 'Male',
    'U': 'Unknown'
  },
  'MARRIED': {
    'Y': 'Yes',
    'N': 'No'
  },
  'CHILDREN': {
    'Y': 'Yes',
    'N': 'No'
  }
};

const SORT_ORDER: Record<string, string[]> = {
  'GENDER': ['Female', 'Male', 'Unknown'],
  'MARRIED': ['Yes', 'No'],
  'CHILDREN': ['Yes', 'No'],
  'EMAIL': ['Personal Email', 'Business Email'],
  'COMPANY_EMPLOYEE_COUNT': [
    '1 to 10',
    '11 to 25',
    '26 to 50',
    '51 to 100',
    '101 to 250',
    '251 to 500',
    '501 to 1000',
    '1001 to 5000',
    '5001 to 10000',
    '10000+'
  ],
  'COMPANY_REVENUE': [
    'Under 1 Million',
    '1 Million to 5 Million',
    '5 Million to 10 Million',
    '10 Million to 25 Million',
    '25 Million to 50 Million',
    '50 Million to 100 Million',
    '100 Million to 250 Million',
    '250 Million to 500 Million',
    '500 Million to 1 Billion',
    '1 Billion and Over'
  ],
  'INCOME_RANGE': [
    'Less than $20k',
    '$20k - $45k',
    '$45k - $60k',
    '$60k - $75k',
    '$75k - $100k',
    '$100k - $150k',
    '$150k - $200k',
    '$200k - $250k',
    '$250k+'
  ],
  'NET_WORTH': [
    '-$20k to -$2.5k',
    '-$2.5k to $2.5k',
    '$2.5k to $25k',
    '$25k to $50k',
    '$50k to $75k',
    '$75k to $100k',
    '$100k to $150k',
    '$150k to $250k',
    '$250k to $375k',
    '$375k to $500k',
    '$500k to $750k',
    '$750k to $1M',
    '$1M+'
  ]
};

const COLUMN_DISPLAY_NAMES: Record<string, string> = {
  'PERSONAL_EMAIL': 'EMAIL',
  'BUSINESS_EMAIL': 'EMAIL'
};

export default function DataFilter({ 
  availableColumns, 
  activeColumns,
  onColumnSelect,
  type,
  data,
  fileName,
  onDataFiltered,
  showUnknowns
}: DataFilterProps) {
  const [selectedSubFilters, setSelectedSubFilters] = useState<SubFilterState>({});

  const handleExport = () => {
    const baseFileName = `${fileName} - ${type.toUpperCase()}`;
    const columnNames = Array.from(activeColumns).map(col => col.replace(/_/g, ' ')).join(' - ');
    const exportFileName = columnNames ? `${baseFileName} - ${columnNames}` : baseFileName;
    
    const filteredData = filterDataByAllFilters(data);
    exportToCSV(filteredData, exportFileName, type);
  };

  const getDisplayValue = (column: string, value: string): string => {
    if (column === 'EMAIL') {
      return EMAIL_TYPES[value as keyof typeof EMAIL_TYPES] || value;
    }
    if (DISPLAY_NAME_MAPPINGS[column]) {
      return DISPLAY_NAME_MAPPINGS[column][value] || value;
    }
    return value;
  };

  const getRawValue = (column: string, displayValue: string): string => {
    if (column === 'EMAIL') {
      const entry = Object.entries(EMAIL_TYPES).find(([_, display]) => display === displayValue);
      return entry ? entry[0] : displayValue;
    }
    if (DISPLAY_NAME_MAPPINGS[column]) {
      const mapping = DISPLAY_NAME_MAPPINGS[column];
      const entry = Object.entries(mapping).find(([_, display]) => display === displayValue);
      return entry ? entry[0] : displayValue;
    }
    return displayValue;
  };

  const handleSubFilterClick = (column: string, value: string) => {
    setSelectedSubFilters(prev => {
      const newState = { ...prev };
      if (!newState[column]) {
        newState[column] = new Set([value]);
      } else {
        const newSet = new Set(newState[column]);
        if (newSet.has(value)) {
          newSet.delete(value);
          if (newSet.size === 0) {
            delete newState[column];
          } else {
            newState[column] = newSet;
          }
        } else {
          newSet.add(value);
          newState[column] = newSet;
        }
      }
      return newState;
    });
  };

  const handleColumnSelect = (column: string) => {
    onColumnSelect(column);
    
    if (!activeColumns.has(column)) {
      const values = getUniqueValues(column);
      setSelectedSubFilters(prev => ({
        ...prev,
        [column]: new Set(values)
      }));
    } else {
      setSelectedSubFilters(prev => {
        const newState = { ...prev };
        delete newState[column];
        return newState;
      });
    }
  };

  const handleSelectAll = (column: string) => {
    const values = getUniqueValues(column);
    setSelectedSubFilters(prev => ({
      ...prev,
      [column]: new Set(values)
    }));
  };

  const handleSelectNone = (column: string) => {
    setSelectedSubFilters(prev => {
      const newState = { ...prev };
      delete newState[column];
      return newState;
    });
  };

  const filterDataByAllFilters = (data: any[]): any[] => {
    return data.filter(item => {
      return Object.entries(selectedSubFilters).every(([column, values]) => {
        if (column === 'EMAIL') {
          return Array.from(values).some(value => {
            const field = value === 'Personal Email' ? 'PERSONAL_EMAIL' : 'BUSINESS_EMAIL';
            return item[field] && item[field].length > 0;
          });
        }
        const rawValues = Array.from(values).map(v => getRawValue(column, v));
        return rawValues.includes(item[column]);
      });
    });
  };

  useEffect(() => {
    const filteredData = filterDataByAllFilters(data);
    onDataFiltered(filteredData, showUnknowns);
  }, [data, selectedSubFilters, showUnknowns, onDataFiltered]);

  const getUniqueValues = (column: string) => {
    if (column === 'EMAIL') {
      return ['Personal Email', 'Business Email'];
    }

    const values = new Set<string>();
    data.forEach(item => {
      if (item[column] && typeof item[column] === 'string') {
        values.add(item[column]);
      }
    });

    const valuesArray = Array.from(values);

    if (SORT_ORDER[column]) {
      return valuesArray.sort((a, b) => {
        const aDisplay = getDisplayValue(column, a);
        const bDisplay = getDisplayValue(column, b);
        const aIndex = SORT_ORDER[column].indexOf(aDisplay);
        const bIndex = SORT_ORDER[column].indexOf(bDisplay);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    return valuesArray.sort();
  };

  const filteredData = filterDataByAllFilters(data);

  const isSubFilterable = (column: string): boolean => {
    const subFilterableColumns = type === 'b2b'
      ? B2B_SUB_FILTERABLE_COLUMNS
      : B2C_SUB_FILTERABLE_COLUMNS;
    return subFilterableColumns.includes(
      column === 'PERSONAL_EMAIL' || column === 'BUSINESS_EMAIL' ? 'EMAIL' : column
    );
  };

  const getColumnDisplayName = (column: string): string => {
    return COLUMN_DISPLAY_NAMES[column] || column.replace(/_/g, ' ');
  };

  const normalizeColumn = (column: string): string => {
    return column === 'PERSONAL_EMAIL' || column === 'BUSINESS_EMAIL' ? 'EMAIL' : column;
  };

  const sortedColumns = useMemo(() => {
    if (type === 'b2c') {
      const columnOrder = [
        'AGE_RANGE',
        'GENDER',
        'MARRIED',
        'CHILDREN',
        'INCOME_RANGE',
        'NET_WORTH',
        'EMAIL'
      ];
      return availableColumns.sort((a, b) => {
        const aIndex = columnOrder.indexOf(normalizeColumn(a));
        const bIndex = columnOrder.indexOf(normalizeColumn(b));
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }
    return availableColumns;
  }, [availableColumns, type]);

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Filter {type.toUpperCase()} Data by Available Fields
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => onDataFiltered(filteredData, !showUnknowns)}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
              showUnknowns 
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showUnknowns ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                HIDE UNKNOWNS
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                SHOW UNKNOWNS
              </>
            )}
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Filtered Data ({filteredData.length.toLocaleString()} records)
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {sortedColumns.map((column) => (
            <button
              key={column}
              onClick={() => handleColumnSelect(normalizeColumn(column))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeColumns.has(normalizeColumn(column))
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {getColumnDisplayName(column)}
            </button>
          ))}
        </div>

        {Array.from(activeColumns).map(column => (
          isSubFilterable(column) && (
            <div key={column} className="mt-4 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Filter by {column.toLowerCase()}:
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectAll(column)}
                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleSelectNone(column)}
                    className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {getUniqueValues(column).map((value) => (
                  <button
                    key={value}
                    onClick={() => handleSubFilterClick(column, value)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      selectedSubFilters[column]?.has(value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {getDisplayValue(column, value)}
                  </button>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}