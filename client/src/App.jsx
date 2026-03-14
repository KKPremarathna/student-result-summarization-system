import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/AdminHome" element={<AdminHome />} />
        <Route path="/AddUser" element={<AddUser />} />
        <Route path="/AddStudent" element={<AddStudent />} />
        <Route path="/StudentList" element={<StudentList />} />
        <Route path="/AddLecture" element={<AddLecture />} />
        <Route path="/LectureList" element={<LectureList />} />
        <Route path="/AdminComplaint" element={<Complaint />} />
        <Route path="/AdminResults" element={<Results />} />
        <Route path="/AdminResetPassword" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;