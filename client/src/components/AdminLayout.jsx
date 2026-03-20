import React from "react";
import AdminSidebar from "./AdminSidebar";
import Navbar from "./InnerNavbar";
import "../styles/AdminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-page-root">
      <Navbar />
      <div className="admin-layout-body">
        <AdminSidebar />
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
