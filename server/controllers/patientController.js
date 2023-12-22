const db = require("../config/db");
const Patient = require("../models/Patient");

exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM PATIENT");
    const patients = result.rows.map(
      (row) =>
        new Patient(
          row.patient_id,
          row.patient_fname,
          row.patient_lname,
          row.patient_phoneNum,
          row.patient_dateOfBirth,
          row.patient_sex,
          row.patient_email,
          row.patient_cin,
          row.patient_city,
          row.patient_street
        )
    );
    res.json(patients);
  } catch (error) {
    console.error("Error fetching all patients:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM PATIENT WHERE patient_id = $1", [
      req.params.id,
    ]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({error: "Patient not found"});
    }
    const patient = new Patient(
      row.patient_id,
      row.patient_fname,
      row.patient_lname,
      row.patient_phoneNum,
      row.patient_dateOfBirth,
      row.patient_sex,
      row.patient_email,
      row.patient_cin,
      row.patient_city,
      row.patient_street
    );
    res.json(patient);
  } catch (error) {
    console.error("Error fetching patient by ID:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.createPatient = async (req, res) => {
  try {
    const {
      patient_fname,
      patient_lname,
      patient_phoneNum,
      patient_dateOfBirth,
      patient_sex,
      patient_email,
      patient_cin,
      patient_city,
      patient_street
    } = req.body;
    const result = await db.query(
      "INSERT INTO PATIENT (patient_fname, patient_lname, patient_phoneNum, patient_dateOfBirth, patient_sex, patient_email, patient_cin, patient_city, patient_street) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [patient_fname, patient_lname, patient_phoneNum, patient_dateOfBirth, patient_sex, patient_email, patient_cin, patient_city, patient_street],
    );
    const row = result.rows[0];
    const patient = new Patient(
      row.patient_id,
      row.patient_fname,
      row.patient_lname,
      row.patient_phoneNum,
      row.patient_dateOfBirth,
      row.patient_sex,
      row.patient_email,
      row.patient_cin,
      row.patient_city,
      row.patient_street
    );
    res.json(patient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const {
      patient_fname,
      patient_lname,
      patient_phoneNum,
      patient_dateOfBirth,
      patient_sex,
      patient_email,
      patient_cin,
      patient_city,
      patient_street
    } = req.body;
    const result = await db.query(
      "UPDATE PATIENT SET patient_fname = $1, patient_lname = $2, patient_phoneNum = $3, patient_dateOfBirth = $4, patient_sex = $5, patient_email = $6, patient_cin = $7, patient_city = $8, patient_street = $9 WHERE patient_id = $10 RETURNING *",
      [patient_fname, patient_lname, patient_phoneNum, patient_dateOfBirth, patient_sex, patient_email, patient_cin, patient_city, patient_street, req.params.id],
    );
    const row = result.rows[0];
    const patient = new Patient(
      row.patient_id,
      row.patient_fname,
      row.patient_lname,
      row.patient_phoneNum,
      row.patient_dateOfBirth,
      row.patient_sex,
      row.patient_email,
      row.patient_cin,
      row.patient_city,
      row.patient_street
    );
    res.json(patient);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.deletePatient = async (req, res) => {
  try {
    await db.query("DELETE FROM PATIENT WHERE patient_id = $1", [req.params.id]);
    res.json({message: "Patient deleted"});
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.getPatientsWithAppointments = async (req, res) => {
  try {
    const result = await db.query(`
        SELECT DISTINCT PATIENT.*
        FROM PATIENT
                 JOIN APPOINTMENT ON PATIENT.patient_id = APPOINTMENT.patient_id
    `);
    const patients = result.rows.map(
      (row) =>
        new Patient(
          row.patient_id,
          row.patient_fname,
          row.patient_lname,
          row.patient_phoneNum,
          row.patient_dateOfBirth,
          row.patient_sex,
          row.patient_email,
          row.patient_cin,
          row.patient_city,
          row.patient_street
        )
    );
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients with appointments:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.getPatientsWithoutAppointments = async (req, res) => {
  try {
    const result = await db.query(`
        SELECT PATIENT.*
        FROM PATIENT
                 LEFT JOIN APPOINTMENT ON PATIENT.patient_id = APPOINTMENT.patient_id
        WHERE APPOINTMENT.apt_id IS NULL
    `);
    const patients = result.rows.map(
      (row) =>
        new Patient(
          row.patient_id,
          row.patient_fname,
          row.patient_lname,
          row.patient_phoneNum,
          row.patient_dateOfBirth,
          row.patient_sex,
          row.patient_email,
          row.patient_cin,
          row.patient_city,
          row.patient_street
        )
    );
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients without appointments:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

// the age is found using a stored function that takes the date of birth as a parameter

exports.getPatientAge = async (req, res) => {
  try {
    const result = await db.query("SELECT get_patient_age($1)", [req.params.id]);
    const age = result.rows[0].get_patient_age;
    res.json({ age });
  } catch (error) {
    console.error("Error fetching patient age:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
