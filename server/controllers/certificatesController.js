const db = require("../config/db");
const Certificate = require("../models/Document").Certificate;
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // accept only files with image extensions
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  },
});

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

// deleteCertificate
// deleteCertificate
exports.deleteCertificate = async (req, res) => {
  try {
    const { doc_id } = req.params;
    if (!doc_id) {
      throw new Error("doc_id is undefined");
    }

    await db.query("DELETE FROM certificate WHERE doc_id = $1", [doc_id]);
    await db.query("DELETE FROM document WHERE doc_id = $1", [doc_id]);

    // Query the database for the document
    const result = await db.query("SELECT * FROM document WHERE doc_id = $1", [doc_id]);
    if (result.rows.length > 0) {
      // The document was not deleted
      console.error("Error deleting document: The document was not deleted from the database");
      res.status(500).json({ error: "Internal server error" });
    } else {
      // The document was deleted
      res.json({ message: "The file has been deleted" });
    }
  } catch (error) {
    console.error("Error deleting certificate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};