import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Shift Planning System</h1>
      <Link to="/login">
        <button style={{ margin: "10px", padding: "10px 20px" }}>Login</button>
      </Link>
      <Link to="/register">
        <button style={{ margin: "10px", padding: "10px 20px" }}>
          Register
        </button>
      </Link>
    </div>
  );
}
