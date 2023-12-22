import React, { useState } from "react";
import SearchBar from "./SearchBar";
import Button from "./Button";
import Analytics from "./Analytics";
import LeftSidebar from "./LeftSidebar";
// import Appointments from "../Appointments/Appointments";

const Overview = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const handleSearch = (searchTerm) => {
    // TODO: Implement search functionality
  };

  const handleAddPatient = () => {
    // TODO: Route to the Patient component
  };

  return (
    <div>
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onSearch={handleSearch}
      />

      <Button onClick={handleAddPatient}>Add Patient</Button>

      <Analytics />

      <LeftSidebar appointments={upcomingAppointments} />
    </div>
  );
};

export default Overview;
