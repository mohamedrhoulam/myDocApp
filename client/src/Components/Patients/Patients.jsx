import React, {useState, useEffect} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faEdit, faPlus, faSortUp, faSortDown} from "@fortawesome/free-solid-svg-icons";
import "./Patients.css";
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
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
  const [patientAges, setPatientAges] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    // Filter patients by searchQuery
    const filteredPatients = patients.filter(patient => patient.patient_id.toString() === searchQuery);
    setPatients(filteredPatients);
  };

  const handleResetSearch = () => {
    // Reset the search and display all patients
    setSearchQuery('');
    fetchPatients();
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/patients");
      setPatients(response.data);

      const ages = {};
      for (const patient of response.data) {
        const ageResponse = await axios.get(`http://localhost:5000/api/patients/${patient.patient_id}/age`);
        ages[patient.patient_id] = ageResponse.data.age;
      }
      setPatientAges(ages);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
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
      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search by Patient ID"
        />
        <button onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch}/>
        </button>
        <button onClick={handleResetSearch}>
          <FontAwesomeIcon icon={faTimes}/>
        </button>
      </div>
      <button className="add-button" onClick={() => setIsAddFormVisible(true)}>
        <FontAwesomeIcon icon={faPlus} size="lg"/>
        Add Patient
      </button>
      <table>
        <thead>
        <tr>
          <th onClick={() => handleSort('patient_id')}>Patient ID</th>
          <th onClick={() => handleSort('patient_fname')}>First Name</th>
          <th onClick={() => handleSort('patient_lname')}>Last Name</th>
          <th onClick={() => handleSort('patient_phoneNum')}>Phone Number</th>
          <th onClick={() => handleSort('patient_sex')}>Sex</th>
          <th onClick={() => handleSort('patient_email')}>Email</th>
          <th onClick={() => handleSort('patient_cin')}>CIN</th>
          <th onClick={() => handleSort('patient_city')}>City</th>
          <th onClick={() => handleSort('patient_street')}>Street</th>
          <th>Age</th>
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
            <td>{patient.patient_sex}</td>
            <td>{patient.patient_email}</td>
            <td>{patient.patient_cin}</td>
            <td>{patient.patient_city}</td>
            <td>{patient.patient_street}</td>
            <td>{patientAges[patient.patient_id]}</td>
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
              <input type="text" name="patient_fname" value={updatedPatient.patient_fname} onChange={handleInputChange} placeholder="First Name" required className="form-input"/>
              <input type="text" name="patient_lname" value={updatedPatient.patient_lname} onChange={handleInputChange} placeholder="Last Name" required className="form-input"/>
              <input type="text" name="patient_phoneNum" value={updatedPatient.patient_phoneNum} onChange={handleInputChange} placeholder="Phone Number" required className="form-input"/>
              <input type="text" name="patient_sex" value={updatedPatient.patient_sex} onChange={handleInputChange} placeholder="Sex" required className="form-input"/>
              <input type="email" name="patient_email" value={updatedPatient.patient_email} onChange={handleInputChange} placeholder="Email" required className="form-input"/>
              <input type="text" name="patient_cin" value={updatedPatient.patient_cin} onChange={handleInputChange} placeholder="CIN" required className="form-input"/>
              <input type="text" name="patient_city" value={updatedPatient.patient_city} onChange={handleInputChange} placeholder="City" required className="form-input"/>
              <input type="text" name="patient_street" value={updatedPatient.patient_street} onChange={handleInputChange} placeholder="Street" required className="form-input"/>
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
              <input type="text" name="patient_fname" value={newPatient.patient_fname} onChange={handleNewInputChange} placeholder="First Name" required className="form-input"/>
              <input type="text" name="patient_lname" value={newPatient.patient_lname} onChange={handleNewInputChange} placeholder="Last Name" required className="form-input"/>
              <input type="text" name="patient_phoneNum" value={newPatient.patient_phoneNum} onChange={handleNewInputChange} placeholder="Phone Number" required className="form-input"/>
              <input type="text" name="patient_sex" value={newPatient.patient_sex} onChange={handleNewInputChange} placeholder="Sex" required className="form-input"/>
              <input type="email" name="patient_email" value={updatedPatient.patient_email} onChange={handleInputChange} placeholder="Email" required className="form-input"/>              <input type="text" name="patient_cin" value={newPatient.patient_cin} onChange={handleNewInputChange} placeholder="CIN" required className="form-input"/>
              <input type="text" name="patient_city" value={newPatient.patient_city} onChange={handleNewInputChange} placeholder="City" required className="form-input"/>
              <input type="text" name="patient_street" value={newPatient.patient_street} onChange={handleNewInputChange} placeholder="Street" required className="form-input"/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}