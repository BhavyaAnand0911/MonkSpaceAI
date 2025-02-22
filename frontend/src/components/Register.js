import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [timeZone, setTimeZone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, timeZone }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Registration Successful");
      navigate("/login");
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <br />
        <br />
        <input
          type="text"
          placeholder="Time Zone (e.g., America/New_York)"
          value={timeZone}
          onChange={(e) => setTimeZone(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
