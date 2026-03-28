import { useState } from "react";
import Navbar from "./InnerNavbar.jsx";
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
      <Navbar />
      <div className="lecturer-layout__body">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="lecturer-layout__content">
          <div className="lecturer-layout__inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LecturerLayout;