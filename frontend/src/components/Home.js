import React from "react";
import { Link } from "react-router-dom";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "2rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  buttonContainer: {
    display: "flex",
    gap: "1rem",
  },
  button: {
    padding: "12px 30px",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    color: "white",
  },
  loginButton: {
    backgroundColor: "#3498db",
    boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
  },
  registerButton: {
    backgroundColor: "#2ecc71",
    boxShadow: "0 4px 15px rgba(46, 204, 113, 0.3)",
  },
};

export default function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shift Planning System</h1>
      <div style={styles.buttonContainer}>
        <Link to="/login">
          <button
            style={{ ...styles.button, ...styles.loginButton }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(52, 152, 219, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
            }}
          >
            Login
          </button>
        </Link>
        <Link to="/register">
          <button
            style={{ ...styles.button, ...styles.registerButton }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(46, 204, 113, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(46, 204, 113, 0.4)";
            }}
          >
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
