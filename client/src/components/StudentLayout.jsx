import { useState } from "react";
import Navbar from "./InnerNavbar.jsx";
import Sidebar from "./StudentSidebar.jsx";
import "../styles/StudentLayout.css";

function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="student-layout">
      {/* Top Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="student-layout__body">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Page Content area */}
        <main className="student-layout__content">
          <div className="student-layout__inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
