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

//lecture pages
import LecturerHome from "./pages/LecturerHome.jsx";
import ViewResult from "./pages/ViewResult.jsx";
import AddSubject from "./pages/AddSubject.jsx";
import AddIncourse from "./pages/Addincourse.jsx";
import PendingResult from "./pages/PendingResult.jsx";
import FinalResult from "./pages/FinalResult.jsx";
import LectureSetting from "./pages/LecturerSetting.jsx";

//Student pages
import StudentHome from "./pages/StudentHome.jsx";
import SubjectWiseResult from "./pages/SubjectWiseResult.jsx";
import StudentWiseResult from "./pages/StudentWiseResult.jsx";
import IncourseMarks from "./pages/IncourseMarks.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";

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

        {/* Lecturer Routes */}
        <Route path="/lecturer/home" element={<LecturerHome />} />
        <Route path="/lecturer/results" element={<ViewResult />} />
        <Route path="/lecturer/addsubject" element={< AddSubject />} />
        <Route path="/lecturer/addincourse" element={< AddIncourse />} />
        <Route path="/lecturer/pending" element={< PendingResult />} />
        <Route path="/lecturer/final" element={< FinalResult />} />
        <Route path="/lecturer/setting" element={< LectureSetting />} />

        {/* Student Routes */}
        <Route path="/student/home" element={<StudentHome />} />
        <Route path="/student/subject-wise" element={<SubjectWiseResult />} />
        <Route path="/student/student-wise" element={<StudentWiseResult />} />
        <Route path="/student/incourse-marks" element={<IncourseMarks />} />
        <Route path="/student/profile" element={<StudentProfile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;