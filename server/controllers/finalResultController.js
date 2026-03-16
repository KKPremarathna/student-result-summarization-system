const Subject = require("../models/Subject");
const IncourseResult = require("../models/IncourseResult");
const FinalResult = require("../models/FinalResult");
const { isValidRegNum } = require("../utils/regUtils");
const PDFDocument = require("pdfkit-table");
const { normalizeRegNo, extractRegNoFromEmail, generateRegNoRegex } = require("../utils/regUtils");

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

    const incourseFilter = { subject: subjectId, createdBy: req.user._id };
    const finalFilter = { subject: subjectId, createdBy: req.user._id };

    if (req.query.studentENo) {
      const eno = req.query.studentENo.toUpperCase();
      incourseFilter.studentENo = eno;
      finalFilter.studentENo = eno;
    }

    const incourseResults = await IncourseResult.find(incourseFilter).sort({ studentENo: 1 });
    const finalResults = await FinalResult.find(finalFilter);

    const finalMap = {};
    for (const fr of finalResults) {
      finalMap[fr.studentENo] = fr;
    }

    const combined = incourseResults.map((ir) => ({
      incourseResultId: ir._id,
      studentENo: ir.studentENo,
      assignments: ir.assignments,
      quizzes: ir.quizzes,
      labs: ir.labs,
      mid: ir.mid,
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

    if (!isValidRegNum(studentENo)) {
      return res.status(400).json({ message: "Invalid registration number format. Expected 20XX/E/XXX" });
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

// GET /api/final-results/by-eno?subject=<subjectId>&studentENo=2022/E/050
exports.getResultByENo = async (req, res) => {
  try {
    const { subject: subjectId, studentENo } = req.query;
    if (!subjectId || !studentENo) {
      return res.status(400).json({ message: "subject and studentENo are required" });
    }

    if (!isValidRegNum(studentENo)) {
      return res.status(400).json({ message: "Invalid registration number format. Expected 20XX/E/XXX" });
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

// GET /api/final-results/summary?courseCode=<CS3042>&batch=<Y3S1>
exports.getSummary = async (req, res) => {
  try {
    const { courseCode, batch } = req.query;
    if (!courseCode || !batch) {
      return res.status(400).json({ message: "courseCode and batch query params are required" });
    }

    const subject = await Subject.findOne({ 
      courseCode: courseCode.toUpperCase(), 
      batch, 
      createdBy: req.user._id 
    });
    
    if (!subject) {
      return res.status(404).json({ message: "Subject not found or not yours" });
    }

    const subjectId = subject._id;

    const incourseFilter = { subject: subjectId, createdBy: req.user._id };
    const finalFilter = { subject: subjectId, createdBy: req.user._id };

    if (req.query.studentENo) {
      const eno = req.query.studentENo.toUpperCase();
      incourseFilter.studentENo = eno;
      finalFilter.studentENo = eno;
    }

    const incourseResults = await IncourseResult.find(incourseFilter);
    const finalResults = await FinalResult.find(finalFilter);

    const enrolled = incourseResults.length;
    let passed = 0;
    let failed = 0;

    for (const fr of finalResults) {
      // Pass condition: Grade is not E, AND incourse is > 35
      if (fr.grade !== "E" && fr.incourseTotal > 35) {
        passed++;
      } else {
        failed++;
      }
    }
    
    // Students who have incourse marks but no final exam marks are also failed/incomplete
    const studentsWithFinals = finalResults.length;
    failed += (enrolled - studentsWithFinals);

    return res.json({
      enrolled,
      passed,
      failed
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/final-results/download-pdf?courseCode=<CS3042>&batch=<Y3S1>
exports.downloadPdf = async (req, res) => {
  try {
    const { courseCode, batch } = req.query;
    if (!courseCode || !batch) {
      return res.status(400).json({ message: "courseCode and batch query params are required" });
    }

    const subject = await Subject.findOne({ 
      courseCode: courseCode.toUpperCase(), 
      batch, 
      createdBy: req.user._id 
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found or not yours" });
    }

    const subjectId = subject._id;

    const incourseFilter = { subject: subjectId, createdBy: req.user._id };
    const finalFilter = { subject: subjectId, createdBy: req.user._id };

    if (req.query.studentENo) {
      const eno = req.query.studentENo.toUpperCase();
      incourseFilter.studentENo = eno;
      finalFilter.studentENo = eno;
    }

    const incourseResults = await IncourseResult.find(incourseFilter).sort({ studentENo: 1 });
    const finalResults = await FinalResult.find(finalFilter);

    const finalMap = {};
    for (const fr of finalResults) {
      finalMap[fr.studentENo] = fr;
    }

    // Prepare Document
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    
    // Set response headers for PDF download
    res.setHeader('Content-disposition', `attachment; filename=results_${subject.courseCode}_${subject.batch}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    // Title
    doc.fontSize(20).text(`Results for ${subject.courseCode} - ${subject.courseName}`, { align: 'center' });
    doc.fontSize(14).text(`Batch: ${subject.batch}`, { align: 'center' });
    doc.moveDown(2);

    // Prepare table data
    const tableRows = incourseResults.map(ir => {
      const fr = finalMap[ir.studentENo];
      const incourseStatus = ir.incourseTotal > 35 ? "Pass" : "Fail";
      
      const beforeSenateBase = fr ? fr.finalMark : "-";
      const beforeSenateGrade = fr ? fr.grade : "-";
      const beforeSenateStr = fr ? `${beforeSenateBase} (${beforeSenateGrade})` : "-";
      
      const afterSenateStr = (fr && fr.afterSenateMark !== undefined) 
          ? `${fr.afterSenateMark} (${fr.afterSenateGrade || '-'})` 
          : "-";

      return [
        ir.studentENo,
        // Calculate averages for the table based on arrays, or '-' if empty
        ir.assignments.length > 0 ? (ir.assignments.reduce((a,b)=>a+b,0)/ir.assignments.length).toFixed(1) : "-",
        ir.quizzes.length > 0 ? (ir.quizzes.reduce((a,b)=>a+b,0)/ir.quizzes.length).toFixed(1) : "-",
        ir.labs.length > 0 ? (ir.labs.reduce((a,b)=>a+b,0)/ir.labs.length).toFixed(1) : "-",
        ir.mid !== null ? ir.mid : "-",
        ir.incourseTotal.toFixed(1),
        incourseStatus,
        fr ? fr.endExamMark : "-",
        beforeSenateStr,
        afterSenateStr
      ];
    });

    const table = {
      title: "Student Results",
      headers: [
        { label: "E No.", property: "eno", width: 60 },
        { label: "Assignment", property: "assignment", width: 55 },
        { label: "Quiz", property: "quiz", width: 40 },
        { label: "Lab", property: "lab", width: 40 },
        { label: "Mid", property: "mid", width: 40 },
        { label: "Incourse", property: "incourse", width: 50 },
        { label: "Status", property: "status", width: 45 },
        { label: "End Marks", property: "endmarks", width: 55 },
        { label: "Before Senate", property: "beforesenate", width: 55 },
        { label: "After Senate", property: "aftersenate", width: 55 }
      ],
      rows: tableRows
    };

    // Draw the table
    await doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(8)
    });

    // Summary Statistics calculation to show at the bottom of PDF
    const enrolled = incourseResults.length;
    let passed = 0;
    
    for (const fr of finalResults) {
      if (fr.grade !== "E" && fr.incourseTotal > 35) {
        passed++;
      }
    }

    doc.moveDown(2);
    doc.fontSize(12).text(`No of Enrolled Students : ${enrolled}`);
    doc.text(`Passed Students : ${passed}`);
    doc.text(`Failed Students : ${enrolled - passed}`);

    doc.end();

  } catch (e) {
    if (!res.headersSent) {
      return res.status(500).json({ message: e.message });
    }
    // If headers are sent, ending response gracefully
    res.end();
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

// GET /api/final-results/student/all
exports.getStudentFinalResults = async (req, res) => {
  try {
    const { semester } = req.query;
    let studentENo = normalizeRegNo(req.user.studentENo);
    
    if (!studentENo) {
        studentENo = extractRegNoFromEmail(req.user.email);
    }

    if (!studentENo) {
      return res.status(400).json({ message: "Could not identify your registration number from profile or email" });
    }

    const regNoRegex = generateRegNoRegex(studentENo);

    let query = { studentENo: regNoRegex };
    
    // Find all results first
    let results = await FinalResult.find(query)
      .populate("subject", "courseCode courseName batch semester credit");

    // Filter by semester if requested
    if (semester) {
        results = results.filter(r => r.subject && r.subject.semester === semester);
    }

    // Calculate Summary and Distribution
    const summary = { enrolled: results.length, passed: 0, failed: 0 };
    const gradeDistribution = {
      "A+": 0, "A": 0, "A-": 0,
      "B+": 0, "B": 0, "B-": 0,
      "C+": 0, "C": 0, "C-": 0,
      "D+": 0, "D": 0, "E": 0
    };

    results.forEach(r => {
        const finalGrade = r.afterSenateGrade || r.grade;
        if (gradeDistribution[finalGrade] !== undefined) {
            gradeDistribution[finalGrade]++;
        }

        // Pass condition: Grade is not E (or F)
        if (finalGrade !== "E" && finalGrade !== "F") {
            summary.passed++;
        } else {
            summary.failed++;
        }
    });

    return res.json({
        summary,
        gradeDistribution,
        results
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/final-results/student/analytics?courseCode=CS301&batch=Y3S1
exports.getSubjectAnalytics = async (req, res) => {
  try {
    const { courseCode, batch } = req.query;
    if (!courseCode || !batch) {
      return res.status(400).json({ message: "courseCode and batch are required" });
    }

    const subject = await Subject.findOne({ 
      courseCode: courseCode.toUpperCase(), 
      batch 
    }).populate("createdBy", "firstName lastName title");

    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const finalResults = await FinalResult.find({ subject: subject._id });
    const incourseCount = await IncourseResult.countDocuments({ subject: subject._id });

    const gradeDistribution = {
      "A+": 0, "A": 0, "A-": 0,
      "B+": 0, "B": 0, "B-": 0,
      "C+": 0, "C": 0, "D": 0, "E": 0
    };

    let passed = 0;
    let failed = 0;

    finalResults.forEach(r => {
        if (gradeDistribution[r.grade] !== undefined) {
            gradeDistribution[r.grade]++;
        }
        
        // Pass condition: Grade is not E, AND incourse is > 35
        if (r.grade !== "E" && r.incourseTotal > 35) {
            passed++;
        } else {
            failed++;
        }
    });

    // Students with incourse but no final results are considered failed/incomplete in stats
    failed += (incourseCount - finalResults.length);

    return res.json({
      subjectInfo: {
        courseCode: subject.courseCode,
        courseName: subject.courseName,
        credit: subject.credit,
        description: subject.description,
        lecturer: `${subject.createdBy.title} ${subject.createdBy.firstName} ${subject.createdBy.lastName}`
      },
      statistics: {
        enrolled: incourseCount,
        passed,
        failed
      },
      gradeDistribution
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/final-results/student/download-pdf
exports.downloadStudentReportPdf = async (req, res) => {
  try {
    let studentENo = normalizeRegNo(req.user.studentENo);
    if (!studentENo) studentENo = extractRegNoFromEmail(req.user.email);

    if (!studentENo) return res.status(400).json({ message: "Registration number not found" });

    const results = await FinalResult.find({ studentENo: generateRegNoRegex(studentENo) })
      .populate("subject", "courseCode courseName batch semester credit");

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-disposition', `attachment; filename=results_${studentENo}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(20).text(`Final Results Report`, { align: 'center' });
    doc.fontSize(14).text(`Name: ${req.user.firstName} ${req.user.lastName}`, { align: 'center' });
    doc.text(`E-Number: ${studentENo}`, { align: 'center' });
    doc.moveDown(2);

    const tableRows = results.map(r => [
      r.subject?.batch || "-",
      r.subject?.courseCode || "-",
      r.subject?.courseName || "-",
      r.grade || "E",
      r.afterSenateGrade || r.grade || "E",
      r.subject?.credit || 0
    ]);

    const table = {
      title: "Academic Performance Summary",
      headers: ["Batch", "Code", "Name", "Result (Before)", "Result (After)", "Credit"],
      rows: tableRows
    };

    await doc.table(table, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: (row, i) => doc.font("Helvetica").fontSize(9)
    });

    doc.end();
  } catch (e) {
    if (!res.headersSent) res.status(500).json({ message: e.message });
  }
};
