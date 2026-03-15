import { useState } from "react";
import Navbar from "./LecturerNavbar.jsx";
import Sidebar from "./LecturerSidebar.jsx";
import "../styles/LecturerLayout.css";

/*
Lecturer Layout
Standardized container for all lecturer portal pages.
Ensures a consistent, distraction-free "Winter Chill" professional environment.
*/

function LecturerLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="lecturer-layout">

      {/* Top Navbar with solid background */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="lecturer-layout__body">

        {/* Sidebar with solid background */}
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

export default LecturerLayout;