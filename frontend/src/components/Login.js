import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuthenticated, setRole, setUserId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f5f5;
          padding: 20px;
        }

        .login-box {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-box h2 {
          margin: 0 0 30px;
          text-align: center;
          color: #333;
          font-size: 28px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e1e1;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          outline: none;
        }

        input:focus {
          border-color: #4a90e2;
        }

        button {
          width: 100%;
          padding: 12px;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #357abd;
        }

        button:active {
          transform: scale(0.98);
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
