import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;