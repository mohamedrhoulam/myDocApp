const db = require("../config/db");
const Prescription = require("../models/Document").Prescription;

exports.getAllPrescriptions = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM prescription");
    const prescriptions = result.rows.map(
      (row) => new Prescription(row.doc_id, row.doc_type, row.doc_date, row.doc_desc, row.emp_id, row.presc_desc, row.med_serial_num)
    );
    res.json(prescriptions);
  } catch (error) {
    console.error("Error fetching all prescriptions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// update, delete, add prescriptions
exports.updatePrescription = async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE prescription SET doc_id = $1, doc_type = $2, doc_date = $3, doc_desc = $4, emp_id = $5, presc_desc = $6, med_serial_num = $7 WHERE doc_id = $1",
      [
        req.body.doc_id,
        req.body.doc_type,
        req.body.doc_date,
        req.body.doc_desc,
        req.body.emp_id,
        req.body.presc_desc,
        req.body.med_serial_num,
      ]
    );
    res.json("Prescription updated successfully");
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const result = await db.query("DELETE FROM prescription WHERE doc_id = $1", [
      req.params.id,
    ]);
    res.json("Prescription deleted successfully");
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

exports.addPrescription = async (req, res) => {
  try {
    const result = await db.query(
      "INSERT INTO prescription (doc_id, doc_type, doc_date, doc_desc, emp_id, presc_desc, med_serial_num) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        req.body.doc_id,
        req.body.doc_type,
        req.body.doc_date,
        req.body.doc_desc,
        req.body.emp_id,
        req.body.presc_desc,
        req.body.med_serial_num,
      ]
    );
    res.json("Prescription added successfully");
  } catch (error) {
    console.error("Error adding prescription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};