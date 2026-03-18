/**
 * Normalizes batch strings to the "EXX" format (e.g., 2021 -> E21, 2021/22 -> E21).
 * @param {string} batch
 * @returns {string}
 */
const normalizeBatch = (batch) => {
  if (!batch) return "";
  const trimmed = batch.trim().toUpperCase();
  
  // If already in EXX format
  if (/^E\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Look for 4 digit years
  const yearMatch = trimmed.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    return "E" + yearMatch[1].slice(-2);
  }
  
  // Fallback for 2 digit years without 'E' (e.g. "21")
  if (/^\d{2}$/.test(trimmed)) {
    return "E" + trimmed;
  }

  return trimmed;
};

/**
 * Validates if the batch follows the strict EXX format.
 * @param {string} batch 
 * @returns {boolean}
 */
const isValidBatchFormat = (batch) => {
  return /^E\d{2}$/i.test(batch);
};

module.exports = {
  normalizeBatch,
  isValidBatchFormat
};
