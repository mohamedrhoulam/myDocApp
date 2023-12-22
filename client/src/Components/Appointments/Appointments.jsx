import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Appointments.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointments");
      console.log(response.data); // Add this line
      setAppointments(response.data);
      console.log(appointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      fetchAppointments(); // Refresh the appointments list after deletion
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  const updateAppointment = async (id, updatedAppointment) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`, updatedAppointment);
      fetchAppointments(); // Refresh the appointments list after update
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  return (
      <div className="appointments-container">
        <h2>Upcoming Appointments</h2>
        <table>
          <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Patient ID</th>
          </tr>
          </thead>
          <tbody>
          {appointments.map((appointment) => (
              <tr key={appointment.apt_id}>
                <td>{appointment.apt_id}</td>
                <td>{appointment.apt_date}</td>
                <td>{appointment.apt_status}</td>
                <td>{appointment.patient_id}</td>
                <td>
                  <button onClick={() => deleteAppointment(appointment.apt_id)}>Delete</button>
                  <button onClick={() => updateAppointment(appointment.apt_id, { name: "Updated Appointment" })}>
                    Update
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}