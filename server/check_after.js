const mongoose = require('mongoose');
const FinalResult = require('./models/FinalResult');

async function test() {
    try {
        const uri = "mongodb+srv://kavinduKP:k1234@cluster0.gmvzns4.mongodb.net/student-result-db?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(uri);
        console.log("Connected to DB");

        const studentENo = "2022E050"; 
        const result = await FinalResult.findOne({ studentENo: studentENo });
        
        if (result) {
            console.log("Student:", studentENo);
            console.log("Raw afterSenateGrade in DB:", result.afterSenateGrade || "NOT SET");
        } else {
            console.log("Student not found");
        }

        process.exit(0);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        process.exit(1);
    }
}
test();
