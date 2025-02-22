import React from "react";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import EmployeeDashboard from "./components/EmployeeDash";
import AdminDashboard from "./components/AdminDash";
import Navbar from "./components/Navbar";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to={
                  role === "admin" ? "/admin-dashboard" : "/employee-dashboard"
                }
              />
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/login"
          element={<Login setToken={setToken} setRole={setRole} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/employee-dashboard"
          element={
            role === "employee" ? <EmployeeDashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin-dashboard"
          element={role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
