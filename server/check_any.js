const mongoose = require('mongoose');
const FinalResult = require('./models/FinalResult');
const AdminResult = require('./models/AdminResult');

async function test() {
    try {
        const uri = "mongodb+srv://kavinduKP:k1234@cluster0.gmvzns4.mongodb.net/student-result-db?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(uri);
        console.log("Connected to DB");

        const anyFinal = await FinalResult.findOne();
        console.log("Any FinalResult:", anyFinal ? anyFinal.studentENo : "NONE");

        const anyAdmin = await AdminResult.findOne();
        console.log("Any AdminResult:", anyAdmin ? anyAdmin.studentRegNum : "NONE");

        process.exit(0);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        process.exit(1);
    }
}
test();
