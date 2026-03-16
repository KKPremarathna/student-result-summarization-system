import { useState } from "react";
import Navbar from "./StudentNavbar.jsx";
import Sidebar from "./StudentSidebar.jsx";
import "../styles/LecturerLayout.css";

/*
Student Layout
Standardized container for all student portal pages.
Ensures a consistent, distraction-free "Winter Chill" professional environment.
*/

function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="lecturer-layout student-layout">
      {/* Top Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="lecturer-layout__body">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Page Content area */}
        <div className="lecturer-layout__content">
          <div className="lecturer-layout__inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentLayout;
