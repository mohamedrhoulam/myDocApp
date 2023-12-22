import './App.css';
import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Appointments from "./Components/Appointments/Appointments";
import Patients from "./Components/Patients/Patients"; // Import the Patients component

function App() {
  const [handleSearch, setHandleSearch] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <Sidebar/>
        <div className="main-content">
          <Routes>
            <Route path="/appointments" element={<Appointments onSearch={setHandleSearch}/>}/>
            <Route path="/patients" element={<Patients/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;