import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validation from "./loginValidation";
import axios from "axios";
import "./login.css";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันจัดการการเปลี่ยนค่า input
  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  // ฟังก์ชันจัดการ Submit ฟอร์ม
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError(""); // ล้าง error ก่อน
    const validationErrors = validation(values);
    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      try {
        const res = await axios.post("http://localhost:3307/login", values);
        console.log("Login response:", res.data);

        if (res.data.message === "Login successful") {
          const { user_id, rights } = res.data; 

          sessionStorage.setItem("user_id", user_id);
          console.log("User ID stored:", user_id); 


          switch (rights) {
            case "admin":
              navigate("/addAnnouncement");
              break;
            case "user":
              navigate("/recruitingemployees");
              break;
            case "officer":
              navigate("/employeeProfile");
              break;
            default:
              setLoginError("Unauthorized access.");
          }
        } else {
          setLoginError("Invalid email or password.");
        }
      } catch (err) {
        console.error("Login Error:", err.response?.data || err);
        setLoginError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      {/* ส่วนซ้าย: ฟอร์ม */}
      <div className="login-form">
        <div className="logo" />
        <h2>Login</h2>
        <p>Login to your account.</p>
        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={values.email}
            onChange={handleInput}
            className="input-field"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={values.password}
            onChange={handleInput}
            className="input-field"
          />
          {errors.password && <span className="error-text">{errors.password}</span>}

          {/* แสดง Error ถ้าล็อกอินไม่สำเร็จ */}
          {loginError && <p className="error-text">{loginError}</p>}

          <div className="remember-forgot">
            <Link to="/signup" className="create-account">
              Create an account
            </Link>
          </div>

          <button type="submit" className="signin-btn">
            Sign In
          </button>
        </form>
      </div>

      {/* ส่วนขวา: พื้นหลังภาพ */}
      <div className="login-image"></div>
    </div>
  );
}

export default Login;