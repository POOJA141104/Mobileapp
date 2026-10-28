/**
 * Indian Rupee (INR) Formatter Utility
 * Converts standard currency amounts to Indian format with ₹ symbol.
 */

export const formatINR = (amount, options = {}) => {
  const {
    showSign = false,
    fractionDigits = 2,
    prefixSymbol = '₹'
  } = options;

  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${prefixSymbol}0.00`;
  }

  const numeric = Number(amount);
  const isNegative = numeric < 0;
  const absValue = Math.abs(numeric);

  // Format using Indian Numbering System (Lakhs & Crores)
  const formattedNumber = absValue.toLocaleString('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  if (isNegative) {
    return `-${prefixSymbol}${formattedNumber}`;
  }

  if (showSign && numeric > 0) {
    return `+${prefixSymbol}${formattedNumber}`;
  }

  return `${prefixSymbol}${formattedNumber}`;
};

export const parseINR = (str) => {
  if (!str) return 0;
  const cleaned = str.toString().replace(/[^0-9.-]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
};

