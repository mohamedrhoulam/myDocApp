const db = require("../config/db");
const Appointment = require("../models/Appointment");

exports.getAllAppointments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT APPOINTMENT.*, PATIENT.patient_fname, PATIENT.patient_lname
      FROM APPOINTMENT 
      JOIN PATIENT ON APPOINTMENT.patient_id = PATIENT.patient_id
    `);
    const appointments = result.rows.map(
        (row) =>
            new Appointment(
                row.apt_id,
                row.apt_date,
                row.apt_status,
                row.patient_id,
                row.patient_fname,
                row.patient_lname,
            ),
    );
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM APPOINTMENT WHERE apt_id = $1", [
      req.params.id,
    ]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    const appointment = new Appointment(
        row.apt_id,
        row.apt_date,
        row.apt_status,
        row.patient_id,
    );
    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAppointmentsByStatus = async (req, res) => {
  try {
    const result = await db.query(
        "SELECT * FROM APPOINTMENT WHERE apt_status = $1",
        [req.params.status],
    );
    const appointments = result.rows.map(
        (row) =>
            new Appointment(
                row.apt_id,
                row.apt_date,
                row.apt_status,
                row.patient_id,
            ),
    );
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments by status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const result = await db.query(
      "INSERT INTO APPOINTMENT (apt_date, apt_status, patient_id) VALUES ($1, $2, $3) RETURNING *",
      [req.body.apt_date, req.body.apt_status, req.body.patient_id],
    );
    const row = result.rows[0];
    const appointment = new Appointment(
      row.apt_id,
      row.apt_date,
      row.apt_status,
      row.patient_id,
    );
    res.json(appointment);
  } catch (error) {
    if (error.message.includes('The number of appointments for the day has exceeded 5.')) {
      // Send a response with a status code of 400 and a custom error message
      res.status(400).json({ error: "The number of appointments for the day has exceeded 5." });
    } else {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { apt_date, apt_status, patient_id } = req.body;
    const result = await db.query(
        "UPDATE APPOINTMENT SET apt_date = $1, apt_status = $2, patient_id = $3 WHERE apt_id = $4 RETURNING *",
        [
          apt_date,
          apt_status,
          patient_id,
          req.params.id,
        ],
    );
    const row = result.rows[0];
    const appointment = new Appointment(
        row.apt_id,
        row.apt_date,
        row.apt_status,
        row.patient_id,
    );
    res.json(appointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    await db.query("DELETE FROM APPOINTMENT WHERE apt_id = $1", [req.params.id]);
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
