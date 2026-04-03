import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import Navbar from "./InnerNavbar";
import "../styles/AdminLayout.css";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-page-root">
      <Navbar />
      <div className="admin-layout-body">
        <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="admin-main-viewport">
          <div className="admin-content-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
