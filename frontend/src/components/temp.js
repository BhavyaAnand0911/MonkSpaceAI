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
  availabilityTime: {
    fontSize: "14px",
  },
  notAvailable: {
    fontSize: "14px",
    color: "#a0aec0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  select: {
    width: "100%",
    padding: "8px",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    fontSize: "14px",
  },
  inputGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  input: {
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
};

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [shift, setShift] = useState({ date: "", startTime: "", endTime: "" });
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    // Add debug log
    console.log("Fetching availability data...");

    fetch("http://localhost:5000/api/admin/availability", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Received data from API:", data);
        setEmployees(data);
      })
      .catch((err) => console.error("Error fetching availability:", err));
  }, []);
  useEffect(() => {
    if (shift.date && shift.startTime && shift.endTime) {
      const available = employees.filter((emp) => {
        const matchingAvailability = emp.availability.find((avail) => {
          // Convert dates to same format for comparison
          const availDate = new Date(avail.date).toDateString();
          const shiftDate = new Date(shift.date).toDateString();

          if (availDate !== shiftDate) return false;

          // Check if shift time falls within availability
          return (
            avail.startTime <= shift.startTime && avail.endTime >= shift.endTime
          );
        });
        return matchingAvailability;
      });

      // Sort by availability start time
      available.sort((a, b) => {
        const aTime = a.availability[0]?.startTime || "";
        const bTime = b.availability[0]?.startTime || "";
        return aTime.localeCompare(bTime);
      });

      setAvailableEmployees(available);
    }
  }, [shift, employees]);

  const handleShiftAssign = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      alert("Please select a valid employee.");
      return;
    }

    const shiftData = {
      ...shift,
      employeeId: selectedEmployee,
      adminId: localStorage.getItem("adminId"),
      timeZone: "UTC",
    };

    try {
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
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error assigning shift:", error);
      alert("Failed to assign shift. Please try again.");
    }
  };

  const formatDateForComparison = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getCurrentWeekDates();

  const checkAvailability = (employeeAvailability, currentDate) => {
    if (!employeeAvailability || !Array.isArray(employeeAvailability)) {
      console.log("No availability data for employee");
      return null;
    }

    const formattedCurrentDate = formatDateForComparison(currentDate);

    // Debug log
    console.log("Checking availability for date:", formattedCurrentDate);
    console.log(
      "Available dates:",
      employeeAvailability.map((a) => formatDateForComparison(a.date))
    );

    const availability = employeeAvailability.find((avail) => {
      const formattedAvailDate = formatDateForComparison(avail.date);
      return formattedAvailDate === formattedCurrentDate;
    });

    return availability;
  };

  //const weekDates = getCurrentWeekDates();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
        </div>

        <div>
          <h2 style={styles.sectionTitle}>Employee Availability</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Employee</th>
                  {weekDates.map((date) => (
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
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td style={styles.td}>{emp.name}</td>
                    {weekDates.map((date) => {
                      // Debug log
                      console.log(
                        `Checking availability for ${
                          emp.name
                        } on ${formatDateForComparison(date)}`
                      );

                      const availability = checkAvailability(
                        emp.availability,
                        date
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

          <div>
            <h2 style={styles.sectionTitle}>Assign Shift</h2>
            <form onSubmit={handleShiftAssign} style={styles.form}>
              <select
                onChange={(e) => setSelectedEmployee(e.target.value)}
                required
                style={styles.select}
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
              <div style={styles.inputGroup}>
                <input
                  type="date"
                  onChange={(e) => setShift({ ...shift, date: e.target.value })}
                  required
                  style={styles.input}
                />
                <input
                  type="time"
                  onChange={(e) =>
                    setShift({ ...shift, startTime: e.target.value })
                  }
                  required
                  style={styles.input}
                />
                <input
                  type="time"
                  onChange={(e) =>
                    setShift({ ...shift, endTime: e.target.value })
                  }
                  required
                  style={styles.input}
                />
              </div>
              <button
                type="submit"
                style={styles.button}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#2c5282")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#3182ce")}
              >
                Assign Shift
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
