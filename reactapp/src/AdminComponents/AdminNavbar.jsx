// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './AdminNavbar.css';


// const AdminNavbar = () => {
  
//   const storedUser = JSON.parse(localStorage.getItem('userData'));
//   const navigate = useNavigate();

//   return (
//     <nav className="nav-bar">
//       <h2 className="nav-title">Article Hub</h2>

//       <div className="nav-actions">
//         <button className="admin-btn">{storedUser.userName} / {storedUser.role}</button>
//         {/* FIXED HOME ROUTE */}
//         <Link to="/home" className="nav-link">Home</Link>

//         {/* Dropdown */}
//         <div className="dropdown">
//           <button className="drop-btn">Article</button>
//           <div className="dropdown-menu">
//             <Link to="/articles/new" className="nav-link">Add Article</Link>
//             <Link to="/view" className="nav-link">View Articles</Link>
//           </div>
//         </div>

//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
//   function handleLogout()
// {
  
//   localStorage.removeItem("userData");
//   navigate('/');
// }
// };




// export default AdminNavbar;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  // Safely parse user
  const [storedUser, setStoredUser] = useState(() => {
    try {
      const raw = localStorage.getItem('userData');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // NEW: Logout confirmation modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close modal on ESC
  useEffect(() => {
    if (!showLogoutConfirm) return;
    const onKey = (e) => e.key === 'Escape' && setShowLogoutConfirm(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showLogoutConfirm]);

  // Keep your original function name; we only change behavior to show modal
  function handleLogout() {
    setShowLogoutConfirm(true);
  }

  // NEW: modal actions
  function confirmLogout() {
    localStorage.removeItem('userData');
    setShowLogoutConfirm(false);
    navigate('/');
  }

  function cancelLogout() {
    setShowLogoutConfirm(false);
  }

  return (
    <nav className="nav-bar">
      <h2 className="nav-title">Article Hub</h2>

      <div className="nav-actions">
        <button className="admin-btn">
          {storedUser ? `${storedUser.userName} / ${storedUser.role}` : 'Admin'}
        </button>

        {/* FIXED HOME ROUTE */}
        <Link to="/home" className="nav-link">Home</Link>

        {/* Dropdown */}
        <div className="dropdown">
          <button className="drop-btn">Article</button>
          <div className="dropdown-menu">
            <Link to="/articles/new" className="nav-link">Add Article</Link>
            <Link to="/view" className="nav-link">View Articles</Link>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* NEW: Logout confirmation modal */}
      {showLogoutConfirm && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div className="modal-card">
            <h3 id="logout-modal-title" className="modal-title">
              Are you sure you want to logout?
            </h3>
            <div className="modal-actions">
              <button className="btn-pr" onClick={confirmLogout}>
                Yes, Logout
              </button>
              <button className="btn-sr" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
