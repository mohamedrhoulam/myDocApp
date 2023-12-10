import './App.css';
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Overview from "./Components/Overview/Overview";

function App() {
  return (
    <Router>
      <Sidebar />
    </Router>
  );
}

export default App;
