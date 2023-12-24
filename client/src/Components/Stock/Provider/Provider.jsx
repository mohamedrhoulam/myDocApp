import React, {useState, useEffect} from "react";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faEdit, faPlus, faSortUp, faSortDown} from "@fortawesome/free-solid-svg-icons";
import "./Provider.css";

export default function Provider() {
  const [providers, setProviders] = useState([]);
  const [newProvider, setNewProvider] = useState({
    PROV_name: '',
    PROV_street: '',
    PROV_zipCode: '',
    PROV_city: ''
  });

  const [updatedProvider, setUpdatedProvider] = useState({
    PROV_name: '',
    PROV_street: '',
    PROV_zipCode: '',
    PROV_city: ''
  });

  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/providers");
      setProviders(response.data);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    }
  };

  const addProvider = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/providers", newProvider);
      fetchProviders();
      setIsAddFormVisible(false);
    } catch (error) {
      console.error("Failed to add provider:", error);
    }
  };
  const updateProvider = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/providers/${updatedProvider.PROV_ID}`, updatedProvider);
      fetchProviders();
      setIsUpdateFormVisible(false);
    } catch (error) {
      console.error("Failed to update provider:", error);
    }
  };

  const deleteProvider = async (PROV_ID) => {
    try {
      console.log('Deleting provider with ID:', PROV_ID); // Check if the function is being called
      await axios.delete(`http://localhost:5000/api/providers/${PROV_ID}`);
      fetchProviders();
      console.log('Provider deleted successfully!'); // Log success
    } catch (error) {
      console.error("Failed to delete provider:", error);
    }
  };

  const handleNewInputChange = (e) => {
    setNewProvider({
      ...newProvider,
      [e.target.name]: e.target.value,
    });
  };
  const handleInputChange = (e) => {
    setUpdatedProvider({
      ...updatedProvider,
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

  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const sortedProviders = [...providers].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const currentItems = sortedProviders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="providers-container">
      <h2>Providers</h2>
      <div className="button-container">
        <div className="button-group">
          <button className="add-button" onClick={() => setIsAddFormVisible(true)}>
            <FontAwesomeIcon icon={faPlus} />
            Add Provider
          </button>
        </div>
      </div>
      <table>
        <thead>
        <tr>
          <th onClick={() => handleSort('PROV_ID')}>
            ID{' '}
            {sortField === 'PROV_ID' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th onClick={() => handleSort('PROV_name')}>
            Name{' '}
            {sortField === 'PROV_name' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th onClick={() => handleSort('PROV_street')}>
            Street{' '}
            {sortField === 'PROV_street' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th onClick={() => handleSort('PROV_zipCode')}>
            Zip Code{' '}
            {sortField === 'PROV_zipCode' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th onClick={() => handleSort('PROV_city')}>
            City{' '}
            {sortField === 'PROV_city' && (
              <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown}/>
            )}
          </th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {currentItems.map((provider) => (
          <tr key={provider.PROV_ID}>
            <td>{provider.PROV_ID}</td>
            <td>{provider.PROV_name}</td>
            <td>{provider.PROV_street}</td>
            <td>{provider.PROV_zipCode}</td>
            <td>{provider.PROV_city}</td>
            <td>
              <button onClick={() => deleteProvider(provider.PROV_ID)}>
                <FontAwesomeIcon icon={faTrashAlt}/>
              </button>
              <button onClick={() => {
                setUpdatedProvider(provider);
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
            <h2>Add Provider</h2>
            <form onSubmit={addProvider}>
              <input type="text" name="PROV_name" value={newProvider.PROV_name} onChange={handleNewInputChange}
                     placeholder="Name" required className="form-input"/>
              <input type="text" name="PROV_street" value={newProvider.PROV_street} onChange={handleNewInputChange}
                     placeholder="Street" required className="form-input"/>
              <input type="text" name="PROV_zipCode" value={newProvider.PROV_zipCode} onChange={handleNewInputChange}
                     placeholder="Zip Code" required className="form-input"/>
              <input type="text" name="PROV_city" value={newProvider.PROV_city} onChange={handleNewInputChange}
                     placeholder="City" required className="form-input"/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
      {isUpdateFormVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsUpdateFormVisible(false)}>&times;</span>
            <h2>Update Provider</h2>
            <form onSubmit={updateProvider}>
              <input type="text" name="PROV_name" value={updatedProvider.PROV_name} onChange={handleInputChange}
                     placeholder="Name" required className="form-input"/>
              <input type="text" name="PROV_street" value={updatedProvider.PROV_street} onChange={handleInputChange}
                     placeholder="Street" required className="form-input"/>
              <input type="text" name="PROV_zipCode" value={updatedProvider.PROV_zipCode} onChange={handleInputChange}
                     placeholder="Zip Code" required className="form-input"/>
              <input type="text" name="PROV_city" value={updatedProvider.PROV_city} onChange={handleInputChange}
                     placeholder="City" required className="form-input"/>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}