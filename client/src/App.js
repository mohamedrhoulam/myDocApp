import './App.css';
import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Appointments from "./Components/Appointments/Appointments";
import Patients from "./Components/Patients/Patients"; // Import the Patients component
import Documents from "./Components/Documents/Documents";
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
            <Route path="/documents" element={<Documents/>}/>
            // overview
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;