import React from "react";
import { Link } from "react-router-dom";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'sans-serif",
  },
  title: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "2rem",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
  },
  button: {
    padding: "12px 30px",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
    color: "white",
  },
  loginButton: {
    backgroundColor: "blue",
  },
  registerButton: {
    backgroundColor: "green",
  },
};

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shift Planning System</h1>
      <div style={styles.buttonContainer}>
        <Link to="/login">
          <button style={{ ...styles.button, ...styles.loginButton }}>
            Login
          </button>
        </Link>
        <Link to="/register">
          <button style={{ ...styles.button, ...styles.registerButton }}>
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
