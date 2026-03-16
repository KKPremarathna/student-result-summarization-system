const AdminResult = require('../models/AdminResult');
const { isValidRegNum } = require('../utils/regUtils');

/**
 * Add final results in batch
 * req.body = { courseCode, semester, batch, lecturerEmail, results: [{ regNum, grade }, ...] }
 */
exports.addBatchResults = async(req, res) => {
    try {
        const { courseCode, semester, batch, lecturerEmail, results } = req.body;

        if (!courseCode || !semester || !batch || !lecturerEmail || !results || !Array.isArray(results)) {
            return res.status(400).json({ message: 'Missing required fields or results array' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Results array cannot be empty' });
        }

        // Validate all registration numbers first
        for (const item of results) {
            if (!isValidRegNum(item.regNum)) {
                return res.status(400).json({ message: `Invalid registration number format: ${item.regNum}. Expected 20XX/E/xxx` });
            }
            if (!item.grade || item.grade.trim() === '') {
                return res.status(400).json({ message: `Grade is required for ${item.regNum}` });
            }
        }

        const formattedResults = results.map(item => ({
            courseCode: courseCode.toUpperCase(),
            semester,
            batch,
            lecturerEmail: lecturerEmail.toLowerCase(),
            studentRegNum: item.regNum.toUpperCase(),
            grade: item.grade.toUpperCase(),
        }));

        const bulkOps = formattedResults.map(res => ({
            updateOne: {
                filter: {
                    courseCode: res.courseCode,
                    batch: res.batch,
                    semester: res.semester,
                    studentRegNum: res.studentRegNum
                },
                update: { $set: res },
                upsert: true
            }
        }));

        const result = await AdminResult.bulkWrite(bulkOps);

        res.status(201).json({
            message: `Results saved successfully (${result.upsertedCount} added, ${result.modifiedCount} updated)`,
            data: {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
                upsertedCount: result.upsertedCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a single final result
exports.updateResult = async(req, res) => {
    try {
        const { id } = req.params;
        const { grade, lecturerEmail, courseCode, semester, batch } = req.body;

        const updateData = {};
        if (grade) updateData.grade = grade.toUpperCase();
        if (lecturerEmail) updateData.lecturerEmail = lecturerEmail.toLowerCase();
        if (courseCode) updateData.courseCode = courseCode.toUpperCase();
        if (semester) updateData.semester = semester;
        if (batch) updateData.batch = batch;

        const updated = await AdminResult.findByIdAndUpdate(
            id, { $set: updateData }, { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Result not found' });
        }

        res.status(200).json({
            message: 'Result updated successfully',
            data: updated
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a single student result by ID
exports.deleteResult = async(req, res) => {
    try {
        const { id } = req.params;

        const deleted = await AdminResult.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Result not found' });
        }

        res.status(200).json({ message: 'Result deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete all results for a specific subject/batch/semester
exports.deleteSubjectResults = async(req, res) => {
    try {
        const { courseCode, batch, semester } = req.body;

        if (!courseCode || !batch || !semester) {
            return res.status(400).json({ message: 'Please provide courseCode, batch, and semester' });
        }

        const result = await AdminResult.deleteMany({
            courseCode: courseCode.toUpperCase(),
            batch,
            semester
        });

        res.status(200).json({
            message: `${result.deletedCount} results deleted successfully`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get results filtered by courseCode, batch, semester  
exports.getResultsByCourse = async(req, res) => {
    try {
        const { courseCode, batch, semester } = req.query;

        if (!courseCode || !batch || !semester) {
            return res.status(400).json({ message: 'Please provide courseCode, batch, and semester as query params' });
        }

        const results = await AdminResult.find({
            courseCode: courseCode.toUpperCase(),
            batch,
            semester
        }).sort({ studentRegNum: 1 });

        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};