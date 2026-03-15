import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import Home from "./pages/home";
import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn"; 
import AdminHome from "./pages/AdminHome";
import AddUser from "./pages/AddUser";
import AddStudent from "./pages/AddStudent";
import StudentList from "./pages/StudentList";
import AddLecture from "./pages/AddLecture";
import LectureList from "./pages/LectureList";
import Complaint from "./pages/AdminComplaint";
import Results from "./pages/AdminResults";
import ResetPassword from "./pages/AdminResetpassword";
import Setting from "./pages/Setting";

//lecture pages
import LecturerHome from "./pages/LecturerHome.jsx";
import ViewResult from "./pages/ViewResult.jsx";
import AddSubject from "./pages/AddSubject.jsx";
import AddIncourse from "./pages/Addincourse.jsx";
import PendingResult from "./pages/PendingResult.jsx";
import FinalResult from "./pages/FinalResult.jsx";
import LectureSetting from "./pages/LecturerSetting.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/SignIn" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
<<<<<<< HEAD
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        
        {/* Protected Admin Routes */}
        <Route 
          path="/AdminHome" 
          element={<ProtectedRoute allowedRoles={['admin']}><AdminHome /></ProtectedRoute>} 
        />
        <Route 
          path="/AddUser" 
          element={<ProtectedRoute allowedRoles={['admin']}><AddUser /></ProtectedRoute>} 
        />
        <Route 
          path="/AddStudent" 
          element={<ProtectedRoute allowedRoles={['admin']}><AddStudent /></ProtectedRoute>} 
        />
        <Route 
          path="/StudentList" 
          element={<ProtectedRoute allowedRoles={['admin']}><StudentList /></ProtectedRoute>} 
        />
        <Route 
          path="/AddLecture" 
          element={<ProtectedRoute allowedRoles={['admin']}><AddLecture /></ProtectedRoute>} 
        />
        <Route 
          path="/LectureList" 
          element={<ProtectedRoute allowedRoles={['admin']}><LectureList /></ProtectedRoute>} 
        />
        <Route 
          path="/AdminComplaint" 
          element={<ProtectedRoute allowedRoles={['admin']}><Complaint /></ProtectedRoute>} 
        />
        <Route 
          path="/AdminResults" 
          element={<ProtectedRoute allowedRoles={['admin']}><Results /></ProtectedRoute>} 
        />
        <Route 
          path="/AdminResetPassword" 
          element={<ProtectedRoute allowedRoles={['admin']}><ResetPassword /></ProtectedRoute>} 
        />
=======
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/addstudent" element={<AddStudent />} />
        <Route path="/studentlist" element={<StudentList />} />
        <Route path="/addlecture" element={<AddLecture />} />
        <Route path="/lecturelist" element={<LectureList />} />
        <Route path="/AdminComplaint" element={<Complaint />} />
        <Route path="/AdminResults" element={<Results />} />
        <Route path="/adminresetpassword" element={<ResetPassword />} />
        <Route path="/setting" element={<Setting />} />

        {/* Lecturer Routes */}
        <Route path="/lecturer/home" element={<LecturerHome />} />
        <Route path="/lecturer/results" element={<ViewResult />} />
        <Route path="/lecturer/addsubject" element={< AddSubject />} />
        <Route path="/lecturer/addincourse" element={< AddIncourse />} />
        <Route path="/lecturer/pending" element={< PendingResult />} />
        <Route path="/lecturer/final" element={< FinalResult />} />
        <Route path="/lecturer/setting" element={< LectureSetting />} />

>>>>>>> 07dcee7de1b47abd0fcfd5c2663bc3556d6ba2df
      </Routes>
    </BrowserRouter>
  );
}

export default App;