const mongoose = require("mongoose");

const FinalResultSchema = new mongoose.Schema({
    courseCode: { type: String, required: true, trim: true, uppercase: true },
    semester: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    lecturerEmail: { type: String, required: true, trim: true, lowercase: true },
    studentRegNum: { type: String, required: true, trim: true, uppercase: true },
    grade: { type: String, required: true, trim: true, uppercase: true },
}, { timestamps: true });

FinalResultSchema.index({ courseCode: 1, batch: 1, semester: 1, studentRegNum: 1 }, { unique: true });

module.exports = mongoose.model("AdminResult", FinalResultSchema, "admin_final_results");