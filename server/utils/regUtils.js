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
 * Validates a registration number format.
 * Supports "2021/E/001" and "2021E001"
 * @param {string} regNo 
 * @returns {boolean} true if valid
 */
const isValidRegNum = (regNo) => {
    if (!regNo) return false;
    // Regex matches 2021/E/001 or 2021E001
    const regex = /^(\d{4}\/[A-Z]\/\d{3,})|(\d{4}[A-Z]\d{3,})$/i;
    return regex.test(regNo.trim());
};

/**
 * Validates email format.
 * @param {string} email 
 * @returns {boolean} true if valid
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Converts a registration number to a university email address.
 * Example: "2021/E/140" -> "2021e140@eng.jfn.ac.lk"
 * @param {string} regNum 
 * @returns {string} university email
 */
const convertRegNumToEmail = (regNum) => {
    if (!isValidRegNum(regNum)) {
        throw new Error('Invalid registration number format. Use 20XX/E/XXX or 20XXEXXX');
    }
    const normalized = normalizeRegNo(regNum);
    const year = normalized.substring(0, 4);
    const char = normalized.substring(4, 5).toLowerCase();
    const num = normalized.substring(5);
    return `${year}${char}${num}@eng.jfn.ac.lk`;
};

/**
 * Generates an array of emails from a registration number range.
 * @param {string} startRegNum 
 * @param {string} endRegNum 
 * @returns {string[]} array of emails
 */
const generateEmailsFromRange = (startRegNum, endRegNum) => {
    if (!isValidRegNum(startRegNum) || !isValidRegNum(endRegNum)) {
        throw new Error('Invalid range registration number format.');
    }

    const startNormalized = normalizeRegNo(startRegNum);
    const endNormalized = normalizeRegNo(endRegNum);

    const year = startNormalized.substring(0, 4);
    const char = startNormalized.substring(4, 5);
    const startNum = parseInt(startNormalized.substring(5), 10);
    const endNum = parseInt(endNormalized.substring(5), 10);

    if (year !== endNormalized.substring(0, 4) || char !== endNormalized.substring(4, 5)) {
        throw new Error('Batch and department must match in range addition.');
    }

    if (startNum > endNum) {
        throw new Error('Start number must be less than or equal to end number.');
    }

    const emails = [];
    for (let i = startNum; i <= endNum; i++) {
        const formattedNum = i.toString().padStart(3, '0');
        emails.push(`${year}${char.toLowerCase()}${formattedNum}@eng.jfn.ac.lk`);
    }
    return emails;
};

module.exports = { normalizeRegNo, extractRegNoFromEmail, generateRegNoRegex, isValidRegNum, isValidEmail, convertRegNumToEmail, generateEmailsFromRange };