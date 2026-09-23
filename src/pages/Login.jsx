import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import api from "../api";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    api
      .post("/api/auth/login", {
        email,
        password,
      })
      .then((response) => {
        console.log("Login successful:", response.data);

        localStorage.setItem("accessToken", response.data.accessToken);

        const token = response.data.accessToken;

        const payload = JSON.parse(atob(token.split(".")[1]));

        localStorage.setItem("role", payload.role);

        toast.success("Login successful!");

        if (payload.role === "seller") {
          navigate("/seller/dashboard");
        } else if (payload.role === "admin") {
          navigate("/products");
        } else {
          navigate("/products");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);

        toast.error(
          error.response?.data?.message ||
            "Login failed. Please check your email and password.",
        );
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
