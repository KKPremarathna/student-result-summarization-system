const FinalResult = require('../models/FinalResult');
const Subject = require('../models/Subject');

const { generateRegNoRegex } = require('./regUtils');

/**
 * Calculates the GPA for a student given their enrollment number.
 * @param {string} studentENo
 * @returns {Promise<Object>}
 */
const calculateStudentGPA = async(studentENo) => {
    const regNoRegex = generateRegNoRegex(studentENo);
    if (!regNoRegex) return { gpa: 0, totalCredits: 0, coursesCount: 0, studentENo };

    const results = await FinalResult.find({ studentENo: regNoRegex })
        .populate('subject', 'credit');

    if (!results || results.length === 0) {
        return { gpa: 0, totalCredits: 0, coursesCount: 0, studentENo: studentENo };
    }

    // Define grade points mapping
    const gradePoints = {
        'A+': 4.0,
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1.0,
        'E': 0.0,
        'F': 0.0
    };

    let totalQualityPoints = 0;
    let totalCredits = 0;

    results.forEach(result => {
        const grade = (result.afterSenateGrade || result.grade).toUpperCase();
        const credits = result.subject ? result.subject.credit : 0;

        if (credits > 0 && gradePoints[grade] !== undefined) {
            totalQualityPoints += (gradePoints[grade] * credits);
            totalCredits += credits;
        }
    });

    const gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : 0;

    return {
        gpa: parseFloat(gpa),
        totalCredits,
        coursesCount: results.length,
        studentENo: studentENo.toUpperCase()
    };
};

module.exports = {
    calculateStudentGPA
};