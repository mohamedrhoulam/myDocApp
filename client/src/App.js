import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Appointments from "./Components/Appointments/Appointments";

function App() {
  const [handleSearch, setHandleSearch] = useState(null);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/appointments" element={<Appointments onSearch={setHandleSearch} />} />
      </Routes>
    </Router>
  );
}

export default App;