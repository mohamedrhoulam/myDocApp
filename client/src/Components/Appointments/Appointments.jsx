import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Appointments.css";

export default function Appointments({ onSearch }) {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("/api/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const searchAppointments = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`/api/appointments/search?term=${searchTerm}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to search appointments:", error);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`/api/appointments/${id}`);
      fetchAppointments(); // Refresh the appointments list after deletion
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  const updateAppointment = async (id, updatedAppointment) => {
    try {
      await axios.put(`/api/appointments/${id}`, updatedAppointment);
      fetchAppointments(); // Refresh the appointments list after update
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  useEffect(() => {
    if (onSearch) {
      onSearch(searchAppointments);
    }
  }, [onSearch]);

  return (
    <div className="appointments-container">
      <h2>Upcoming Appointments</h2>
      <form onSubmit={searchAppointments}>
        <input
          type="text"
          placeholder="Search appointments"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            {appointment.name}
            <button onClick={() => deleteAppointment(appointment.id)}>Delete</button>
            <button onClick={() => updateAppointment(appointment.id, { name: "Updated Appointment" })}>
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
