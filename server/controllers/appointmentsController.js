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
