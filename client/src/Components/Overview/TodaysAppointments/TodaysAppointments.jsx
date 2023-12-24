import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodaysAppointments.css";
export default function TodaysAppointments() {
  const [todaysAppointments, setTodaysAppointments] = useState([]);

  useEffect(() => {
    fetchTodaysAppointments();
  }, []);

  const fetchTodaysAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/todaysAppointments");
      setTodaysAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch today's appointments:", error);
    }
  };

  return (
    <div className="appointments-container">
      <h2>Today's Appointments</h2>
      <table>
        <thead>
        <tr>
          <th>Appointment ID</th>
          <th>Date</th>
          <th>Status</th>
          <th>Patient ID</th>
          <th>First Name</th>
          <th>Last Name</th>
        </tr>
        </thead>
        <tbody>
        {todaysAppointments.map((appointment) => (
          <tr key={appointment.apt_id}>
            <td>{appointment.apt_id}</td>
            <td>{new Date(appointment.apt_date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</td>
            <td>
              <span className={`status ${appointment.apt_status.toLowerCase()}`}>
                {appointment.apt_status}
              </span>
            </td>
            <td>{appointment.patient_id}</td>
            <td>{appointment.patient_fname}</td>
            <td>{appointment.patient_lname}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}