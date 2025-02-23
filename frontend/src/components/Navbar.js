import React from "react";

const Navbar = () => {
  const styles = {
    nav: {
      backgroundColor: "#ffffff",
      padding: "1rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    linkContainer: {
      display: "flex",
      gap: "24px",
    },
    link: {
      color: "#333333",
      textDecoration: "none",
      fontWeight: "500",
      transition: "color 0.2s ease",
    },
    linkHover: {
      color: "#2563eb",
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#ef4444",
      color: "#ffffff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "background-color 0.2s ease",
    },
    buttonHover: {
      backgroundColor: "#dc2626",
    },
  };

  const handleLogout = () => {
    // remove everything that is in the localstorage as soon as the user presses logout button
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  // Function to handle hover state for links
  const handleMouseEnter = (e) => {
    e.target.style.color = styles.linkHover.color;
  };

  const handleMouseLeave = (e) => {
    e.target.style.color = styles.link.color;
  };

  // Function to handle hover state for button
  const handleButtonMouseEnter = (e) => {
    e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
  };

  const handleButtonMouseLeave = (e) => {
    e.target.style.backgroundColor = styles.button.backgroundColor;
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.linkContainer}>
          {localStorage.getItem("role") === "employee" && (
            <a
              href="/employee-dashboard"
              style={styles.link}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Employee Dashboard
            </a>
          )}
          {localStorage.getItem("role") === "admin" && (
            <a
              href="/admin-dashboard"
              style={styles.link}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Admin Dashboard
            </a>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={styles.button}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
