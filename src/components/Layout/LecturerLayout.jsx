import { useState } from "react";
import Navbar from "../Navbar/Navbar.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";

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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      {/* Top Navbar with solid background */}
      <Navbar toggleSidebar={toggleSidebar} />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar with solid background */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Page Content area */}
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "auto",
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(3, 32, 19, 0.7)' /* Consistency with theme */
          }}
        >
          <div style={{
            position: "relative",
            zIndex: 1,
            padding: "40px",
            maxWidth: "1400px",
            margin: "0 auto",
            width: "100%",
            flex: 1
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LecturerLayout;