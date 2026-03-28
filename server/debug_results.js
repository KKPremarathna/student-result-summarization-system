const mongoose = require('mongoose');
const FinalResult = require('./models/FinalResult');
const AdminResult = require('./models/AdminResult');
const Subject = require('./models/Subject');
const { generateRegNoRegex } = require('./utils/regUtils');

async function test() {
    try {
        const uri = "mongodb+srv://kavinduKP:k1234@cluster0.gmvzns4.mongodb.net/student-result-db?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(uri);
        console.log("Connected to DB");

        // Use a real student ID from your DB if you know one, otherwise this is a placeholder
        const studentENo = "2022E050"; 
        console.log("Testing Student:", studentENo);

        const regNoRegex = generateRegNoRegex(studentENo);
        console.log("Generated Regex:", regNoRegex);

        const results = await FinalResult.find({ studentENo: regNoRegex })
            .populate("subject", "courseCode courseName batch semester credit")
            .lean();
        
        console.log("Found FinalResults (Lecturer):", results.length);
        if (results.length > 0) {
            console.log("First FinalResult Sample:", {
                eno: results[0].studentENo,
                subject: results[0].subject ? results[0].subject.courseCode : "NULL SUBJECT"
            });
        }

        const adminResults = await AdminResult.find({ studentRegNum: regNoRegex });
        console.log("Found AdminResults (Official):", adminResults.length);

        const getNumeric = (s) => (s ? s.toString().replace(/\D/g, '').replace(/^0+/, '') : s) || s;

        const adminMap = {};
        adminResults.forEach(ar => {
            const key = `${ar.courseCode.toUpperCase()}-${ar.batch.toUpperCase()}-${getNumeric(ar.semester)}`;
            adminMap[key] = ar.grade;
            console.log(`- Admin Key Registered: ${key} -> ${ar.grade}`);
        });

        const merged = results.map(r => {
            if (!r.subject) return r;
            const key = `${r.subject.courseCode.toUpperCase()}-${r.subject.batch.toUpperCase()}-${getNumeric(r.subject.semester)}`;
            console.log(`- Checking Merge Key: ${key}`);
            return {
                ...r,
                afterSenateGrade: adminMap[key] || null
            };
        });

        console.log("Merged results count:", merged.length);
        
        process.exit(0);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        process.exit(1);
    }
}

test();
