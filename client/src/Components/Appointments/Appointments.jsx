import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/api/appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="appointments-container">
      <h2>Upcoming Appointments</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>{appointment.name}</li>
        ))}
      </ul>
    </div>
  );
}
