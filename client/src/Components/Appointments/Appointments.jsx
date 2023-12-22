import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Appointments.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [updatedAppointment, setUpdatedAppointment] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      await fetchAppointments(); // Refresh the appointments list after deletion
    } catch (error) {
      console.error("Failed to delete appointment:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/appointments/${updatedAppointment.apt_id}`, updatedAppointment);
      await fetchAppointments(); // Refresh the appointments list after update
      setIsFormVisible(false); // Hide the form
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedAppointment({
      ...updatedAppointment,
      [e.target.name]: e.target.value,
    });
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
            <th>First Name</th>
            <th>Last Name</th>
            <th>     </th>
          </tr>
          </thead>
          <tbody>
          {appointments.map((appointment) => (
              <tr key={appointment.apt_id}>
                <td>{appointment.apt_id}</td>
                <td>{appointment.apt_date}</td>
                <td>{appointment.apt_status}</td>
                <td>{appointment.patient_id}</td>
                <td>{appointment.patient_fname}</td>
                <td>{appointment.patient_lname}</td>
                <td>
                  <button onClick={() => deleteAppointment(appointment.apt_id)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                  <button onClick={() => { setUpdatedAppointment(appointment); setIsFormVisible(true); }}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
        {isFormVisible && (
            <form onSubmit={handleUpdate}>
              <input type="text" name="apt_date" value={updatedAppointment.apt_date} onChange={handleInputChange} required />
              <input type="text" name="apt_status" value={updatedAppointment.apt_status} onChange={handleInputChange} required />
              <input type="text" name="patient_id" value={updatedAppointment.patient_id} onChange={handleInputChange} required />
              <button type="submit">Submit</button>
            </form>
        )}
      </div>
  );
}