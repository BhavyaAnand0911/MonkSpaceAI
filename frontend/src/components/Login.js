import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuthenticated, setRole, setUserId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // calling the api/auth/login API endpoint to authenticate and login the user
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      setRole(data.user.role);
      setUserId(data.user._id);
      setAuthenticated(true);
      // as soon as the user is authenticated navigate to the respective dashboard RBAC
      navigate(
        data.user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"
      );
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f3f4f6;
          padding: 1rem;
        }

        .login-box {
          width: 100%;
          max-width: 28rem;
          background-color: white;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .login-box h2 {
          font-size: 1.875rem;
          font-weight: 600;
          text-align: center;
          color: #1f2937;
          margin-bottom: 2rem;
          margin-top: 0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group input {
          width: 95%;
          padding: 0.7rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        button {
          width: 100%;
          padding: 0.75rem;
          margin-left: 1px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        button:hover {
          background-color: #2563eb;
        }

        @media (max-width: 640px) {
          .login-box {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
