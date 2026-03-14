import { BrowserRouter, Routes, Route } from "react-router-dom";

import LecturerHome from "./pages/lecturer/LecturerHome.jsx";
import ViewResult from "./pages/lecturer/ViewResult.jsx";
import AddSubject from "./pages/lecturer/AddSubject.jsx";
import AddIncourse from "./pages/lecturer/Addincourse.jsx";
import PendingResult from "./pages/lecturer/PendingResult.jsx";
import FinalResult from "./pages/lecturer/FinalResult.jsx";
import Setting from "./pages/lecturer/Setting.jsx";
/*
Main application routing
*/

function App() {

  return (

    <BrowserRouter>

      <Routes>
        {/* Default root route */}
        <Route path="/" element={<LecturerHome />} />

        {/* Lecturer Routes */}
        <Route path="/lecturer/home" element={<LecturerHome />} />
        <Route path="/lecturer/results" element={<ViewResult />} />
        <Route path="/lecturer/addsubject" element={< AddSubject />} />
        <Route path="/lecturer/addincourse" element={< AddIncourse />} />
        <Route path="/lecturer/pending" element={< PendingResult />} />
        <Route path="/lecturer/final" element={< FinalResult />} />
        <Route path="/lecturer/setting" element={< Setting />} />
      </Routes>

    </BrowserRouter>

  );

}

export default App;