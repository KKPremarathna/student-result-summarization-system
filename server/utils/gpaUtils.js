const AdminResult = require('../models/AdminResult');
const Subject = require('../models/Subject');

/**
 * Calculates the GPA for a student given their registration number.
 * @param {string} studentRegNum
 * @returns {Promise<Object>}
 */
const calculateStudentGPA = async(studentRegNum) => {
    const results = await AdminResult.find({ studentRegNum: studentRegNum.toUpperCase() });

    if (!results || results.length === 0) {
        return { gpa: 0, totalCredits: 0, coursesCount: 0 };
    }

    const courseCodes = [...new Set(results.map(r => r.courseCode))];
    const subjects = await Subject.find({ courseCode: { $in: courseCodes } });

    const creditsMap = {};
    subjects.forEach(sub => {
        creditsMap[sub.courseCode] = sub.credit;
    });

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
        'E': 0.0
    };

    let totalQualityPoints = 0;
    let totalCredits = 0;

    results.forEach(result => {
        const courseCode = result.courseCode;
        const grade = result.grade.toUpperCase();
        const credits = creditsMap[courseCode];

        if (credits !== undefined && gradePoints[grade] !== undefined) {
            totalQualityPoints += (gradePoints[grade] * credits);
            totalCredits += credits;
        }
    });

    const gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : 0;

    return {
        gpa: parseFloat(gpa),
        totalCredits,
        coursesCount: results.length
    };
};

module.exports = {
    calculateStudentGPA
};