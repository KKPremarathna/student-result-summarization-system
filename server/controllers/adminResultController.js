const FinalResult = require('../models/FinalResult');

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

        const result = await FinalResult.bulkWrite(bulkOps);

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