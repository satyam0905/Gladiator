import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setloginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ⭐ NEW
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setloginError(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function loginHandle() {
    setIsLoading(true);        // ⭐ START LOADING
    setloginError(false);

    axios
      .post(`${API_BASE_URL}/api/login`, form)
      .then((res) => {
        if (res.data === "Invalid email" || res.data === "Invalid password") {
          setloginError(true);
          return;
        } else {
          localStorage.setItem("userData", JSON.stringify(res.data));
          navigate("/home");
        }
      })
      .catch(() => setloginError(true))
      .finally(() => setIsLoading(false));  // ⭐ STOP LOADING
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      loginHandle();
    }
  };

  return (
    <div className="loginWrapper">
      <div className="loginPage">
        <div className="intro">
          <h1>Article Hub</h1>
          <p>
            Access comprehensive articles, expert guides, and practical knowledge
            resources in our article hub.
          </p>
        </div>

        <div className="loginFormDiv">
          <form className="loginForm" onSubmit={handleSubmit}>
            <h2 className="loginTitle">Login</h2>

            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && <p className="errorText">{errors.email}</p>}

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />
            {errors.password && <p className="errorText">{errors.password}</p>}
            {loginError && <p className="errorText">Invalid Credentials</p>}

            <button
              type="submit"
              className="loginBtn"
              disabled={isLoading} // ⭐ DISABLE
            >
              {isLoading ? "Logging in..." : "Login"} {/* ⭐ TEXT CHANGE */}
            </button>

            <p className="loginError">
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
