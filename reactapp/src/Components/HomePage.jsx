import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import AdminNavbar from '../AdminComponents/AdminNavbar';
import UserNavbar from '../UserComponents/UserNavbar';

// ⬇️ Replace this with your actual image path (e.g., in src/assets/)
// import heroImg from 'https://s3-alpha.figma.com/hub/file/4278162648/5a1d501f-90ed-4fb6-9376-650c4824a693-cover.png';

const HomePage = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('userData'));

  return (
    <>
      {/* Navbar always stays at top full width */}
      {storedUser?.role === "Admin" ? <AdminNavbar /> : <UserNavbar />}

      <div className="homepage">
        {/* Two-column hero */}
        <section className="hero">
          {/* Left side: keep your existing text + button */}
          <div className="hero-content">
            <h1>Article Hub</h1>
            <h2>Read . Write . Inspire</h2>

            <p className="home-content">
              Discover insightful articles from writers around the world. 
              Stay informed and empowered with quality content.
            </p>

            <button
              type="button"
              onClick={() =>
                storedUser?.role === "Admin" ? navigate('/view') : navigate('/userview')
              }
            >
              Explore Articles
            </button>
          </div>

          {/* Right side: circular styled image */}
          <div className="hero-art">
            <div className="photo-3d">
           
            <img src="/Article-Hub1.1.png" />
            </div>
          </div>
        </section>

        <footer>
          <h3>Article Hub</h3>
          <p>© 2026 Article Hub, Knowledge for Everyone.</p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
