/**
 * Normalizes a registration number by removing slashes and converting to uppercase.
 * Example: "2021/E/001" -> "2021E001"
 */
export const normalizeRegNo = (regNo) => {
    if (!regNo) return "";
    return regNo.replace(/\//g, "").toUpperCase().trim();
};

/**
 * Extracts and normalizes the registration number from a university email.
 * Example: "2022e050@eng.jfn.ac.lk" -> "2022E050"
 */
export const extractRegNoFromEmail = (email) => {
    if (!email || !email.includes("@")) return "";
    const prefix = email.split("@")[0].toUpperCase();
    // Strict check: must start with 2, have 3 digits, optional slash, 'E', optional slash, and at least 3 digits.
    if (/^2\d{3}\/?E\/?\d{3,}$/i.test(prefix)) {
        return prefix;
    }
    return "";
};

/**
 * Validates if the given string is a strict E-Number (e.g., 2022E050 or 2022/E/050)
 */
export const isValidRegNum = (regNo) => {
    if (!regNo) return false;
    const regex = /^2\d{3}\/?E\/?\d{3,}$/i;
    return regex.test(regNo.trim());
};
/**
 * Formats a normalized registration number into the standard slash format.
 * Example: "2022E050" -> "2022/E/050"
 */
export const formatRegNo = (regNo) => {
    const normalized = normalizeRegNo(regNo);
    
    // If it's not a valid E-number, return as is (to avoid crashing existing non-compliant data)
    if (!isValidRegNum(regNo)) {
        return normalized || regNo;
    }
    
    // We know it matches /^2\d{3}E\d{3,}$/i
    const year = normalized.substring(0, 4);
    const char = normalized.substring(4, 5); // This will be 'E'
    const number = normalized.substring(5);
    
    return `${year}/${char}/${number}`;
};
