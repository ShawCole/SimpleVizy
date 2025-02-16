import { B2BData, B2CData, DatasetType } from '../types/data';

const B2B_REQUIRED_COLUMNS = [
  'COMPANY_NAME',
  'COMPANY_INDUSTRY',
  'JOB_TITLE',
  'COMPANY_EMPLOYEE_COUNT',
  'COMPANY_REVENUE',
  'SENIORITY_LEVEL',
  'BUSINESS_EMAIL'
] as const;

const B2C_REQUIRED_COLUMNS = [
  'AGE_RANGE',
  'GENDER',
  'MARRIED',
  'CHILDREN',
  'NET_WORTH',
  'INCOME_RANGE',
  'PERSONAL_EMAIL'
] as const;

export function validateCSVColumns(headers: string[], type: DatasetType): string | null {
  const requiredColumns = type === 'b2b' ? B2B_REQUIRED_COLUMNS : B2C_REQUIRED_COLUMNS;
  const missingColumns = requiredColumns.filter(col => !headers.includes(col));
  
  if (missingColumns.length === requiredColumns.length) {
    return `No valid columns found for ${type.toUpperCase()} data`;
  }
  
  return null;
}

export function validateDataTypes(data: any[], type: DatasetType): string | null {
  try {
    const requiredColumns = type === 'b2b' ? B2B_REQUIRED_COLUMNS : B2C_REQUIRED_COLUMNS;
    const invalidRows = data.filter(row => 
      !requiredColumns.some(column => 
        row[column] !== null && 
        row[column] !== undefined && 
        row[column] !== ''
      )
    );

    if (invalidRows.length > 0) {
      return `Found ${invalidRows.length} rows with no valid required data`;
    }

    return null;
  } catch (error) {
    return 'Error validating data types: ' + (error instanceof Error ? error.message : 'Unknown error');
  }
}

export function cleanData<T extends B2BData | B2CData>(data: any[], type: DatasetType): T[] {
  return data.map(row => {
    Object.keys(row).forEach(key => {
      if (row[key] === '') {
        row[key] = null;
      }
    });
    return row;
  }).filter(row => {
    const requiredColumns = type === 'b2b' ? B2B_REQUIRED_COLUMNS : B2C_REQUIRED_COLUMNS;
    
    // Check if at least one required field has valid data
    return requiredColumns.some(column => {
      const value = row[column];
      return value !== null && value !== undefined && value !== '';
    });
  }) as T[];
}

export function getAvailableColumns(data: any[], type: DatasetType): string[] {
  const allColumns = type === 'b2b' ? B2B_REQUIRED_COLUMNS : B2C_REQUIRED_COLUMNS;
  return allColumns.filter(column => 
    data.some(row => row[column] !== null && row[column] !== undefined && row[column] !== '')
  );
}

export function filterDataByColumn<T>(data: T[], column: string): T[] {
  return data.filter(row => 
    row[column as keyof T] !== null && 
    row[column as keyof T] !== undefined && 
    row[column as keyof T] !== ''
  );
}

export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.toString().replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}