import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function EmployeeDashboard() {
  const [shifts, setShifts] = useState([]);
  const [availability, setAvailability] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken ? decodedToken.id : null;
  console.log(userId);

  useEffect(() => {
    if (!userId) {
      console.error("User ID not found in token.");
      return;
    }

    console.log("Trying to fetch shifts");
    fetch(`http://localhost:5000/api/employee/shifts?userId=${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched shifts:", data);
        setShifts(data);
      })
      .catch((err) => console.error("Error fetching shifts:", err));
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

      fetch(`http://localhost:5000/api/employee/shifts?userId=${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => setShifts(data))
        .catch((err) => console.error("Error fetching updated shifts:", err));
    } else {
      alert(`Error: ${data.error}`);
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
              {shift.date} - {shift.startTime} to {shift.endTime}
            </li>
          ))
        ) : (
          <p>No shifts assigned yet.</p>
        )}
      </ul>
      <h3>Add Availability</h3>
      <form onSubmit={handleAvailabilitySubmit}>
        <input
          type="date"
          value={availability.date}
          onChange={(e) =>
            setAvailability({ ...availability, date: e.target.value })
          }
          required
        />
        <input
          type="time"
          value={availability.startTime}
          onChange={(e) =>
            setAvailability({ ...availability, startTime: e.target.value })
          }
          required
        />
        <input
          type="time"
          value={availability.endTime}
          onChange={(e) =>
            setAvailability({ ...availability, endTime: e.target.value })
          }
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
