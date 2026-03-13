const AdminFinalResult = require('../models/FinalResult');
const { isValidRegNum } = require('../utils/regUtils');

/**
 * Add final results in batch
 * req.body = { courseCode, semester, batch, lectureId, results: [{ regNum, grade }, ...] }
 */
exports.addBatchResults = async(req, res) => {
    try {
        const { courseCode, semester, batch, lectureId, results } = req.body;

        if (!courseCode || !semester || !batch || !lectureId || !results || !Array.isArray(results)) {
            return res.status(400).json({ message: 'Missing required fields or results array' });
        }

        // Validate all registration numbers first
        for (const item of results) {
            if (!isValidRegNum(item.regNum)) {
                return res.status(400).json({ message: `Invalid registration number format: ${item.regNum}. Expected 20XX/E/xxx` });
            }
        }

        const formattedResults = results.map(item => ({
            courseCode: courseCode.toUpperCase(),
            semester,
            batch,
            lectureId,
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

        const result = await AdminFinalResult.bulkWrite(bulkOps);

        res.status(201).json({
            message: 'Results added/updated successfully',
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

//Update a single final result
exports.updateResult = async(req, res) => {
    try {
        const { id } = req.params;
        const { grade, lectureId, courseCode, semester, batch } = req.body;

        const updateData = {};
        if (grade) updateData.grade = grade.toUpperCase();
        if (lectureId) updateData.lectureId = lectureId;
        if (courseCode) updateData.courseCode = courseCode.toUpperCase();
        if (semester) updateData.semester = semester;
        if (batch) updateData.batch = batch;

        const updated = await AdminFinalResult.findByIdAndUpdate(
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