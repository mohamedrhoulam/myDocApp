const db = require("../config/db");
const Certificate = require("../models/Document").Certificate;

exports.getAllCertificates = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *, remaining_days(doc_date, cert_duration) AS remaining_days
      FROM certificate
    `);
    const certificates = result.rows.map(row => new Certificate(
      row.doc_id,
      row.doc_type,
      row.doc_date,
      row.doc_desc,
      row.emp_id,
      row.cert_duration,
      row.remaining_days
    ));
    res.json(certificates);
  } catch (error) {
    console.error("Error fetching all certificates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// updateCertificate
exports.updateCertificate = async (req, res) => {
  const { doc_id, doc_type, doc_date, doc_desc, emp_id, cert_duration } = req.body;
  try {
    const result = await db.query(
      "UPDATE certificate SET doc_type = $1, doc_date = $2, doc_desc = $3, emp_id = $4, cert_duration = $5 WHERE doc_id = $6 RETURNING *",
      [doc_type, doc_date, doc_desc, emp_id, cert_duration, doc_id]
    );
    const updatedCertificate = result.rows[0];
    res.json(updatedCertificate);
  } catch (error) {
    console.error("Error updating certificate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// deleteCertificate
exports.deleteCertificate = async (req, res) => {
  const { doc_id } = req.params;
  try {
    await db.query("DELETE FROM certificate WHERE doc_id = $1", [doc_id]);
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// addCertificate
exports.addCertificate = async (req, res) => {
  const { doc_desc, emp_id, cert_duration } = req.body;
  try {
    // Insert a new document
    const documentResult = await db.query(
      "INSERT INTO document (doc_type, doc_date, doc_desc) VALUES ($1, CURRENT_DATE, $2) RETURNING doc_id",
      ['CERTIFICATE', doc_desc]
    );
    const doc_id = documentResult.rows[0].doc_id;
    // Insert a new certificate with the same doc_id
    const certificateResult = await db.query(
      "INSERT INTO certificate (doc_id, doc_type, emp_id, cert_duration) VALUES ($1, $2, $3, $4) RETURNING *",
      [doc_id, 'CERTIFICATE', emp_id, cert_duration]
    );
    const newCertificate = certificateResult.rows[0];
    res.status(201).json(newCertificate);
  } catch (error) {
    console.error("Error adding new certificate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

