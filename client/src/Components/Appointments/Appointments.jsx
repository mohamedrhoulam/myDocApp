import React, {useState, useEffect} from "react";
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashAlt, faEdit, faPlus, faSortUp, faSortDown} from '@fortawesome/free-solid-svg-icons';
import "./Appointments.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [updatedAppointment, setUpdatedAppointment] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newAppointment, setNewAppointment] = useState({});
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/appointments`, newAppointment);
      await fetchAppointments();
      setIsAddFormVisible(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Display an alert to the user
        alert(error.response.data.error);
      } else {
        console.error("Failed to add appointment:", error);
      }
    }
  };

  const handleNewInputChange = (e) => {
    setNewAppointment({
      ...newAppointment,
      [e.target.name]: e.target.value,
    });
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // If the current sort field is clicked, reverse the sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If a new sort field is clicked, sort in ascending order
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const sortedAppointments = [...appointments].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const currentItems = sortedAppointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="appointments-container">
      <h2>Upcoming Appointments</h2>
      <button className="add-button" onClick={() => setIsAddFormVisible(true)}>
        <FontAwesomeIcon icon={faPlus} size="lg"/>
        Add Appointment
      </button>
      <table>
        <thead>
        <tr>
          <th onClick={() => handleSort('apt_id')}>
            Appointment ID{' '}
            {sortField === 'apt_id' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
            )}
          </th>
          <th onClick={() => handleSort('apt_date')}>
            Date{' '}
            {sortField === 'apt_date' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
            )}
          </th>
          <th onClick={() => handleSort("apt_status")}>
            Status{" "}
            {sortField === "apt_status" && (
              <FontAwesomeIcon
                icon={sortDirection === "asc" ? faSortUp : faSortDown}
              />
            )}
          </th>
          <th onClick={() => handleSort("patient_id")}>
            Patient ID{" "}
            {sortField === "patient_id" && (
              <FontAwesomeIcon
                icon={sortDirection === "asc" ? faSortUp : faSortDown}
              />
            )}
          </th>
          <th onClick={() => handleSort("patient_fname")}>
            First Name{" "}
            {sortField === "patient_fname" && (
              <FontAwesomeIcon
                icon={sortDirection === "asc" ? faSortUp : faSortDown}
              />
            )}
          </th>
          <th onClick={() => handleSort("patient_lname")}>
            Last Name{" "}
            {sortField === "patient_lname" && (
              <FontAwesomeIcon
                icon={sortDirection === "asc" ? faSortUp : faSortDown}
              />
            )}
          </th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {currentItems.map((appointment) => (
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
            <td>
              <button onClick={() => deleteAppointment(appointment.apt_id)}>
                <FontAwesomeIcon icon={faTrashAlt}/>
              </button>
              <button onClick={() => {
                setUpdatedAppointment(appointment);
                setIsFormVisible(true);
              }}>
                <FontAwesomeIcon icon={faEdit}/>
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
      {isFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsFormVisible(false)}>&times;</span>
            <h2>Update Appointment</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="datetime-local"
                name="apt_date"
                value={newAppointment.apt_date}
                onChange={handleNewInputChange}
                required
              />
              <select name="apt_status" value={updatedAppointment.apt_status} onChange={handleInputChange} required>
                <option value="">Select a status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Ongoing">Ongoing</option>
              </select>
              <input type="text" name="patient_id" value={updatedAppointment.patient_id} onChange={handleInputChange}
                     required/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      {isAddFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsAddFormVisible(false)}>&times;</span>
            <h2>Add Appointment</h2>
            <form onSubmit={handleAdd}>
              <input type="datetime-local" name="apt_date" value={newAppointment.apt_date}
                     onChange={handleNewInputChange} required/>
              <select name="apt_status" value={newAppointment.apt_status} onChange={handleNewInputChange} required>
                <option value="">Select a status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Ongoing">Ongoing</option>
              </select>
              <input type="text" name="patient_id" value={newAppointment.patient_id} onChange={handleNewInputChange}
                     required/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}