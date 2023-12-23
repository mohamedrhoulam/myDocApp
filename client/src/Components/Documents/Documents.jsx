import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Documents.css';

const Documents = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [formPrescription, setFormPrescription] = useState({});
  const [formCertificate, setFormCertificate] = useState({});

  useEffect(() => {
    fetchPrescriptions();
    fetchCertificates();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/prescriptions");
      setPrescriptions(response.data);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
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

  const handlePrescriptionFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/prescriptions`, formPrescription);
      await fetchPrescriptions();
      setShowPrescriptionForm(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Display an alert to the user
        alert(error.response.data.error);
      } else {
        console.error("Failed to add prescription:", error);
      }
    }
  };

  const handleCertificateFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/certificates`, formCertificate);
      await fetchCertificates();
      setShowCertificateForm(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Display an alert to the user
        alert(error.response.data.error);
      } else {
        console.error("Failed to add certificate:", error);
      }
    }
  };

  // Create a preview of the uploaded file
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="documents-container">
      <h2>Documents</h2>
      <div className="tables-container">
        <table>
          <thead>
          <tr>
            <th>Document ID</th>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th>Employee ID</th>
            <th>Prescription Description</th>
            <th>Medicine Serial Number</th>
          </tr>
          </thead>
          <tbody>
          {prescriptions.map((prescription) => (
            <tr key={prescription.doc_id}>
              <td>{prescription.doc_id}</td>
              <td>{prescription.doc_type}</td>
              <td>{prescription.doc_date}</td>
              <td>{prescription.doc_desc}</td>
              <td>{prescription.emp_id}</td>
              <td>{prescription.presc_desc}</td>
              <td>{prescription.med_serial_num}</td>
            </tr>
          ))}
          </tbody>
        </table>
        <table>
          <thead>
          <tr>
            <th>Document ID</th>
            <th>Type</th>
            <th>Date</th>
            <th>Description</th>
            <th>Employee ID</th>
            <th>Certificate Duration</th>
          </tr>
          </thead>
          <tbody>
          {certificates.map((certificate) => (
            <tr key={certificate.doc_id}>
              <td>{certificate.doc_id}</td>
              <td>{certificate.doc_type}</td>
              <td>{certificate.doc_date}</td>
              <td>{certificate.doc_desc}</td>
              <td>{certificate.emp_id}</td>
              <td>{certificate.cert_duration}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <div>
        <input type='file' accept=".pdf" onChange={onSelectFile} />
        {selectedFile &&  <iframe src={preview} width="500" height="500"/>}
      </div>
      {showPrescriptionForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowPrescriptionForm(false)}>&times;</span>
            <form onSubmit={handlePrescriptionFormSubmit}>
              {/* Add inputs for each attribute of a prescription */}
              <button type="submit">Save Prescription</button>
            </form>
          </div>
        </div>
      )}
      {showCertificateForm && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowCertificateForm(false)}>&times;</span>
            <form onSubmit={handleCertificateFormSubmit}>
              {/* Add inputs for each attribute of a certificate */}
              <button type="submit">Save Certificate</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;