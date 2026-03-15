/**
 * Converts a student registration number to an email address.
 * @param {string} regNum
 * @returns {string}
 */
const convertRegNumToEmail = (regNum) => {
    if (!regNum) return null;

    // format: 20XX/E/XXX
    const regExp = /^20\d{2}\/E\/\d{3}$/;
    if (!regExp.test(regNum)) {
        throw new Error('Invalid registration number format. Expected 20XX/E/xxx (e.g., 2021/E/140)');
    }

    const parts = regNum.split('/');
    const year = parts[0];
    const num = parts[2];

    return `${year}e${num}@eng.jfn.ac.lk`;
};

/**
 * Converts a student email address back to a registration number.
 * @param {string} email
 * @returns {string}
 */
const convertEmailToRegNum = (email) => {
    if (!email) return null;
    
    // format: 20XXexxx@eng.jfn.ac.lk
    const emailExp = /^20\d{2}e\d{3}@eng\.jfn\.ac\.lk$/;
    if (!emailExp.test(email)) {
        throw new Error('Invalid email format for student. Expected 20XXexxx@eng.jfn.ac.lk');
    }

    const year = email.substring(0, 4);
    const num = email.substring(5, 8); // skipping 'e'

    return `${year}/E/${num}`;
};

/**
 * array of emails from a range of registration numbers.
 * @param {string} startRegNum
 * @param {string} endRegNum
 * @returns {string[]}
 */

function generateEmailsFromRange(startRegNum, endRegNum) {
    const regExp = /^20\d{2}\/E\/\d{3}$/;

    if (!regExp.test(startRegNum) || !regExp.test(endRegNum)) {
        throw new Error('Invalid registration number format. Expected 20XX/E/xxx (e.g., 2021/E/140)');
    }

    const startParts = startRegNum.split('/');
    const endParts = endRegNum.split('/');

    if (startParts[0] !== endParts[0]) {
        throw new Error('Start and end registration numbers must be from the same year');
    }

    const year = startParts[0];
    const startNum = parseInt(startParts[2], 10);
    const endNum = parseInt(endParts[2], 10);

    if (isNaN(startNum) || isNaN(endNum)) {
        throw new Error('Registration number must end with a numeric value');
    }

    if (startNum > endNum) {
        throw new Error('Start registration number must be less than or equal to end registration number');
    }

    const emails = [];
    for (let i = startNum; i <= endNum; i++) {
        const paddingLength = startParts[2].length;
        const formattedNum = i.toString().padStart(paddingLength, '0');
        emails.push(`${year}e${formattedNum}@eng.jfn.ac.lk`);
    }

    return emails;
}

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidRegNum = (regNum) => {
    // Strictly enforce 20XX/E/XXX format
    const regExp = /^20\d{2}\/E\/\d{3}$/;
    return regExp.test(regNum);
};

module.exports = {
    convertRegNumToEmail,
    convertEmailToRegNum,
    generateEmailsFromRange,
    isValidEmail,
    isValidRegNum,
};