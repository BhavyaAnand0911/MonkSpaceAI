import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {localStorage.getItem("role") === "employee" && (
        <Link to="/employee-dashboard">Employee Dashboard</Link>
      )}{" "}
      |
      {localStorage.getItem("role") === "admin" && (
        <Link to="/admin-dashboard">Admin Dashboard</Link>
      )}{" "}
      |<button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
