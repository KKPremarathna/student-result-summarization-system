const Subject = require("../models/Subject");
const IncourseResult = require("../models/IncourseResult");
const FinalResult = require("../models/FinalResult");

function calcGrade(mark) {
  if (mark >= 85) return "A+";
  if (mark >= 70) return "A";
  if (mark >= 65) return "A-";
  if (mark >= 60) return "B+";
  if (mark >= 55) return "B";
  if (mark >= 50) return "B-";
  if (mark >= 45) return "C+";
  if (mark >= 40) return "C";
  if (mark >= 35) return "D";
  return "E";
}

// GET /api/final-results/incourse-list?subject=<subjectId>
exports.getIncourseList = async (req, res) => {
  try {
    const { subject: subjectId } = req.query;
    if (!subjectId) {
      return res.status(400).json({ message: "subject query param is required" });
    }

    const subject = await Subject.findOne({ _id: subjectId, createdBy: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found or not yours" });
    }

    const incourseResults = await IncourseResult.find({
      subject: subjectId,
      createdBy: req.user._id
    }).sort({ studentENo: 1 });

    const finalResults = await FinalResult.find({
      subject: subjectId,
      createdBy: req.user._id
    });

    const finalMap = {};
    for (const fr of finalResults) {
      finalMap[fr.studentENo] = fr;
    }

    const combined = incourseResults.map((ir) => ({
      incourseResultId: ir._id,
      studentENo: ir.studentENo,
      incourseTotal: ir.incourseTotal,
      endExamMark: finalMap[ir.studentENo]?.endExamMark ?? null,
      finalMark: finalMap[ir.studentENo]?.finalMark ?? null,
      grade: finalMap[ir.studentENo]?.grade ?? null,
      finalResultId: finalMap[ir.studentENo]?._id ?? null
    }));

    return res.json({
      subject,
      incourseWeight: 100 - (subject.assessments.endExamWeight || 0),
      endExamWeight: subject.assessments.endExamWeight || 0,
      results: combined
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// POST /api/final-results/save (upsert)
exports.saveResult = async (req, res) => {
  try {
    const { subject: subjectId, studentENo, endExamMark } = req.body;

    if (!subjectId || !studentENo) {
      return res.status(400).json({ message: "subject and studentENo are required" });
    }
    if (endExamMark === undefined || endExamMark === null) {
      return res.status(400).json({ message: "endExamMark is required" });
    }
    if (typeof endExamMark !== "number" || endExamMark < 0 || endExamMark > 100) {
      return res.status(400).json({ message: "endExamMark must be a number between 0 and 100" });
    }

    const subject = await Subject.findOne({ _id: subjectId, createdBy: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found or not yours" });
    }

    const incourseResult = await IncourseResult.findOne({
      subject: subjectId,
      studentENo: studentENo.toUpperCase(),
      createdBy: req.user._id
    });
    if (!incourseResult) {
      return res.status(404).json({ message: "No incourse result found. Add incourse marks first." });
    }

    // finalMark = incourseTotal + endExamMark × (endExamWeight / 100)
    const endExamWeight = subject.assessments.endExamWeight || 0;
    const finalMark = Math.round((incourseResult.incourseTotal + endExamMark * (endExamWeight / 100)) * 100) / 100;
    const grade = calcGrade(finalMark);

    const existing = await FinalResult.findOne({
      subject: subjectId,
      studentENo: studentENo.toUpperCase()
    });

    if (existing) {
      const updated = await FinalResult.findByIdAndUpdate(
        existing._id,
        { incourseTotal: incourseResult.incourseTotal, endExamMark, finalMark, grade },
        { new: true, runValidators: true }
      );
      return res.json({ message: "Updated", result: updated });
    } else {
      const result = await FinalResult.create({
        subject: subjectId,
        incourseResult: incourseResult._id,
        createdBy: req.user._id,
        studentENo: studentENo.toUpperCase(),
        incourseTotal: incourseResult.incourseTotal,
        endExamMark,
        finalMark,
        grade
      });
      return res.status(201).json({ message: "Created", result });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/final-results?subject=<subjectId>
exports.getResults = async (req, res) => {
  try {
    const { subject: subjectId } = req.query;
    if (!subjectId) {
      return res.status(400).json({ message: "subject query param is required" });
    }

    const subject = await Subject.findOne({ _id: subjectId, createdBy: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found or not yours" });
    }

    const results = await FinalResult.find({ subject: subjectId, createdBy: req.user._id })
      .sort({ studentENo: 1 });

    return res.json({
      subject,
      incourseWeight: 100 - (subject.assessments.endExamWeight || 0),
      endExamWeight: subject.assessments.endExamWeight || 0,
      results
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/final-results/by-eno?subject=<subjectId>&studentENo=2022E050
exports.getResultByENo = async (req, res) => {
  try {
    const { subject: subjectId, studentENo } = req.query;
    if (!subjectId || !studentENo) {
      return res.status(400).json({ message: "subject and studentENo are required" });
    }

    const result = await FinalResult.findOne({
      subject: subjectId,
      studentENo: studentENo.toUpperCase(),
      createdBy: req.user._id
    });

    if (!result) return res.status(404).json({ message: "Final result not found" });
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// PUT /api/final-results/:id
exports.updateResult = async (req, res) => {
  try {
    const existing = await FinalResult.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!existing) return res.status(404).json({ message: "Final result not found" });

    const endExamMark = req.body.endExamMark ?? existing.endExamMark;
    if (typeof endExamMark !== "number" || endExamMark < 0 || endExamMark > 100) {
      return res.status(400).json({ message: "endExamMark must be between 0 and 100" });
    }

    const subject = await Subject.findById(existing.subject);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const incourseResult = await IncourseResult.findById(existing.incourseResult);
    const incourseTotal = incourseResult ? incourseResult.incourseTotal : existing.incourseTotal;

    const endExamWeight = subject.assessments.endExamWeight || 0;
    const finalMark = Math.round((incourseTotal + endExamMark * (endExamWeight / 100)) * 100) / 100;
    const grade = calcGrade(finalMark);

    const updated = await FinalResult.findByIdAndUpdate(
      req.params.id,
      { incourseTotal, endExamMark, finalMark, grade },
      { new: true, runValidators: true }
    );

    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// DELETE /api/final-results/:id
exports.deleteResult = async (req, res) => {
  try {
    const deleted = await FinalResult.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Final result not found" });
    return res.json({ message: "Deleted", id: req.params.id });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
