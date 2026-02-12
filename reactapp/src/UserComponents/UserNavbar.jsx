// import React from "react";
// import {Link,useNavigate} from 'react-router-dom'
// import './UserNavbar.css';


// function UserNavbar()
// {
//   const storedUser = JSON.parse(localStorage.getItem('userData'));
//   const navigate = useNavigate();
  
//     return(
//         <div className="navbar">
//           <div className="navbar-left">
//             <span className="logo">Article Hub</span>
//           </div>
//           <div className="navbar-right">
//             {/* <span className="user-role">User / User</span> */}
//             <span className="user-role">{storedUser.userName} / {storedUser.role}</span>
//             <Link to="/home">Home</Link>
//             <Link to="/userview">Articles</Link>
//             <button className="logout-btn" onClick={handleLogout}>Logout</button>
//           </div>
//         </div>

//       )
// function handleLogout()
// {
  
 
//   localStorage.removeItem("userData");
//   navigate('/');
// }
// }



// export default UserNavbar;

// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./UserNavbar.css";

// function UserNavbar() {
//   const navigate = useNavigate();

//   const storedUserRaw = localStorage.getItem("userData");
//   const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

//   const handleLogout = () => {
//     localStorage.removeItem("userData");
//     navigate("/");
//   };

//   return (
//     <div className="nav-bar">
//       <div className="navbar-left">
//         <span className="nav-title">Article Hub</span>
//       </div>

//       <div className="nav-actions">
//         <span className="user-role">
//           {storedUser ? `${storedUser.userName} / ${storedUser.role}` : "Guest"}
//         </span>

//         <Link className="nav-link" to="/home">Home</Link>
//         <Link className="nav-link" to="/userview">Articles</Link>

//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UserNavbar;

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./UserNavbar.css";

function UserNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUserRaw = localStorage.getItem("userData");
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

  // NEW: modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    // Open confirm modal instead of immediate logout
    setShowLogoutConfirm(true);
  };

  // NEW: confirm/cancel actions
  const confirmLogout = () => {
    localStorage.removeItem("userData");
    setShowLogoutConfirm(false);
    navigate("/"); // to Login
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // (Optional) small helper to style active link
  const isActive = (to) => (location.pathname === to ? "active" : "");

  return (
    <div className="nav-bar">
      <div className="navbar-left">
        <span className="nav-title">Article Hub</span>
      </div>

      <div className="nav-actions">
        <span className="user-role">
          {storedUser ? `${storedUser.userName} / ${storedUser.role}` : "Guest"}
        </span>

        <Link className={`nav-link ${isActive("/home")}`} to="/home">Home</Link>
        <Link className={`nav-link ${isActive("/userview")}`} to="/userview">Articles</Link>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* NEW: lightweight confirm modal (no structure changes above) */}
      {showLogoutConfirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="modal-card">
            <h3 id="logout-title" className="modal-title">Are you sure you want to logout?</h3>
            <div className="modal-actions">
              <button className="btn-pr" onClick={confirmLogout}>Yes, Logout</button>
              <button className="btn-sec" onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserNavbar;
