const db = require("../config/db");
const Medicine = require("../models/Medicine");

exports.getAllMedicines = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM MEDICINE");
    const medicines = result.rows.map(
      (row) =>
        new Medicine(
          row.med_serial_num,
          row.med_name,
          row.med_expdate,
          row.med_proddate,
          row.med_amount
        )
    );
    res.json(medicines);
  } catch (error) {
    console.error("Error fetching all medicines:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.getMedicineById = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM MEDICINE WHERE med_serial_num = $1", [
      req.params.id,
    ]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({error: "Medicine not found"});
    }
    const medicine = new Medicine(
      row.med_serial_num,
      row.med_name,
      row.med_expdate,
      row.med_proddate,
      row.med_amount
    );
    res.json(medicine);
  } catch (error) {
    console.error("Error fetching medicine by ID:", error);
    res.status(500).json({error: "Internal server error"});
  }
}

exports.createMedicine = async (req, res) => {
  console.log('Received request to create medicine:', req.body); // Log the request body
  try {
    const {
      med_serial_num,
      med_name,
      med_expDate,
      med_prodDate,
      med_amount
    } = req.body;
    console.log(med_expDate);
    console.log(med_prodDate);
    if (!med_expDate || !med_prodDate) {
      return res.status(400).json({error: "Expiration date and production date are required"});
    }

    const result = await db.query(
      "INSERT INTO MEDICINE (med_serial_num, med_name, med_expDate, med_prodDate, med_amount) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [med_serial_num, med_name, med_expDate, med_prodDate, med_amount]
    );
    console.log('Medicine created:', result.rows[0]); // Log the created medicine
    const row = result.rows[0];
    const medicine = new Medicine(
      row.med_serial_num,
      row.med_name,
      row.med_expDate,
      row.med_prodDate,
      row.med_amount
    );
    res.status(201).json(medicine);
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

//Update Medicine
exports.updateMedicine = async (req, res) => {
  try {
    const { med_serial_num } = req.params;
    const { med_name, med_expdate, med_proddate, med_amount } = req.body;
    const result = await db.query(
      "UPDATE MEDICINE SET med_name = $1, med_expdate = $2, med_proddate = $3, med_amount = $4 WHERE med_serial_num = $5 RETURNING *",
      [med_name, med_expdate, med_proddate, med_amount, med_serial_num]
    );
    const row = result.rows[0];
    const medicine = new Medicine(
      row.med_serial_num,
      row.med_name,
      row.med_expdate,
      row.med_proddate,
      row.med_amount
    );
    res.json(medicine);
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

// delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { med_serial_num } = req.params;
    await db.query("DELETE FROM MEDICINE WHERE med_serial_num = $1", [med_serial_num]);
    res.status(200).json({message: "Medicine deleted successfully"});
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({error: "Internal server error"});
  }
};
// this is the controller function calls the stored function in pg
exports.getExpiredMedicines = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM get_expired_medicines()");
    console.log("done")// replace with your stored function call
    const medicines = result.rows.map(
      (row) =>
        new Medicine(
          row.med_serial_num,
          row.med_name,
          row.med_expdate,
          row.med_proddate,
          row.med_amount
        )
    );
    console.log("done")// replace with your stored function call

    res.json(medicines);
  } catch (error) {
    console.error("Error fetching expired medicines:", error);
    res.status(500).json({error: "Internal server error"});
  }
};