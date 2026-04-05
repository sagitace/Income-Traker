// Format number as PH Peso
export const formatPeso = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Get PH Peso symbol
export const PESO_SYMBOL = '₱';
