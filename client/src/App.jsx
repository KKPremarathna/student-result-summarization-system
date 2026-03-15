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
      </Routes>
    </BrowserRouter>
  );
}

export default App;