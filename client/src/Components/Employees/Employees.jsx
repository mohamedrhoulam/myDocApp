import React, {useState, useEffect} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faEdit, faPlus, faSortUp, faSortDown} from "@fortawesome/free-solid-svg-icons";
import "./Employees.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [updatedEmployee, setUpdatedEmployee] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newEmployee, setNewEmployee] = useState({});
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

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

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      await fetchEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/employees`, newEmployee);
      await fetchEmployees();
      setIsAddFormVisible(false);
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  const handleNewInputChange = (e) => {
    setNewEmployee({
      ...newEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/employees/${updatedEmployee.employee_id}`, updatedEmployee);
      await fetchEmployees();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const handleInputChange = (e) => {
    setUpdatedEmployee({
      ...updatedEmployee,
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

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const sortedEmployees = [...employees].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const currentItems = sortedEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <button
        key={number}
        onClick={() => handlePageChange(number)}
        className="page-number-button"
      >
        {number}
      </button>
    );
  });
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const itemsBeingShown = currentEmployees.length;
  const renderItemsMessage = `Showing ${itemsBeingShown} items out of ${employees.length}`;

  return (
    <div className="employees-container">
      <h2>Employees</h2>
      <button className="add-button" onClick={() => setIsAddFormVisible(true)}>
        <FontAwesomeIcon icon={faPlus} size="lg"/>
        Add Staff Member
      </button>
      <table>
        <thead>
        <tr>
          <th onClick={() => handleSort('emp_id')}>
            Employee ID{' '}
            {sortField === 'emp_id' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th onClick={() => handleSort('emp_lname')}>Last Name</th>
          <th onClick={() => handleSort('emp_fname')}>First Name</th>
          <th onClick={() => handleSort('emp_gender')}>Gender</th>
          <th onClick={() => handleSort('emp_cin')}>CIN</th>
          <th onClick={() => handleSort('emp_email')}>Email</th>
          <th onClick={() => handleSort('emp_street')}>Street</th>
          <th onClick={() => handleSort('emp_zipCode')}>Zip Code</th>
          <th onClick={() => handleSort('emp_city')}>City</th>
          <th onClick={() => handleSort('emp_salary')}>Salary</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {currentEmployees.map((employee) => (
          <tr key={employee.emp_id}>
            <td>{employee.emp_id}</td>
            <td>{employee.emp_lname}</td>
            <td>{employee.emp_fname}</td>
            <td>{employee.emp_gender}</td>
            <td>{employee.emp_cin}</td>
            <td>{employee.emp_email}</td>
            <td>{employee.emp_street}</td>
            <td>{employee.emp_zipCode}</td>
            <td>{employee.emp_city}</td>
            <td>{employee.emp_salary}</td>
            <td>
              <button onClick={() => deleteEmployee(employee.emp_id)}>
                <FontAwesomeIcon icon={faTrashAlt}/>
              </button>
              <button onClick={() => {
                setUpdatedEmployee(employee);
                setIsFormVisible(true);
              }}>
                <FontAwesomeIcon icon={faEdit}/>
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      {isAddFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsAddFormVisible(false)}>&times;</span>
            <h2>Add Employee</h2>
            <form onSubmit={handleAdd}>
              <input type="text" name="emp_lname" value={newEmployee.emp_lname} onChange={handleNewInputChange} placeholder="Last Name" required/>
              <input type="text" name="emp_fname" value={newEmployee.emp_fname} onChange={handleNewInputChange} placeholder="First Name" required/>
              <input type="text" name="emp_gender" value={newEmployee.emp_gender} onChange={handleNewInputChange} placeholder="Gender" required/>
              <input type="text" name="emp_cin" value={newEmployee.emp_cin} onChange={handleNewInputChange} placeholder="CIN" required/>
              <input type="text" name="emp_email" value={newEmployee.emp_email} onChange={handleNewInputChange} placeholder="Email" required/>
              <input type="text" name="emp_street" value={newEmployee.emp_street} onChange={handleNewInputChange} placeholder="Street" required/>
              <input type="text" name="emp_zipCode" value={newEmployee.emp_zipCode} onChange={handleNewInputChange} placeholder="Zip Code" required/>
              <input type="text" name="emp_city" value={newEmployee.emp_city} onChange={handleNewInputChange} placeholder="City" required/>
              <input type="text" name="emp_salary" value={newEmployee.emp_salary} onChange={handleNewInputChange} placeholder="Salary" required/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      {isFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsFormVisible(false)}>&times;</span>
            <h2>Update Employee</h2>
            <form onSubmit={handleUpdate}>
              <input type="text" name="emp_lname" value={updatedEmployee.emp_lname} onChange={handleInputChange} placeholder="Last Name" required/>
              <input type="text" name="emp_fname" value={updatedEmployee.emp_fname} onChange={handleInputChange} placeholder="First Name" required/>
              <input type="text" name="emp_gender" value={updatedEmployee.emp_gender} onChange={handleInputChange} placeholder="Gender" required/>
              <input type="text" name="emp_cin" value={updatedEmployee.emp_cin} onChange={handleInputChange} placeholder="CIN" required/>
              <input type="text" name="emp_email" value={updatedEmployee.emp_email} onChange={handleInputChange} placeholder="Email" required/>
              <input type="text" name="emp_street" value={updatedEmployee.emp_street} onChange={handleInputChange} placeholder="Street" required/>
              <input type="text" name="emp_zipCode" value={updatedEmployee.emp_zipCode} onChange={handleInputChange} placeholder="Zip Code" required/>
              <input type="text" name="emp_city" value={updatedEmployee.emp_city} onChange={handleInputChange} placeholder="City" required/>
              <input type="text" name="emp_salary" value={updatedEmployee.emp_salary} onChange={handleInputChange} placeholder="Salary" required/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      <div>
        {renderPageNumbers}
      </div>
      <div className="item-message">
        {renderItemsMessage}
      </div>
    </div>
  );
}
