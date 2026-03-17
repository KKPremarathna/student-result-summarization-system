import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import Home from "./pages/home";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";

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

// Lecturer Pages
import LecturerHome from "./pages/LecturerHome";
import ViewResult from "./pages/ViewResult";
import AddSubject from "./pages/AddSubject";
import AddIncourse from "./pages/Addincourse";
import PendingResult from "./pages/PendingResult";
import FinalResult from "./pages/FinalResult";
import LecturerSetting from "./pages/LecturerSetting";

// Student Pages
import StudentHome from "./pages/StudentHome";
import SubjectWiseResult from "./pages/SubjectWiseResult";
import StudentWiseResult from "./pages/StudentWiseResult";
import IncourseMarks from "./pages/IncourseMarks";
import StudentProfile from "./pages/StudentProfile";

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
        
        {/* Auth Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/SignUp" element={<SignUp />} />

        {/* Protected Admin Routes */}
        <Route path="/AdminHome" element={<ProtectedRoute allowedRoles={['admin']}><AdminHome /></ProtectedRoute>} />
        <Route path="/adminhome" element={<ProtectedRoute allowedRoles={['admin']}><AdminHome /></ProtectedRoute>} />
        
        <Route path="/AddUser" element={<ProtectedRoute allowedRoles={['admin']}><AddUser /></ProtectedRoute>} />
        <Route path="/adduser" element={<ProtectedRoute allowedRoles={['admin']}><AddUser /></ProtectedRoute>} />
        
        <Route path="/AddStudent" element={<ProtectedRoute allowedRoles={['admin']}><AddStudent /></ProtectedRoute>} />
        <Route path="/addstudent" element={<ProtectedRoute allowedRoles={['admin']}><AddStudent /></ProtectedRoute>} />
        
        <Route path="/StudentList" element={<ProtectedRoute allowedRoles={['admin']}><StudentList /></ProtectedRoute>} />
        <Route path="/studentlist" element={<ProtectedRoute allowedRoles={['admin']}><StudentList /></ProtectedRoute>} />
        
        <Route path="/AddLecture" element={<ProtectedRoute allowedRoles={['admin']}><AddLecture /></ProtectedRoute>} />
        <Route path="/addlecture" element={<ProtectedRoute allowedRoles={['admin']}><AddLecture /></ProtectedRoute>} />
        
        <Route path="/LectureList" element={<ProtectedRoute allowedRoles={['admin']}><LectureList /></ProtectedRoute>} />
        <Route path="/lecturelist" element={<ProtectedRoute allowedRoles={['admin']}><LectureList /></ProtectedRoute>} />
        
        <Route path="/AdminComplaint" element={<ProtectedRoute allowedRoles={['admin']}><Complaint /></ProtectedRoute>} />
        <Route path="/admincomplaint" element={<ProtectedRoute allowedRoles={['admin']}><Complaint /></ProtectedRoute>} />
        
        <Route path="/AdminResults" element={<ProtectedRoute allowedRoles={['admin']}><Results /></ProtectedRoute>} />
        <Route path="/adminresults" element={<ProtectedRoute allowedRoles={['admin']}><Results /></ProtectedRoute>} />
        
        <Route path="/AdminProfile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />
        <Route path="/adminprofile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />
        
        <Route path="/adminresetpassword" element={<ProtectedRoute allowedRoles={['admin']}><ResetPassword /></ProtectedRoute>} />
        <Route path="/AdminResetPassword" element={<ProtectedRoute allowedRoles={['admin']}><ResetPassword /></ProtectedRoute>} />
        
        <Route path="/Setting" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}><Setting /></ProtectedRoute>} />
        <Route path="/setting" element={<ProtectedRoute allowedRoles={['admin', 'lecturer']}><Setting /></ProtectedRoute>} />

        {/* Protected Lecturer Routes */}
        <Route path="/lecturer/home" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerHome /></ProtectedRoute>} />
        <Route path="/lecturer/results" element={<ProtectedRoute allowedRoles={['lecturer']}><ViewResult /></ProtectedRoute>} />
        <Route path="/lecturer/addsubject" element={<ProtectedRoute allowedRoles={['lecturer']}><AddSubject /></ProtectedRoute>} />
        <Route path="/lecturer/addincourse" element={<ProtectedRoute allowedRoles={['lecturer']}><AddIncourse /></ProtectedRoute>} />
        <Route path="/lecturer/pending" element={<ProtectedRoute allowedRoles={['lecturer']}><PendingResult /></ProtectedRoute>} />
        <Route path="/lecturer/final" element={<ProtectedRoute allowedRoles={['lecturer']}><FinalResult /></ProtectedRoute>} />
        <Route path="/lecturer/setting" element={<ProtectedRoute allowedRoles={['lecturer']}><LecturerSetting /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student/home" element={<ProtectedRoute allowedRoles={['student']}><StudentHome /></ProtectedRoute>} />
        <Route path="/student/subject-wise" element={<ProtectedRoute allowedRoles={['student']}><SubjectWiseResult /></ProtectedRoute>} />
        <Route path="/student/student-wise" element={<ProtectedRoute allowedRoles={['student']}><StudentWiseResult /></ProtectedRoute>} />
        <Route path="/student/incourse-marks" element={<ProtectedRoute allowedRoles={['student']}><IncourseMarks /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><StudentProfile /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;