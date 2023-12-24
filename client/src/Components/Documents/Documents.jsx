import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlus, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import "./Documents.css";

export default function Documents() {
  const [certificates, setCertificates] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [newCertificate, setNewCertificate] = useState({});
  const [newPrescription, setNewPrescription] = useState({});
  const [isCertificateFormVisible, setIsCertificateFormVisible] = useState(false);
  const [isPrescriptionFormVisible, setIsPrescriptionFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [updatedCertificate, setUpdatedCertificate] = useState({});
  const [updatedPrescription, setUpdatedPrescription] = useState({});
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    fetchCertificates();
    fetchPrescriptions();
  }, []);
  useEffect(() => {
    fetchEmployees();
  }, []);
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };


  const fetchCertificates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/certificates");
      setCertificates(response.data);
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    }
  };



  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/prescriptions");
      setPrescriptions(response.data);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
    }
  };

  const addCertificate = async (certificate) => {
    try {
      await axios.post("http://localhost:5000/api/certificates", certificate);
      fetchCertificates();
      console.log("Certificate added successfully!"); // Add this line
    } catch (error) {
      console.error("Failed to add certificate:", error);
    }
  };

  const updateCertificate = async (id, certificate) => {
    try {
      await axios.put(`http://localhost:5000/api/certificates/${id}`, certificate);
      fetchCertificates();
    } catch (error) {
      console.error("Failed to update certificate:", error);
    }
  };

  const deleteCertificate = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/certificates/${id}`);
      // Update state by fetching the updated list of certificates
      fetchCertificates();
    } catch (error) {
      console.error("Failed to delete certificate:", error);
    }
  };




  const addPrescription = async (prescription) => {
    try {
      await axios.post("http://localhost:5000/api/prescriptions", prescription);
      fetchPrescriptions();
    } catch (error) {
      console.error("Failed to add prescription:", error);
    }
  };

  const updatePrescription = async (id, prescription) => {
    try {
      await axios.put(`http://localhost:5000/api/prescriptions/${id}`, prescription);
      fetchPrescriptions();
    } catch (error) {
      console.error("Failed to update prescription:", error);
    }
  };

  const deletePrescription = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/prescriptions/${id}`);
      fetchPrescriptions();
    } catch (error) {
      console.error("Failed to delete prescription:", error);
    }
  };

  const handleNewCertificateChange = (e) => {
    setNewCertificate({
      ...newCertificate,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatedCertificateChange = (e) => {
    setUpdatedCertificate({
      ...updatedCertificate,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewPrescriptionChange = (e) => {
    setNewPrescription({
      ...newPrescription,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatedPrescriptionChange = (e) => {
    setUpdatedPrescription({
      ...updatedPrescription,
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
  const handleDeleteCertificate = async (doc_id) => {
    try {
      await deleteCertificate(doc_id);
      fetchCertificates(); // Add this line
    } catch (error) {
      console.error("Failed to delete certificate:", error);
    }
  };

  return (
    <div className="documents-container">
      <div className="certificates-container">
        <h2>Certificates</h2>
        <button className="add-button" onClick={() => setIsCertificateFormVisible(true)}>
          <FontAwesomeIcon icon={faPlus} size="lg"/>
          Add Certificate
        </button>
        <table>
          <thead>
          <tr>
            <th>Document ID</th>
            <th>Document Type</th>
            <th>Creation Date</th>
            <th>Document URL</th>
            <th>Employee ID</th>
            <th>Certificate Duration</th>
            <th>Days Remaining</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {certificates.map((certificate) => (
            <tr key={certificate.doc_id}>
              <td>{certificate.doc_id}</td>
              <td>{certificate.doc_type}</td>
              <td>{new Date(certificate.doc_date).toLocaleDateString()}</td>
              <td><a href={certificate.doc_desc} target="_blank" rel="noopener noreferrer">View Document</a></td>
              <td>{certificate.emp_id}</td>
              <td>{certificate.cert_duration}</td>
              <td>{certificate.remaining_days}</td>
              <td>{/* Call the stored function to get the remaining days */}</td>

              <td>
                <button onClick={() => {
                  setUpdatedCertificate(certificate);
                  setIsUpdateFormVisible(true);
                }}>
                  <FontAwesomeIcon icon={faEdit}/>
                </button>
                <button onClick={() => handleDeleteCertificate(certificate.doc_id)}>
                  <FontAwesomeIcon icon={faTrashAlt}/>
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        {isCertificateFormVisible && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={() => setIsCertificateFormVisible(false)}>&times;</span>
              <h2>Add Certificate</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                addCertificate(newCertificate);
              }}>
                <label>
                  Upload Document:
                  <input type="text" name="doc_desc" value={newCertificate.doc_desc || ''} onChange={handleNewCertificateChange} required />
                </label>
                <label>
                  Author:
                  <select name="emp_id" value={newCertificate.emp_id || ''} onChange={handleNewCertificateChange} required>
                    {employees.map((employee) => (
                      <option key={employee.emp_id} value={employee.emp_id}>
                        {employee.emp_id} - {employee.emp_fname}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Duration:
                  <input type="number" name="cert_duration" value={newCertificate.cert_duration || ''} onChange={handleNewCertificateChange} required />
                </label>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}
        {isUpdateFormVisible && (
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={() => setIsUpdateFormVisible(false)}>&times;</span>
              <h2>Update Certificate</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                updateCertificate(updatedCertificate.doc_id, updatedCertificate);
              }}>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="prescriptions-container">
        <h2>Prescriptions</h2>
        <button className="add-button" onClick={() => setIsPrescriptionFormVisible(true)}>
          <FontAwesomeIcon icon={faPlus} size="lg"/>
          Add Prescription
        </button>
      </div>
  </div>
  );
}