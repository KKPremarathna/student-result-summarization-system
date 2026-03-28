import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import Home from "./pages/home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import About from "./pages/About";

// Admin Pages
import AdminHome from "./pages/AdminHome";
import AddUser from "./pages/AddUser";
import AddStudent from "./pages/AddStudent";
import StudentList from "./pages/StudentList";
import AddLecture from "./pages/AddLecture";
import LectureList from "./pages/LectureList";
import Complaint from "./pages/AdminComplaint";
import Results from "./pages/AdminResults";
import AdminProfile from "./pages/AdminProfile";
import ResetPassword from "./pages/AdminResetpassword";
import Setting from "./pages/Setting";
import AdminAcademicCalendar from "./pages/AdminAcademicCalendar";
import ViewAcademicCalendar from "./pages/ViewAcademicCalendar.jsx";

// Lecturer Pages
import LecturerHome from "./pages/LecturerHome";
import ViewResult from "./pages/ViewResult";
import AddSubject from "./pages/AddSubject";
import EditSubject from "./pages/EditSubject";
import AddIncourse from "./pages/Addincourse";
import LecturerComplaints from "./pages/LecturerComplaints";
import FinalResult from "./pages/FinalResult";
import LecturerSetting from "./pages/LecturerSetting";

// Student Pages
import StudentHome from "./pages/StudentHome";
import SubjectWiseResult from "./pages/SubjectWiseResult";
import StudentWiseResult from "./pages/StudentWiseResult";
import IncourseMarks from "./pages/IncourseMarks";
import StudentProfile from "./pages/StudentProfile";
import StudentComplaints from "./pages/StudentComplaints";
import ForgotPassword from "./pages/ForgotPassword";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (!token || !user) {
    console.log("No token or user, redirecting to /signin");
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`Role ${user.role} not allowed, redirecting to /`);
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Admin Routes */}
        <Route path="/adminhome" element={<ProtectedRoute allowedRoles={['admin']}><AdminHome /></ProtectedRoute>} />

        <Route path="/adduser" element={<ProtectedRoute allowedRoles={['admin']}><AddUser /></ProtectedRoute>} />

        <Route path="/addstudent" element={<ProtectedRoute allowedRoles={['admin']}><AddStudent /></ProtectedRoute>} />

        <Route path="/studentlist" element={<ProtectedRoute allowedRoles={['admin']}><StudentList /></ProtectedRoute>} />

        <Route path="/addlecture" element={<ProtectedRoute allowedRoles={['admin']}><AddLecture /></ProtectedRoute>} />

        <Route path="/lecturelist" element={<ProtectedRoute allowedRoles={['admin']}><LectureList /></ProtectedRoute>} />

        <Route path="/admincomplaint" element={<ProtectedRoute allowedRoles={['admin']}><Complaint /></ProtectedRoute>} />

        <Route path="/adminresults" element={<ProtectedRoute allowedRoles={['admin']}><Results /></ProtectedRoute>} />

        <Route path="/adminprofile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />

        <Route path="/adminresetpassword" element={<ProtectedRoute allowedRoles={['admin']}><ResetPassword /></ProtectedRoute>} />

        <Route path="/setting" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}><Setting /></ProtectedRoute>} />

        {/* Protected Lecturer Routes */}
        <Route path="/lecturer/home" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerHome /></ProtectedRoute>} />
        <Route path="/lecturer/results" element={<ProtectedRoute allowedRoles={['lecturer']}><ViewResult /></ProtectedRoute>} />
        <Route path="/lecturer/addsubject" element={<ProtectedRoute allowedRoles={['lecturer']}><AddSubject /></ProtectedRoute>} />
        <Route path="/lecturer/edit-subject/:id" element={<ProtectedRoute allowedRoles={['lecturer']}><EditSubject /></ProtectedRoute>} />
        <Route path="/lecturer/addincourse" element={<ProtectedRoute allowedRoles={['lecturer']}><AddIncourse /></ProtectedRoute>} />
        <Route path="/lecturer/complaints" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerComplaints /></ProtectedRoute>} />
        <Route path="/lecturer/final" element={<ProtectedRoute allowedRoles={['lecturer']}><FinalResult /></ProtectedRoute>} />
        <Route path="/lecturer/setting" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerSetting /></ProtectedRoute>} />
        <Route path="/AdminCalendar" element={<AdminAcademicCalendar />} />
        <Route path="/calendar" element={<ViewAcademicCalendar />} />

        {/* Student Routes */}
        <Route path="/student/home" element={<ProtectedRoute allowedRoles={['student']}><StudentHome /></ProtectedRoute>} />
        <Route path="/student/subject-wise" element={<ProtectedRoute allowedRoles={['student']}><SubjectWiseResult /></ProtectedRoute>} />
        <Route path="/student/student-wise" element={<ProtectedRoute allowedRoles={['student']}><StudentWiseResult /></ProtectedRoute>} />
        <Route path="/student/incourse-marks" element={<ProtectedRoute allowedRoles={['student']}><IncourseMarks /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/complaints" element={<ProtectedRoute allowedRoles={['student']}><StudentComplaints /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;