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
    // Basic check to see if it looks like a regNo (starts with year digits)
    if (/^\d{4}/.test(prefix)) {
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
 * Validates a registration number format (20XX/E/XXX).
 * @param {string} regNo 
 * @returns {boolean}
 */
const isValidRegNum = (regNo) => {
    return /^\d{4}\/?[A-Z]\/?\d{3,4}$/i.test(regNo);
};

/**
 * Converts email to a consistent registration number format (20XX/E/XXX).
 */
const convertEmailToRegNum = (email) => {
    const prefix = extractRegNoFromEmail(email); // e.g., 2021E162
    if (!prefix) throw new Error("Invalid student email");
    
    // Convert 2021E162 -> 2021/E/162
    const year = prefix.substring(0, 4);
    const letter = prefix.substring(4, 5);
    const num = prefix.substring(5);
    return `${year}/${letter}/${num}`;
};

module.exports = { 
    normalizeRegNo, 
    extractRegNoFromEmail, 
    generateRegNoRegex, 
    isValidRegNum,
    convertEmailToRegNum 
};