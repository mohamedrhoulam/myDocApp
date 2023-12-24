const db = require("../config/db");
const Provider = require("../models/Provider");

exports.getAllProviders = async (req, res) => {
  try {
    const result = await db.query("SELECT PROV_ID, PROV_name, PROV_street, PROV_zipCode, PROV_city FROM PROVIDER");
    //console.log(result.rows); // Log the rows to check the data structure

    const providers = result.rows.map(
      (row) =>
        new Provider(
          row.prov_id,
          row.prov_name,
          row.prov_street,
          row.prov_zipcode,
          row.prov_city
        )
    );
    res.json(providers);
  } catch (error) {
    console.error("Error fetching all providers:", error);
    res.status(500).json({error: "Internal server error"});
  }
};



exports.getProviderById = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM PROVIDER WHERE PROV_ID = $1", [
      req.params.id,
    ]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({error: "Provider not found"});
    }
    const provider = new Provider(
      row.prov_id,
      row.prov_name,
      row.prov_street,
      row.prov_zipCode,
      row.prov_city
    );
    res.json(provider);
  } catch (error) {
    console.error("Error fetching provider by ID:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.createProvider = async (req, res) => {
  try {
    const {
      PROV_name,
      PROV_street,
      PROV_zipCode,
      PROV_city
    } = req.body;

    const result = await db.query(
      "INSERT INTO PROVIDER (PROV_name, PROV_street, PROV_zipCode, PROV_city) VALUES ($1, $2, $3, $4) RETURNING *",
      [PROV_name, PROV_street, PROV_zipCode, PROV_city] // Change variable names to lowercase
    );

    const row = result.rows[0];
    const provider = new Provider(
      row.PROV_ID,
      row.PROV_name,
      row.PROV_street,
      row.PROV_zipCode,
      row.PROV_city
    );
    res.status(201).json(provider);
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({error: "Internal server error"});
  }
};


exports.updateProvider = async (req, res) => {
  try {
    const {
      PROV_name,
      PROV_street,
      PROV_zipCode,
      PROV_city
    } = req.body;
    const result = await db.query(
      "UPDATE PROVIDER SET PROV_name = $1, PROV_street = $2, PROV_zipCode = $3, PROV_city = $4 WHERE PROV_ID = $5 RETURNING *",
      [PROV_name, PROV_street, PROV_zipCode, PROV_city, req.params.id],
    );
    const row = result.rows[0];
    const provider = new Provider(
      row.PROV_ID,
      row.PROV_name,
      row.PROV_street,
      row.PROV_zipCode,
      row.PROV_city
    );
    res.json(provider);
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.deleteProvider = async (req, res) => {
  try {
    const PROV_ID = req.params.PROV_ID; // Access the PROV_ID from req.params
    console.log('Received delete request for provider ID:', PROV_ID); // Log the received PROV_ID
    await db.query("DELETE FROM PROVIDER WHERE PROV_ID = $1", [PROV_ID]);
    res.json({ message: "Provider deleted" });
  } catch (error) {
    console.error("Error deleting provider:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

