import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function EmployeeDashboard() {
  const [shifts, setShifts] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [availability, setAvailability] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.id : null;

  useEffect(() => {
    if (!userId) {
      console.error("User ID not found in token.");
      return;
    }

    // Fetch shifts
    fetch(`http://localhost:5000/api/employee/shifts?userId=${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setShifts(data))
      .catch((err) => console.error("Error fetching shifts:", err));

    // Fetch availabilities
    fetch(`http://localhost:5000/api/employee/availability/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setAvailabilities(data))
      .catch((err) => console.error("Error fetching availability:", err));
  }, [userId]);

  // Validate if the time difference is at least 4 hours
  const validateFourHours = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffHours = (end - start) / (1000 * 60 * 60);
    return diffHours >= 4;
  };

  // Check if the date is within the current week (Sunday to Saturday)
  const isDateInCurrentWeek = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const sunday = new Date(now.setDate(now.getDate() - now.getDay()));
    sunday.setHours(0, 0, 0, 0);
    const saturday = new Date(sunday);
    saturday.setDate(saturday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    return date >= sunday && date <= saturday;
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    // Validate minimum 4 hours
    if (!validateFourHours(availability.startTime, availability.endTime)) {
      setError("Availability must be for at least four hours.");
      return;
    }

    // Validate if date is in current week
    if (!isDateInCurrentWeek(availability.date)) {
      setError(
        "Please select a date within the current week (Sunday to Saturday)."
      );
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/employee/availability",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...availability, userId }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      alert("Availability added successfully");
      setAvailability({ date: "", startTime: "", endTime: "" });

      // Refresh availabilities
      fetch(`http://localhost:5000/api/employee/availability/user/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => setAvailabilities(data))
        .catch((err) =>
          console.error("Error fetching updated availability:", err)
        );
    } else {
      setError(data.error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee Dashboard</h2>

      <h3>Assigned Shifts</h3>
      <ul>
        {shifts.length > 0 ? (
          shifts.map((shift, index) => (
            <li key={index}>
              {new Date(shift.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              (From{" "}
              {new Date(`2000-01-01T${shift.startTime}`).toLocaleTimeString(
                "en-US",
                { hour: "numeric", minute: "2-digit", hour12: true }
              )}{" "}
              to{" "}
              {new Date(`2000-01-01T${shift.endTime}`).toLocaleTimeString(
                "en-US",
                { hour: "numeric", minute: "2-digit", hour12: true }
              )}
              )
            </li>
          ))
        ) : (
          <p>No shifts assigned yet.</p>
        )}
      </ul>

      <h3>Add Availability</h3>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <form onSubmit={handleAvailabilitySubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label>Date:</label>
          <input
            type="date"
            value={availability.date}
            onChange={(e) =>
              setAvailability({ ...availability, date: e.target.value })
            }
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label>Start Time:</label>
          <input
            type="time"
            value={availability.startTime}
            onChange={(e) =>
              setAvailability({ ...availability, startTime: e.target.value })
            }
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label>End Time:</label>
          <input
            type="time"
            value={availability.endTime}
            onChange={(e) =>
              setAvailability({ ...availability, endTime: e.target.value })
            }
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Submit
        </button>
      </form>

      <h3>Current Availability</h3>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Time Range</th>
            </tr>
          </thead>
          <tbody>
            {availabilities.map((avail, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>
                  {new Date(avail.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td style={tableCellStyle}>
                  {avail.startTime} - {avail.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const formStyle = {
  maxWidth: "500px",
  margin: "20px 0",
};

const formGroupStyle = {
  marginBottom: "15px",
  display: "flex",
  flexDirection: "column",
};

const inputStyle = {
  padding: "8px",
  marginTop: "5px",
  border: "1px solid #ddd",
  borderRadius: "4px",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const tableHeaderStyle = {
  backgroundColor: "#f4f4f4",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
};

const tableCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};
