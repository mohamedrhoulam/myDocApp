const db = require("../config/db");
const Appointment = require("../models/Appointment");

exports.getAllAppointments = async (req, res) => {
  const result = await db.query("SELECT * FROM APPOINTMENT");
  const appointments = result.rows.map(
    (row) =>
      new Appointment(
        row.apt_id,
        row.apt_date,
        row.apt_status,
        row.apt_patientId,
      ),
  );
  res.json(appointments);
};
exports.getAppointmentById = async (req, res) => {
  const result = await db.query("SELECT * FROM APPOINTMENT WHERE apt_id = $1", [
    req.params.id,
  ]);
  const row = result.rows[0];
  const appointment = new Appointment(
    row.apt_id,
    row.apt_date,
    row.apt_status,
    row.apt_patientId,
  );
  res.json(appointment);
};

exports.getAppointmentsByStatus = async (req, res) => {
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
        row.apt_patientId,
      ),
  );
  res.json(appointments);
};

//TODO: fix the function below (id should be a serial and not passed in)
exports.createAppointment = async (req, res) => {
  const result = await db.query(
    "INSERT INTO APPOINTMENT (apt_id, apt_date, apt_status, patient_id) VALUES ($1, $2, $3) RETURNING *",
    [req.body.apt_date, req.body.apt_status, req.body.apt_patientId],
  );
  const row = result.rows[0];
  const appointment = new Appointment(
    row.apt_id,
    row.apt_date,
    row.apt_status,
    row.apt_patientId,
  );
  res.json(appointment);
};

exports.updateAppointment = async (req, res) => {
  const result = await db.query(
    "UPDATE APPOINTMENT SET apt_date = $1, apt_status = $2, patient_id = $3 WHERE apt_id = $4 RETURNING *",
    [
      req.body.apt_date,
      req.body.apt_status,
      req.body.apt_patientId,
      req.params.id,
    ],
  );
  const row = result.rows[0];
  const appointment = new Appointment(
    row.apt_id,
    row.apt_date,
    row.apt_status,
    row.apt_patientId,
  );
  res.json(appointment);
};

exports.deleteAppointment = async (req, res) => {
  await db.query("DELETE FROM APPOINTMENT WHERE apt_id = $1", [req.params.id]);
  res.json({ message: "Appointment deleted" });
};
