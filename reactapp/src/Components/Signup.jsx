import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import API_BASE_URL from "../apiConfig";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(false); // ⭐ NEW

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const validate = (data) => {
    const newErrors = {};

    if (!data.username.trim()) newErrors.username = "User Name is required";
    else if (data.username.trim().length < 3)
      newErrors.username = "User Name must be at least 3 characters";

    if (!data.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(data.email)) newErrors.email = "Email is invalid";

    if (!data.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    else if (!mobileRegex.test(data.mobileNumber))
      newErrors.mobileNumber =
        "Mobile number must be 10 digits and start with 6-9";

    if (!data.password) newErrors.password = "Password is required";
    else if (!strongPasswordRegex.test(data.password))
      newErrors.password =
        "Password must be 8+ chars with upper, lower, number & special (@$!%*?&)";

    if (!data.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (data.confirmPassword !== data.password)
      newErrors.confirmPassword = "Passwords do not match";

    if (!data.role) newErrors.role = "Please select a role";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (submittedOnce) setErrors(validate(updated));
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedOnce(true);

    const newErrors = validate(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true); // start button loading

      const res = await axios.post(`${API_BASE_URL}/api/register`, {
        userId: 0,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        mobileNumber: formData.mobileNumber,
        userRole: formData.role.toLowerCase(),
      });

      const data = res.data;

      const msg =
        typeof data === "string"
          ? data
          : typeof data?.message === "string"
          ? data.message
          : "";

      if (
        msg.toLowerCase().includes("already exists") ||
        msg.toLowerCase().includes("failed")
      ) {
        setErrors({ server: msg });
        setLoading(false);
        return;
      }

      setShowSuccessPopup(true);
      setLoading(false);

    } catch (error) {
      console.error(error);

      const data = error.response?.data;

      const msg =
        typeof data === "string"
          ? data
          : typeof data?.message === "string"
          ? data.message
          : "Registration failed. Try again.";

      setErrors({ server: msg });
      setLoading(false);
    }
  };

  const showErr = (field) => submittedOnce && errors[field];

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <fieldset id="form-container">
          <h2>Create Account</h2>

          <div className="form-group">
            <label>User Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={showErr("username") ? "invalid" : ""}
              placeholder="User Name"
            />
            {showErr("username") && (
              <small className="error">{errors.username}</small>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={showErr("email") ? "invalid" : ""}
              placeholder="Email"
            />
            {showErr("email") && <small className="error">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className={showErr("mobileNumber") ? "invalid" : ""}
              placeholder="Mobile Number"
            />
            {showErr("mobileNumber") && (
              <small className="error">{errors.mobileNumber}</small>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={showErr("password") ? "invalid" : ""}
              placeholder="Password"
            />
            {showErr("password") && (
              <small className="error">{errors.password}</small>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={showErr("confirmPassword") ? "invalid" : ""}
              placeholder="Confirm Password"
            />
            {showErr("confirmPassword") && (
              <small className="error">{errors.confirmPassword}</small>
            )}
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={showErr("role") ? "invalid" : ""}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            {showErr("role") && <small className="error">{errors.role}</small>}
          </div>


          {errors.server && <small className="error">{errors.server}</small>}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Submit"}
          </button>

          

          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </fieldset>
      </form>

      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h4>User Registration is Successful!</h4>
            <button
              className="popup-btn"
              onClick={() => {
                setShowSuccessPopup(false);
                navigate("/");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
