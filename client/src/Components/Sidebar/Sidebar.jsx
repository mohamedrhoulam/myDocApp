import React from "react";
import "./Sidebar.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';

library.add(fas);

function Sidebar() {
  return (
    <div className="sidebar-container">
      <h2 className="sidebar-header">Get Started</h2>
      <div className="sidebar-items">
        <ul>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/overview">
              <FontAwesomeIcon icon="ring" />
              <span>Overview</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/patients">
              <FontAwesomeIcon icon="users" />
              <span>My Patients</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/documents">
              <FontAwesomeIcon icon="file-alt" />
              <span>Documents</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/appointments">
              <FontAwesomeIcon icon="calendar" />
              <span>Appointments</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/employees">
              <FontAwesomeIcon icon="cog" />
              <span>My Staff</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;