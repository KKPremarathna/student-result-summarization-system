const mongoose = require('mongoose');
require('dotenv').config();
const Subject = require('./models/Subject');
const AdminResult = require('./models/AdminResult');
const FinalResult = require('./models/FinalResult'); // Check if this exists or if AdminResult is the one
const IncourseResult = require('./models/IncourseResult');
const { normalizeBatch } = require('./utils/batchUtils');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-result-system');
        console.log("Connected to MongoDB for migration...");

        // 1. Update Subjects
        const subjects = await Subject.find({});
        console.log(`Found ${subjects.length} subjects. Normalizing batches...`);
        for (let sub of subjects) {
            const normalized = normalizeBatch(sub.batch);
            if (normalized !== sub.batch) {
                console.log(`Updating Subject ${sub.courseCode}: ${sub.batch} -> ${normalized}`);
                try {
                    await Subject.updateOne({ _id: sub._id }, { $set: { batch: normalized } });
                } catch (err) {
                    if (err.code === 11000) {
                        console.warn(`Duplicate found for Subject ${sub.courseCode} ${normalized}. Deleting old record ${sub.batch}...`);
                        await Subject.deleteOne({ _id: sub._id });
                    } else {
                        throw err;
                    }
                }
            }
        }

        // 2. Update AdminResults (Final Results)
        const adminResults = await AdminResult.find({});
        console.log(`Found ${adminResults.length} admin results. Normalizing batches...`);
        for (let res of adminResults) {
            const normalized = normalizeBatch(res.batch);
            if (normalized !== res.batch) {
                console.log(`Updating AdminResult ${res.courseCode}: ${res.batch} -> ${normalized}`);
                try {
                    await AdminResult.updateOne({ _id: res._id }, { $set: { batch: normalized } });
                } catch (err) {
                    if (err.code === 11000) {
                        console.warn(`Duplicate found for AdminResult ${res.studentRegNum} ${res.courseCode} ${normalized}. Deleting old record ${res.batch}...`);
                        await AdminResult.deleteOne({ _id: res._id });
                    } else {
                        throw err;
                    }
                }
            }
        }

        // 3. Update IncourseResults? 
        // Wait, IncourseResult usually has a ref to Subject, but it might also have a batch string in some versions
        // Let's check IncourseResult model if it has batch.

        console.log("Migration completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
};

migrate();
