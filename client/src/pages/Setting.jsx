import React, { useState, useEffect } from "react";
import "../styles/Setting.css";
import Navbar from "../components/InnerNavbar";
import bgImage from "../assets/images/admin.jpg"; 
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/user";

function Setting() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    role: "",
    phone: "",
    profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: ""
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          const user = response.data.data;
          setUserData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            department: user.department || "",
            role: user.role || "",
            phone: user.phone || "",
            profilePicture: user.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          });
        }
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };
    
    if (token) {
       fetchUserDetails();
    }
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
        setUserData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setMessage("");
    try {
      const payload = {};
      if (selectedFile) payload.profilePicture = selectedFile;
      if (passwords.oldPassword && passwords.newPassword) {
        payload.oldPassword = passwords.oldPassword;
        payload.newPassword = passwords.newPassword;
      }

      if (Object.keys(payload).length === 0) {
        setMessage("No changes to update.");
        return;
      }

      const response = await axios.put(`${API_URL}/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMessage("Successfully updated!");
        setPasswords({ oldPassword: "", newPassword: "" });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div className="setting-page">
      <Navbar />
      
      <div className="setting-content">
        <aside className="sidebar">
          <div className="sidebar-title">Management</div>
          <ul className="sidebar-menu">
            {userData.role === "admin" ? (
              <>
                <li><Link to="/adminhome"><span className="sidebar-icon"></span>Admin Home</Link></li>
                <li><Link to="/adduser"><span className="sidebar-icon"></span>Add User</Link></li>
                <li><Link to="/admincomplaint"><span className="sidebar-icon"></span>Complaint</Link></li>
                <li><Link to="/adminresults"><span className="sidebar-icon"></span>Results</Link></li>
                <li><Link to="/adminprofile"><span className="sidebar-icon"></span>Profile</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/lecturer/results">View Result</Link></li>
                <li><Link to="/lecturer/addsubject">Add Subject</Link></li>
                <li><Link to="/lecturer/addincourse">Incourse</Link></li>
                <li><Link to="/lecturer/final">Final Result</Link></li>
                <li className="active"><Link to="/setting">Setting</Link></li>
                <li><Link to="/lecturer/pending">Pending Result</Link></li>
              </>
            )}
          </ul>
        </aside>

        <main className="setting-main" style={{ backgroundImage: `url(${bgImage})` }}>
           <div className="setting-overlay"></div>
           
           <div className="setting-main-content">
              <div className="profile-section">
                 <div className="profile-pic-container">
                    <img src={userData.profilePicture} alt="Profile" className="profile-pic" />
                    <label htmlFor="file-upload" className="edit-pic-btn">
                       Edit
                    </label>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      style={{ display: "none" }} 
                    />
                 </div>
                 
                 <div className="user-details">
                    <p><strong>Name : </strong> {userData.firstName} {userData.lastName}</p>
                    <p><strong>Email : </strong> {userData.email}</p>
                    <p><strong>Department : </strong> {userData.department}</p>
                    <p><strong>Phone No : </strong> {userData.phone}</p>
                 </div>
              </div>

              <div className="update-password-section">
                 <h3>Update Password :</h3>
                 
                 <div className="form-group">
                    <label>Old Password :</label>
                    <input 
                      type="password" 
                      name="oldPassword"
                      value={passwords.oldPassword} 
                      onChange={handlePasswordChange} 
                    />
                 </div>
                 
                 <div className="form-group">
                    <label>New Password :</label>
                    <input 
                      type="password" 
                      name="newPassword"
                      value={passwords.newPassword} 
                      onChange={handlePasswordChange} 
                    />
                 </div>
                 
                 {message && <p className="status-message">{message}</p>}

                 <button className="update-btn" onClick={handleUpdate}>Update</button>
              </div>
           </div>
        </main>
      </div>
    </div>
  );
}

export default Setting;
