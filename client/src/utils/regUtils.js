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
    const prefix = email.split("@")[0];
    // Basic check to see if it looks like a regNo (starts with year digits)
    if (/^\d{4}[a-zA-Z]/.test(prefix)) {
        return prefix.toUpperCase();
    }
    return "";
};

/**
 * Formats a normalized registration number into the standard slash format.
 * Example: "2022E050" -> "2022/E/050"
 */
export const formatRegNo = (regNo) => {
    const normalized = normalizeRegNo(regNo);
    if (!normalized || normalized.length < 5) return normalized;
    
    const year = normalized.substring(0, 4);
    const char = normalized.substring(4, 5);
    const number = normalized.substring(5);
    
    return `${year}/${char}/${number}`;
};
