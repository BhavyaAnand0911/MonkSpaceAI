import React, { useEffect, useState } from "react";
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
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // fetching the access token from the local storage to grant ROLE BASED ACCESS CONTROL (if the token is found user is authenticated)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setRole(decoded.role);
        setUserId(decoded.id);
        setAuthenticated(true);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <Router>
      {/* only if the user is authenticated the navbar will appear else no*/}
      {authenticated && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
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
          element={
            <Login
              setAuthenticated={setAuthenticated}
              setRole={setRole}
              setUserId={setUserId}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/employee-dashboard"
          element={
            authenticated && role === "employee" ? (
              <EmployeeDashboard userId={userId} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            authenticated && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
