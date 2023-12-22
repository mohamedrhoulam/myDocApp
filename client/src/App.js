import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Appointments from "./Components/Appointments/Appointments";
import Search from "./Components/Search/Search";

function App() {
  const [handleSearch, setHandleSearch] = useState(null);

  return (
    <Router>
      <Search onSearch={handleSearch} />
      <Sidebar />
      <Routes>
        <Route path="/appointments" element={<Appointments onSearch={setHandleSearch} />} />
      </Routes>
    </Router>
  );
}

export default App;