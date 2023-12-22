import React, {useState, useEffect} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faEdit, faPlus, faSortUp, faSortDown} from "@fortawesome/free-solid-svg-icons";
import "./Patients.css";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [updatedPatient, setUpdatedPatient] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newPatient, setNewPatient] = useState({});
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      console.error("Error details:", error.response);
    }
  };

  const deletePatient = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      await fetchPatients();
    } catch (error) {
      console.error("Failed to delete patient:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/patients`, newPatient);
      await fetchPatients();
      setIsAddFormVisible(false);
    } catch (error) {
      console.error("Failed to add patient:", error);
    }
  };

  const handleNewInputChange = (e) => {
    setNewPatient({
      ...newPatient,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/patients/${updatedPatient.patient_id}`, updatedPatient);
      await fetchPatients();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Failed to update patient:", error);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedPatient({
      ...updatedPatient,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const totalPages = Math.ceil(patients.length / itemsPerPage);
  const sortedPatients = [...patients].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const currentItems = sortedPatients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="patients-container">
      <h2>Patients</h2>
      <button className="add-button" onClick={() => setIsAddFormVisible(true)}>
        <FontAwesomeIcon icon={faPlus} size="lg"/>
        Add Patient
      </button>
      <table>
        <thead>
        <tr>
          <th>Patient ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone Number</th>
          <th>Date of Birth</th>
          <th>Sex</th>
          <th>Email</th>
          <th>CIN</th>
          <th>City</th>
          <th>Street</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {currentItems.map((patient) => (
          <tr key={patient.patient_id}>
            <td>{patient.patient_id}</td>
            <td>{patient.patient_fname}</td>
            <td>{patient.patient_lname}</td>
            <td>{patient.patient_phoneNum}</td>
            <td>{patient.patient_dateOfBirth}</td>
            <td>{patient.patient_sex}</td>
            <td>{patient.patient_email}</td>
            <td>{patient.patient_cin}</td>
            <td>{patient.patient_city}</td>
            <td>{patient.patient_street}</td>
            <td>
              <button onClick={() => deletePatient(patient.patient_id)}>
                <FontAwesomeIcon icon={faTrashAlt}/>
              </button>
              <button onClick={() => {
                setUpdatedPatient(patient);
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
            <h2>Update Patient</h2>
            <form onSubmit={handleUpdate}>
              <input type="text" name="patient_fname" value={updatedPatient.patient_fname} onChange={handleInputChange}
                     required/>
              <input type="text" name="patient_lname" value={updatedPatient.patient_lname} onChange={handleInputChange}
                     required/>
              <input type="text" name="patient_phoneNum" value={updatedPatient.patient_phoneNum}
                     onChange={handleInputChange} required/>
              <input type="date" name="patient_dateOfBirth" value={updatedPatient.patient_dateOfBirth}
                     onChange={handleInputChange} required/>
              <input type="text" name="patient_sex" value={updatedPatient.patient_sex} onChange={handleInputChange}
                     required/>
              <input type="email" name="patient_email" value={updatedPatient.patient_email} onChange={handleInputChange}
                     required/>
              <input type="text" name="patient_cin" value={updatedPatient.patient_cin} onChange={handleInputChange}
                     required/>
              <input type="text" name="patient_city" value={updatedPatient.patient_city} onChange={handleInputChange}
                     required/>
              <input type="text" name="patient_street" value={updatedPatient.patient_street}
                     onChange={handleInputChange} required/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      {isAddFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsAddFormVisible(false)}>&times;</span>
            <h2>Add Patient</h2>
            <form onSubmit={handleAdd}>
              <input type="text" name="patient_fname" value={newPatient.patient_fname} onChange={handleNewInputChange}
                     required/>
              <input type="text" name="patient_lname" value={newPatient.patient_lname} onChange={handleNewInputChange}
                     required/>
              <input type="text" name="patient_phoneNum" value={newPatient.patient_phoneNum}
                     onChange={handleNewInputChange} required/>
              <input type="date" name="patient_dateOfBirth" value={newPatient.patient_dateOfBirth}
                     onChange={handleNewInputChange} required/>
              <input type="text" name="patient_sex" value={newPatient.patient_sex} onChange={handleNewInputChange}
                     required/>
              <input type="email" name="patient_email" value={newPatient.patient_email} onChange={handleNewInputChange}
                     required/>
              <input type="text" name="patient_cin" value={newPatient.patient_cin} onChange={handleNewInputChange}
                     required/>
              <input type="text" name="patient_city" value={newPatient.patient_city} onChange={handleNewInputChange}
                     required/>
              <input type="text" name="patient_street" value={newPatient.patient_street} onChange={handleNewInputChange}
                     required/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}