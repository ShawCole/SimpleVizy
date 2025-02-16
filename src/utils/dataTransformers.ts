import { B2BData, B2CData } from '../types/data';

const COMPANY_SIZE_ORDER = [
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
];

const REVENUE_ORDER = [
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
];

const AGE_RANGE_ORDER = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65 and older'
];

const INCOME_RANGE_ORDER = [
  'Less than $20,000',
  '$20,000 to $44,999',
  '$45,000 to $59,999',
  '$60,000 to $74,999',
  '$75,000 to $99,999',
  '$100,000 to $149,999',
  '$150,000 to $199,999',
  '$200,000 to $249,000',
  '$250,000+'
];

const NET_WORTH_ORDER = [
  '-$20,000 to -$2,500',
  '-$2,499 to $2,499',
  '$2,500 to $24,999',
  '$25,000 to $49,999',
  '$50,000 to $74,999',
  '$75,000 to $99,999',
  '$100,000 to $149,999',
  '$150,000 to $249,999',
  '$250,000 to $374,999',
  '$375,000 to $499,999',
  '$500,000 to $749,999',
  '$750,000 to $999,999',
  'More than $1,000,000'
];

const REVENUE_LABELS: Record<string, string> = {
  'Under 1 Million': '< $1M',
  '1 Million to 5 Million': '$1M - $5M',
  '5 Million to 10 Million': '$5M - $10M',
  '10 Million to 25 Million': '$10M - $25M',
  '25 Million to 50 Million': '$25M - $50M',
  '50 Million to 100 Million': '$50M - $100M',
  '100 Million to 250 Million': '$100M - $250M',
  '250 Million to 500 Million': '$250M - $500M',
  '500 Million to 1 Billion': '$500M - $1B',
  '1 Billion and Over': '> $1B'
};

const INCOME_RANGE_LABELS: Record<string, string> = {
  'Less than $20,000': '< $20k',
  '$20,000 to $44,999': '$20k - $45k',
  '$45,000 to $59,999': '$45k - $60k',
  '$60,000 to $74,999': '$60k - $75k',
  '$75,000 to $99,999': '$75k - $100k',
  '$100,000 to $149,999': '$100k - $150k',
  '$150,000 to $199,999': '$150k - $200k',
  '$200,000 to $249,000': '$200k - $250k',
  '$250,000+': '> $250k'
};

const NET_WORTH_LABELS: Record<string, string> = {
  '-$20,000 to -$2,500': '-$20k to -$2.5k',
  '-$2,499 to $2,499': '-$2.5k to $2.5k',
  '$2,500 to $24,999': '$2.5k to $25k',
  '$25,000 to $49,999': '$25k to $50k',
  '$50,000 to $74,999': '$50k to $75k',
  '$75,000 to $99,999': '$75k to $100k',
  '$100,000 to $149,999': '$100k to $150k',
  '$150,000 to $249,999': '$150k to $250k',
  '$250,000 to $374,999': '$250k to $375k',
  '$375,000 to $499,999': '$375k to $500k',
  '$500,000 to $749,999': '$500k to $750k',
  '$750,000 to $999,999': '$750k to $1M',
  'More than $1,000,000': '$1M+'
};

export function transformData(
  data: any[], 
  key: keyof (B2BData | B2CData), 
  limit?: number,
  showUnknowns: boolean = false
) {
  const counts: Record<string, number> = {};
  let unknownCount = 0;
  
  data.forEach(row => {
    const value = row[key];
    if (value && value.trim() !== '') {
      counts[value] = (counts[value] || 0) + 1;
    } else {
      unknownCount++;
    }
  });

  let transformed = Object.entries(counts)
    .map(([name, value]) => ({ 
      name: key === 'COMPANY_REVENUE' 
        ? (REVENUE_LABELS[name] || name)
        : key === 'NET_WORTH'
        ? (NET_WORTH_LABELS[name] || name)
        : key === 'INCOME_RANGE'
        ? (INCOME_RANGE_LABELS[name] || name)
        : name,
      value,
      originalName: name
    }));

  // Sort the data before applying the limit
  transformed = sortTransformedData(transformed, key);

  // Apply limit to regular data if specified
  if (limit) {
    transformed = transformed.slice(0, limit);
  }

  // Add unknown count if enabled and there are unknowns
  if (showUnknowns && unknownCount > 0) {
    transformed.push({
      name: 'Unknown',
      value: unknownCount,
      originalName: 'Unknown'
    });
  }

  return transformed.map(({ name, value }) => ({ name, value }));
}

function sortTransformedData(
  data: Array<{ name: string; value: number; originalName: string }>,
  key: keyof (B2BData | B2CData)
) {
  if (key === 'COMPANY_EMPLOYEE_COUNT') {
    return data.sort((a, b) => {
      if (a.originalName === 'Unknown') return 1;
      if (b.originalName === 'Unknown') return -1;
      const aIndex = COMPANY_SIZE_ORDER.indexOf(a.originalName);
      const bIndex = COMPANY_SIZE_ORDER.indexOf(b.originalName);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  } else if (key === 'COMPANY_REVENUE') {
    return data.sort((a, b) => {
      if (a.originalName === 'Unknown') return 1;
      if (b.originalName === 'Unknown') return -1;
      const aIndex = REVENUE_ORDER.indexOf(a.originalName);
      const bIndex = REVENUE_ORDER.indexOf(b.originalName);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  } else if (key === 'AGE_RANGE') {
    return data.sort((a, b) => {
      if (a.originalName === 'Unknown') return 1;
      if (b.originalName === 'Unknown') return -1;
      const aIndex = AGE_RANGE_ORDER.indexOf(a.originalName);
      const bIndex = AGE_RANGE_ORDER.indexOf(b.originalName);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  } else if (key === 'INCOME_RANGE') {
    return data.sort((a, b) => {
      if (a.originalName === 'Unknown') return 1;
      if (b.originalName === 'Unknown') return -1;
      const aIndex = INCOME_RANGE_ORDER.indexOf(a.originalName);
      const bIndex = INCOME_RANGE_ORDER.indexOf(b.originalName);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  } else if (key === 'NET_WORTH') {
    return data.sort((a, b) => {
      if (a.originalName === 'Unknown') return 1;
      if (b.originalName === 'Unknown') return -1;
      const aIndex = NET_WORTH_ORDER.indexOf(a.originalName);
      const bIndex = NET_WORTH_ORDER.indexOf(b.originalName);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  } else {
    return data.sort((a, b) => {
      if (a.originalName === 'Unknown') return 1;
      if (b.originalName === 'Unknown') return -1;
      return b.value - a.value;
    });
  }
}