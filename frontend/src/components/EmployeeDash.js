import React, { useEffect, useState } from "react";

export default function EmployeeDashboard() {
  const [shifts, setShifts] = useState([]);
  const [availability, setAvailability] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/employee/shifts", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setShifts(data))
      .catch((err) => console.error("Error fetching shifts:", err)); // Debugging
  }, []);

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // Ensure the correct employee ID is sent

    const availabilityData = {
      ...availability,
      userId, // Send user ID with request
    };

    console.log("Submitting Availability:", availabilityData); // Debugging log

    const response = await fetch(
      "http://localhost:5000/api/employee/availability",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(availabilityData),
      }
    );

    const data = await response.json();
    console.log("Availability API Response:", data); // Debugging log

    if (response.ok) {
      alert("Availability added successfully");
      setAvailability({ date: "", startTime: "", endTime: "" }); // Reset form

      // Refresh availability in UI
      fetch("http://localhost:5000/api/employee/shifts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
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
