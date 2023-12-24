import React, {useState, useEffect} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faEdit, faPlus, faSortUp, faSortDown} from "@fortawesome/free-solid-svg-icons";
import "./Medicine.css";

export default function Medicine() {
  const [medicines, setMedicines] = useState([]);
// For newMedicine and updatedMedicine state objects
const [newMedicine, setNewMedicine] = useState({});

  const [updatedMedicine, setUpdatedMedicine] = useState({
    med_serial_num: '',
    med_name: '',
    med_expDate: '', // Adjusted to match snake_case convention
    med_prodDate: '', // Adjusted to match snake_case convention
    med_amount: ''
  });

  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/medicines");
      setMedicines(response.data);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
    }
  };

  const fetchExpiredMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/medicines/expired");
      setMedicines(response.data);
    } catch (error) {
      console.error("Failed to fetch expired medicines:", error);
    }
  };

  const addMedicine = async (e) => {
    e.preventDefault();
    console.log('Adding medicine:', newMedicine);

    try {
      console.log(newMedicine);
      const response = await axios.post("http://localhost:5000/api/medicines", {
        med_serial_num: newMedicine.med_serial_num,
        med_name: newMedicine.med_name,
        med_expDate: newMedicine.med_expDate,
        med_prodDate: newMedicine.med_prodDate,
        med_amount: newMedicine.med_amount
      });
      console.log(newMedicine);


      console.log('Response from server:', response);
      fetchMedicines();
      console.log(newMedicine);

      setIsAddFormVisible(false);
    } catch (error) {
      console.error("Failed to add medicine:", error);
    }
  };



  const updateMedicine = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/medicines/${updatedMedicine.MED_serial_num}`, updatedMedicine);
      fetchMedicines();
      setIsUpdateFormVisible(false);
    } catch (error) {
      console.error("Failed to update medicine:", error);
    }
  };

  const deleteMedicine = async (MED_serial_num) => {
    try {
      await axios.delete(`http://localhost:5000/api/medicines/${MED_serial_num}`);
      fetchMedicines();
    } catch (error) {
      console.error("Failed to delete medicine:", error);
    }
  };

  const handleNewInputChange = (e) => {
    setNewMedicine({
      ...newMedicine,
      [e.target.name]: e.target.value,
    });
  };


  const handleInputChange = (e) => {
    setUpdatedMedicine({
      ...updatedMedicine,
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

  const totalPages = Math.ceil(medicines.length / itemsPerPage);
  const sortedMedicines = [...medicines].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const currentItems = sortedMedicines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="medicines-container">
      <h2>Medicines</h2>
      <div className="button-container">
        <div className="button-group">
          <button className="add-button" onClick={() => setIsAddFormVisible(true)}>
            <FontAwesomeIcon icon={faPlus} />
            Add Medicine
          </button>
          <button className="expired-button" onClick={fetchExpiredMedicines}>
            Show Expired Medicines
          </button>
        </div>
      </div>
      <table>
        <thead>
        <tr>
          <th onClick={() => handleSort('MED_serial_num')}>
            Serial Number{' '}
            {sortField === 'MED_serial_num' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th onClick={() => handleSort('MED_name')}>
            Name{' '}
            {sortField === 'MED_name' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th onClick={() => handleSort('MED_expDate')}>
            Expiry Date{' '}
            {sortField === 'MED_expDate' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th onClick={() => handleSort('MED_prodDate')}>
            Production Date{' '}
            {sortField === 'MED_prodDate' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th onClick={() => handleSort('MED_amount')}>
            Amount{' '}
            {sortField === 'MED_amount' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {currentItems.map((medicine) => (
          <tr key={medicine.MED_serial_num}>
            <td>{medicine.MED_serial_num}</td>
            <td>{medicine.MED_name}</td>
            <td>{medicine.MED_expDate}</td>
            <td>{medicine.MED_prodDate}</td>
            <td>{medicine.MED_amount}</td>
            <td>
              <button onClick={() => deleteMedicine(medicine.MED_serial_num)}>
                <FontAwesomeIcon icon={faTrashAlt}/>
              </button>
              <button onClick={() => {
                setUpdatedMedicine(medicine);
                setIsUpdateFormVisible(true);
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
      {isAddFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsAddFormVisible(false)}>&times;</span>
            <h2>Add Medicine</h2>
            <form onSubmit={addMedicine}>
              <input type="text" name="med_serial_num" value={newMedicine.med_serial_num} onChange={handleNewInputChange}
                     placeholder="Serial Number" required className="form-input"/>
              <input type="text" name="med_name" value={newMedicine.med_name} onChange={handleNewInputChange}
                     placeholder="Name" required className="form-input"/>
              <label>Expiration Date</label>
              <input
                type="date"
                name="MED_expDate"
                value={newMedicine.med_expDate}
                onChange={handleNewInputChange}
                placeholder="Expiry Date (YYYY-MM-DD)"
                required
                className="form-input"
              />
              <input
                type="date"
                name="MED_prodDate"
                value={newMedicine.med_prodDate}
                onChange={handleNewInputChange}
                placeholder="Production Date (YYYY-MM-DD)"
                required
                className="form-input"
              />

              <input type="number" name="med_amount" value={newMedicine.med_amount} onChange={handleNewInputChange}
                     placeholder="Amount" required className="form-input"/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      {isUpdateFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsUpdateFormVisible(false)}>&times;</span>
            <h2>Update Medicine</h2>
            <form onSubmit={updateMedicine}>
              <input type="text" name="med_serial_num" value={updatedMedicine.med_serial_num} onChange={handleInputChange}
                     placeholder="Serial Number" required className="form-input"/>
              <input type="text" name="MED_name" value={updatedMedicine.MED_name} onChange={handleInputChange}
                     placeholder="Name" required className="form-input"/>
              <label>Expiry Date</label>
              <input type="date" name="MED_expDate" value={updatedMedicine.MED_expDate} onChange={handleInputChange}
                     placeholder="Expiry Date (YYYY-MM-DD)" required className="form-input"/>
              <label>Production Date</label>
              <input type="date" name="MED_prodDate" value={updatedMedicine.MED_prodDate} onChange={handleInputChange}
                     placeholder="Production Date (YYYY-MM-DD)" required className="form-input"/>
              <input type="number" name="MED_amount" value={updatedMedicine.MED_amount} onChange={handleInputChange}
                     placeholder="Amount" required className="form-input"/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}