import React, { useState, useEffect } from 'react';

function Overview() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Fetch today's appointments from your backend
        fetch('/api/appointments/today')
            .then(response => response.json())
            .then(data => setAppointments(data))
            .catch(error => console.error('Error fetching data: ', error));
    }, []);

    return (
        <div>
            <h1>Today's Appointments</h1>
            <table>
                <thead>
                    <tr>
                        <th>Appointment ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Patient ID</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(appointment => (
                        <tr key={appointment.APT_ID}>
                            <td>{appointment.APT_ID}</td>
                            <td>{appointment.APT_date}</td>
                            <td>{appointment.APT_status}</td>
                            <td>{appointment.PATIENT_ID}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Overview;
