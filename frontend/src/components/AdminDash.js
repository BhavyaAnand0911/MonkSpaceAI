import React, { useEffect, useState } from "react";

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    padding: "20px",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },
  adminName: {
    fontSize: "16px",
    color: "#4a5568",
    marginTop: "4px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "16px",
    color: "#2d3748",
  },
  tableContainer: {
    overflowX: "auto",
    marginBottom: "32px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "24px",
    backgroundColor: "white",
  },
  th: {
    border: "1px solid #e2e8f0",
    padding: "12px",
    backgroundColor: "#f7fafc",
    textAlign: "left",
  },
  td: {
    border: "1px solid #e2e8f0",
    padding: "12px",
    textAlign: "left",
  },
  dayName: {
    fontWeight: "500",
    marginBottom: "4px",
  },
  date: {
    fontSize: "12px",
    color: "#718096",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "8px",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    backgroundColor: "#3182ce",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  availabilityTime: {
    fontSize: "14px",
    backgroundColor: "#e6f3ff",
    padding: "4px 8px",
    borderRadius: "4px",
    textAlign: "center",
  },
  notAvailable: {
    fontSize: "14px",
    color: "#a0aec0",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#cbd5e0",
    cursor: "not-allowed",
  },
};

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [adminName, setAdminName] = useState("");
  const [shift, setShift] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  // calling the fucntions to fetch admin name and employees that are available as soon as the page gets loaded
  useEffect(() => {
    fetchEmployees();
    fetchAdminName();
  }, []);
  const fetchAdminName = async () => {
    try {
      console.log("Trying to fetch admin name...");
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. User might not be logged in.");
        return;
      }
      // calling the api/admin/profile API endpoint to fetch the details of the logged in admin such as name
      const response = await fetch("http://localhost:5000/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      if (data.name) {
        setAdminName(data.name);
        console.log(data.name, "This is admin name debug log");
      } else {
        console.warn("No admin name received from the server.");
      }
    } catch (error) {
      console.error("Error fetching admin name:", error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        // calling the api/admin/availability API endpoint to fetch all the available employees
        "http://localhost:5000/api/admin/availability",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    if (shift.date && shift.startTime && shift.endTime) {
      // filtering the employees by matching the date of availability
      const available = employees.filter((emp) => {
        const matchingAvailability = emp.availability.find((avail) => {
          const availDate = new Date(avail.date).toDateString();
          const shiftDate = new Date(shift.date).toDateString();

          if (availDate !== shiftDate) return false;

          return (
            avail.startTime <= shift.startTime && avail.endTime >= shift.endTime
          );
        });
        return matchingAvailability;
      });

      setAvailableEmployees(available);
      setSelectedEmployee("");
    } else {
      setAvailableEmployees([]);
    }
  }, [shift, employees]);

  const handleShiftAssign = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }

    const shiftData = {
      ...shift,
      employeeId: selectedEmployee,
      adminId: localStorage.getItem("adminId"),
      timeZone: "UTC",
    };

    try {
      // calling api/admin/shifts API endpoint to send a POST request and store the shifsts for the available employees
      const response = await fetch("http://localhost:5000/api/admin/shifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(shiftData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Shift assigned successfully");
        setShift({ date: "", startTime: "", endTime: "" });
        setSelectedEmployee("");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error assigning shift:", error);
      alert("Failed to assign shift. Please try again.");
    }
  };

  const getNextSevenDays = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const formatDateForComparison = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const nextSevenDays = getNextSevenDays();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <div style={styles.adminName}>Administrator: {adminName}</div>
        </div>

        <div>
          <h2 style={styles.sectionTitle}>Create and Assign Shift</h2>
          <form onSubmit={handleShiftAssign} style={styles.form}>
            <div style={styles.inputGroup}>
              <input
                type="date"
                value={shift.date}
                onChange={(e) => setShift({ ...shift, date: e.target.value })}
                required
                style={styles.input}
                min={new Date().toISOString().split("T")[0]}
              />
              <input
                type="time"
                value={shift.startTime}
                onChange={(e) =>
                  setShift({ ...shift, startTime: e.target.value })
                }
                required
                style={styles.input}
              />
              <input
                type="time"
                value={shift.endTime}
                onChange={(e) =>
                  setShift({ ...shift, endTime: e.target.value })
                }
                required
                style={styles.input}
              />
            </div>

            {shift.date && shift.startTime && shift.endTime && (
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                style={styles.select}
              >
                <option value="">Select Available Employee</option>
                {availableEmployees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            )}

            <button
              type="submit"
              style={{
                ...styles.button,
                ...((!shift.date ||
                  !shift.startTime ||
                  !shift.endTime ||
                  !selectedEmployee) &&
                  styles.disabledButton),
              }}
              disabled={
                !shift.date ||
                !shift.startTime ||
                !shift.endTime ||
                !selectedEmployee
              }
            >
              Assign Shift
            </button>
          </form>

          <h2 style={styles.sectionTitle}>Next 7 Days Availability</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee</th>
                  {nextSevenDays.map((date) => (
                    <th key={date.toISOString()} style={styles.th}>
                      <div style={styles.dayName}>
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div style={styles.date}>
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td style={styles.td}>{employee.name}</td>
                    {nextSevenDays.map((date) => {
                      const availability = employee.availability?.find(
                        (a) =>
                          formatDateForComparison(a.date) ===
                          formatDateForComparison(date)
                      );

                      return (
                        <td key={date.toISOString()} style={styles.td}>
                          {availability ? (
                            <div style={styles.availabilityTime}>
                              {`${availability.startTime} - ${availability.endTime}`}
                            </div>
                          ) : (
                            <div style={styles.notAvailable}>Not available</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
