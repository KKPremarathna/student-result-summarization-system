/**
 * Normalizes a registration number by removing slashes and converting to uppercase.
 * Example: "2021/E/001" -> "2021E001"
 * @param {string} regNo 
 * @returns {string} normalized registration number
 */
const normalizeRegNo = (regNo) => {
    if (!regNo) return "";
    return regNo.replace(/\//g, "").toUpperCase().trim();
};

/**
 * Extracts and normalizes the registration number from a university email.
 * Example: "2022e500@eng.jfn.ac.lk" -> "2022E500"
 * @param {string} email 
 * @returns {string} normalized regNo or empty string
 */
const extractRegNoFromEmail = (email) => {
    if (!email || !email.includes("@")) return "";
    const prefix = email.split("@")[0];
    // Strict check: must start with 2 and have 3 digits, then optional slash, 'e'/'E', optional slash, and at least 3 digits.
    if (/^2\d{3}\/?e\/?\d{3,}$/i.test(prefix)) {
        return prefix.toUpperCase();
    }
    return "";
};

/**
 * Generates a regex pattern to match a regNo with or without slashes.
 * Example: "2022E500" -> /^2022\/?E\/?500$/i
 */
const generateRegNoRegex = (regNo) => {
    const normalized = normalizeRegNo(regNo);
    if (!normalized) return null;
    
    // Create a pattern like 2021/?E/?001
    // This assumes the format is Year(4) Char(1) Number(3+)
    const year = normalized.substring(0, 4);
    const middle = normalized.substring(4, 5);
    const rest = normalized.substring(5);
    
    return new RegExp(`^${year}/?${middle}/?${rest}$`, "i");
};

/**
 * Validates a registration number format.
 * Supports "2021/E/001" and "2021E001"
 * @param {string} regNo 
 * @returns {boolean} true if valid
 */
const isValidRegNum = (regNo) => {
    if (!regNo) return false;
    // Strictly must match 2XXX(optional slash)E(optional slash)XXX (or more numbers)
    const regex = /^2\d{3}\/?E\/?\d{3,}$/i;
    return regex.test(regNo.trim());
};

module.exports = { normalizeRegNo, extractRegNoFromEmail, generateRegNoRegex, isValidRegNum };