import { B2BData, B2CData } from '../types/data';
import Papa from 'papaparse';

export function exportToCSV(
  data: B2BData[] | B2CData[], 
  fileName: string,
  type: 'b2b' | 'b2c'
) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, fileName);
  } else {
    // Other browsers
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}