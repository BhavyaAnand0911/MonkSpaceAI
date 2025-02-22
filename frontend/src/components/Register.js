import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [timeZone, setTimeZone] = useState("");
  const navigate = useNavigate();

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    },
    title: {
      color: "#333",
      marginBottom: "30px",
      fontSize: "28px",
      fontWeight: "600",
    },
    formGroup: {
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "16px",
      transition: "border-color 0.3s, box-shadow 0.3s",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "16px",
      backgroundColor: "white",
      cursor: "pointer",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#4a90e2",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
  };

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
    <div style={styles.container}>
      <h2 style={styles.title}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <input
            style={styles.input}
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <select
            style={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <input
            style={styles.input}
            type="text"
            placeholder="Time Zone (e.g., America/New_York)"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            required
          />
        </div>

        <button style={styles.button} type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
