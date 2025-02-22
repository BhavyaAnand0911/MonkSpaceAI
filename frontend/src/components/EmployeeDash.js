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

    // Fetch user's availability
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

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID not found. Please log in again.");
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

      // Refresh availabilities after adding new one
      fetch(`http://localhost:5000/api/employee/availability/user/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setAvailabilities(data))
        .catch((err) =>
          console.error("Error fetching updated availability:", err)
        );
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  };

  const sortAvailabilities = (availabilities) => {
    return availabilities.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Employee Dashboard</h2>

      <h3>Assigned Shifts</h3>
      <ul>
        {shifts.length > 0 ? (
          shifts.map((shift, index) => (
            <li key={index}>
              {shift.date} - {shift.startTime} to {shift.endTime}
            </li>
          ))
        ) : (
          <p>No shifts assigned yet.</p>
        )}
      </ul>

      <h3>Your Availability Schedule</h3>
      <div style={{ overflowX: "auto", marginBottom: "20px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Day</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Time Range</th>
            </tr>
          </thead>
          <tbody>
            {sortAvailabilities(availabilities).map((avail, index) => {
              const { dayName, date } = formatDate(avail.date);
              return (
                <tr key={index}>
                  <td style={tableCellStyle}>{dayName}</td>
                  <td style={tableCellStyle}>{date}</td>
                  <td style={tableCellStyle}>
                    {avail.startTime} - {avail.endTime}
                  </td>
                </tr>
              );
            })}
            {availabilities.length === 0 && (
              <tr>
                <td colSpan="3" style={tableCellStyle}>
                  No availability set
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h3>Add Availability</h3>
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
    </div>
  );
}

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

const formStyle = {
  maxWidth: "500px",
  margin: "0 auto",
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
