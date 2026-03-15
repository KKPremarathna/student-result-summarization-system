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

app.get("/", (req, res) => {
  res.send("Student Result Summarization System API");
});

// Database Connection
mongoose
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

console.log("Connected DB:", mongoose.connection.name);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
