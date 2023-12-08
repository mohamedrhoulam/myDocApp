import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <h2 className="sidebar-header">Doctor's Personal Account</h2>
            <ul>
                <li className="sidebar-item active">
                    <a className="sidebar-link" href="/patients">
                        <i className="fa fa-users"></i>
                        <span>Patients</span>
                    </a>
                </li>
                <li className="sidebar-item">
                    <a className="sidebar-link" href="/histories">
                        <i className="fa fa-file-text-o"></i>
                        <span>Histories</span>
                    </a>
                </li>
                <li className="sidebar-item">
                    <a className="sidebar-link" href="/appointments">
                        <i className="fa fa-calendar"></i>
                        <span>Appointments</span>
                    </a>
                </li>
                <li className="sidebar-item">
                    <a className="sidebar-link" href="/settings">
                        <i className="fa fa-cog"></i>
                        <span>Settings</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
