import React from "react";
import "./Sidebar.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(fas);

// TODO: Add the routes to the links
function Sidebar() {
  return (
    <div className="sidebar-container">
      <h2 className="sidebar-header">Get Started</h2>
      <div className="sidebar-items">
        <ul>
          <li className="sidebar-item">
            <a className="sidebar-link" href="/patients">
              <FontAwesomeIcon icon="users" />
              <span>Patients</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className="sidebar-link" href="/patients">
              <FontAwesomeIcon icon="ring" />
              <span>Overview</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className="sidebar-link" href="/histories">
              <FontAwesomeIcon icon="file-alt" />
              <span>Histories</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className="sidebar-link" href="/appointments">
              <FontAwesomeIcon icon="calendar" />
              <span>Appointments</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a className="sidebar-link" href="/settings">
              <FontAwesomeIcon icon="cog" />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
