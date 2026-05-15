import React from "react";
import "./Login.css";
import img1 from "./images/img2.jpg";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // page reload stop
    navigate("/movie"); // goto movie page
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-image">
          <img src={img1} alt="movie" />
        </div>

        <form className="login-box" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <p>Login to continue</p>

          <input type="email" placeholder="Email" required />

          <input type="password" placeholder="Password" required />

          <div className="forgot">Forgot password?</div>

          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
}

export default Login;