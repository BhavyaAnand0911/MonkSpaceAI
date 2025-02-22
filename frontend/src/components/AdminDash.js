import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [shift, setShift] = useState({ date: "", startTime: "", endTime: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/availability", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Employees:", data); // Debugging log
        setEmployees(data);
      })
      .catch((err) => console.error("Error fetching availability:", err));
  }, []);

  const handleShiftAssign = async (e) => {
    e.preventDefault();

    console.log("Selected Employee ID:", selectedEmployee); // Debugging log

    if (!selectedEmployee) {
      alert("Please select a valid employee.");
      return;
    }

    const shiftData = {
      ...shift,
      employeeId: selectedEmployee, // Use selectedEmployee directly
      adminId: localStorage.getItem("adminId"),
      timeZone: "UTC",
    };

    console.log("Sending Shift Data:", shiftData); // Debugging log

    const response = await fetch("http://localhost:5000/api/admin/shifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(shiftData),
    });

    const data = await response.json();
    console.log("Shift API Response:", data); // Debugging log

    if (response.ok) {
      alert("Shift assigned successfully");
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <h3>Employee Availability</h3>
      <ul>
        {employees.map((emp, index) => (
          <li key={index}>
            {emp.name}: {emp.availability}
          </li>
        ))}
      </ul>
      <h3>Assign Shift</h3>
      <form onSubmit={handleShiftAssign}>
        <select onChange={(e) => setSelectedEmployee(e.target.value)} required>
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          onChange={(e) => setShift({ ...shift, date: e.target.value })}
          required
        />
        <input
          type="time"
          onChange={(e) => setShift({ ...shift, startTime: e.target.value })}
          required
        />
        <input
          type="time"
          onChange={(e) => setShift({ ...shift, endTime: e.target.value })}
          required
        />
        <button type="submit">Assign Shift</button>
      </form>
    </div>
  );
}
