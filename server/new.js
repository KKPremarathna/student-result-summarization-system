import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log("❌ FULL ERROR:");
        console.log(err.message);
    });