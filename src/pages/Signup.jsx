import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import api from "../api";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();

  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();

    const passwordRequirements =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRequirements.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    api
      .post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
        role,
      })
      .then((response) => {
        console.log("Signup successful:", response.data);

        localStorage.setItem("accessToken", response.data.accessToken);

        toast.success("Account created successfully!");

        if (response.data.data.role === "seller") {
          navigate("/seller/dashboard");
        } else {
          navigate("/products");
        }
      })
      .catch((error) => {
        console.error("Signup error:", error);

        console.log("Backend error:", error.response?.data);

        toast.error(
          error.response?.data?.message || "Signup failed. Please try again.",
        );
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign Up</h1>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastname(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="role-selection">
            <label className="role-title">Register as:</label>

            <div className="role-options">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Customer</span>
              </label>

              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === "seller"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>Seller</span>
              </label>
            </div>
          </div>

          <button type="submit">Sign Up</button>
        </form>

        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            {" "}
            Login{" "}
          </span>
        </p>
      </div>
    </div>
  );
}
export default Signup;
