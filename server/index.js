const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const subjectRoutes = require("./routes/subjectRoutes");
app.use("/api/subjects", subjectRoutes);


const incourseRoutes = require("./routes/incourseRoutes");
app.use("/api/incourse", incourseRoutes);

const finalResultRoutes = require("./routes/finalResultRoutes");
app.use("/api/final-results", finalResultRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);

const complaintRoutes = require("./routes/complaintRoutes");
app.use("/api/complaints", complaintRoutes);


app.get("/", (req, res) => {
    res.send("Student Result Summarization System API");
});

// Database Connection
mongoose
<<<<<<< HEAD
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    console.log("Connected DB:", mongoose.connection.name);
    console.log("Connected Host:", mongoose.connection.host);
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:");
    console.error(err.message);
  });
=======
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:");
        console.error(err.message);
    });
>>>>>>> 07dcee7de1b47abd0fcfd5c2663bc3556d6ba2df

console.log("Connected DB:", mongoose.connection.name);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});