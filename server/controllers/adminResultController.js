const AdminResult = require('../models/AdminResult');
const Subject = require('../models/Subject');
const FinalResult = require('../models/FinalResult');
const { isValidRegNum } = require('../utils/regUtils');

/**
 * Add final results in batch
 * req.body = { courseCode, semester, batch, lectureId, results: [{ regNum, grade }, ...] }
 */
exports.addBatchResults = async (req, res) => {
    try {
        const { courseCode, semester, batch, lecturerEmail, lectureId, results } = req.body;
        const finalLecturer = lecturerEmail || lectureId;

        if (!courseCode || !semester || !batch || !finalLecturer || !results || !Array.isArray(results)) {
            return res.status(400).json({ message: 'Missing required fields or results array' });
        }

        // Validate all registration numbers first
        for (const item of results) {
            if (!isValidRegNum(item.regNum)) {
                return res.status(400).json({ message: `Invalid registration number format: ${item.regNum}. Expected 20XX/E/xxx` });
            }
        }

        // Standardize Semester format (e.g., "Semester 01" -> "1")
        const standardizedSemester = semester.replace(/\D/g, '').replace(/^0+/, '') || semester;

        const formattedResults = results.map(item => ({
            courseCode: courseCode.toUpperCase(),
            semester: standardizedSemester,
            batch: batch.toUpperCase(),
            lectureId: finalLecturer,
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

//Delete a single student result by ID
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

// Get results for a specific subject/batch/semester from the published AdminResult collection
exports.getResults = async (req, res) => {
    try {
        const { courseCode, batch, semester } = req.query;

        if (!courseCode || !batch || !semester) {
            return res.status(400).json({ message: 'Missing query parameters' });
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

/**
 * NEW: Import results from the FinalResult collection (Lecturer finalized data)
 * GET /api/admin/import-results?courseCode=CS3042&batch=2021/22&semester=1
 */
exports.importFromDepartment = async (req, res) => {
    try {
        const { courseCode, batch, semester } = req.query;

        if (!courseCode || !batch || !semester) {
            return res.status(400).json({ message: 'Missing query parameters' });
        }

        // 1. Normalize Input for Search
        const searchBatch = batch.trim();
        const searchSem = semester.trim();
        
        // 2. Case-insensitive Regex for flexible matching
        const batchRegex = new RegExp(`^${searchBatch}$`, "i");
        const semRegex = new RegExp(`^${searchSem}$`, "i");
        
        // Helper to extract numbers for fallback matching (e.g., "Semester 01" -> "1")
        const getNumeric = (s) => s.replace(/\D/g, '').replace(/^0+/, '') || s;

        console.log(`[Import] Searching for: ${courseCode.toUpperCase()}, Batch: ${searchBatch}, Sem: ${searchSem}`);

        // 3. Find the subject ID
        let subject = await Subject.findOne({
            courseCode: courseCode.toUpperCase(),
            batch: batchRegex,
            semester: semRegex
        });

        if (!subject) {
            // FALLBACK 1: Try numeric matching (maybe they typed '01' but DB has '1' or vice versa)
            const allSubjects = await Subject.find({ courseCode: courseCode.toUpperCase() });
            
            subject = allSubjects.find(s => 
                s.batch.toLowerCase() === searchBatch.toLowerCase() && 
                getNumeric(s.semester) === getNumeric(searchSem)
            );

            if (!subject) {
                // FALLBACK 2: Find any subject with this code to give helpful error
                const anyBatchMatch = allSubjects.find(s => s.batch.toLowerCase() === searchBatch.toLowerCase());
                
                let message = `No department record found for subject ${courseCode} / Batch ${searchBatch}.`;
                if (anyBatchMatch) {
                    message = `Found subject ${courseCode} for batch ${anyBatchMatch.batch}, but the Semester in our records is "${anyBatchMatch.semester}" instead of "${searchSem}". Try changing your Semester input.`;
                } else if (allSubjects.length > 0) {
                    const batches = allSubjects.map(s => s.batch).join(', ');
                    message = `Subject ${courseCode} found, but for different Batches: [${batches}]. Please check your Batch input.`;
                }
                
                return res.status(404).json({ message });
            }
        }

        // 2. Fetch all finalized results from this subject
        const departmentalResults = await FinalResult.find({ subject: subject._id })
            .select('studentENo grade')
            .sort({ studentENo: 1 });

        if (departmentalResults.length === 0) {
            return res.status(404).json({ message: `Subject exists, but no finalized results found for ${subject.batch} Semester ${subject.semester}.` });
        }

        // 3. Format for the Admin compilation UI
        const results = departmentalResults.map(r => ({
            regNum: r.studentENo,
            grade: r.grade
        }));

        res.status(200).json({
            success: true,
            message: `Successfully imported ${results.length} results from department records.`,
            data: results
        });
    } catch (error) {
        console.error("[Internal Import Error]", error);
        res.status(500).json({ message: error.message });
    }
};
