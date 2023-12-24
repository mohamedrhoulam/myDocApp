const db = require("../db");
const Stock = require("../models/Stock");

exports.getAllStocks = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM STOCK");
    const stocks = result.rows.map(
      (row) =>
        new Stock(
          row.PROV_ID,
          row.MED_serial_num,
          row.STOCK_itemQty,
          row.STOCK_dateAdded
        )
    );
    res.json(stocks);
  } catch (error) {
    console.error("Error fetching all stocks:", error);
    res.status(500).json({error: "Internal server error"});
  }
}

//Add Stock
exports.addStock = async (req, res) => {
  try {
    const {
      PROV_ID,
      MED_serial_num,
      STOCK_itemQty,
      STOCK_dateAdded
    } = req.body;
    const result = await db.query(
      "INSERT INTO STOCK (PROV_ID, MED_serial_num, STOCK_itemQty, STOCK_dateAdded) VALUES ($1, $2, $3, $4) RETURNING *",
      [PROV_ID, MED_serial_num, STOCK_itemQty, STOCK_dateAdded]
    );
    const row = result.rows[0];
    const stock = new Stock(
      row.PROV_ID,
      row.MED_serial_num,
      row.STOCK_itemQty,
      row.STOCK_dateAdded
    );
    res.status(201).json(stock);
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({error: "Internal server error"});
  }
};
exports.deleteStock = async (req, res) => {
  try {
    const { MED_serial_num } = req.params;
    await db.query("DELETE FROM STOCK WHERE MED_serial_num = $1", [MED_serial_num]);
    res.status(200).json({message: "Stock deleted successfully"});
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { MED_serial_num } = req.params;
    const { PROV_ID, STOCK_itemQty, STOCK_dateAdded } = req.body;
    const result = await db.query(
      "UPDATE STOCK SET PROV_ID = $1, STOCK_itemQty = $2, STOCK_dateAdded = $3 WHERE MED_serial_num = $4 RETURNING *",
      [PROV_ID, STOCK_itemQty, STOCK_dateAdded, MED_serial_num]
    );
    const row = result.rows[0];
    const stock = new Stock(
      row.PROV_ID,
      row.MED_serial_num,
      row.STOCK_itemQty,
      row.STOCK_dateAdded
    );
    res.status(200).json(stock);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

// Get a specific stock by MED_serial_num
exports.getStockBySerialNum = async (req, res) => {
  try {
    const { MED_serial_num } = req.params;
    const result = await db.query("SELECT * FROM STOCK WHERE MED_serial_num = $1", [MED_serial_num]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({error: "Stock not found"});
    }
    const stock = new Stock(
      row.PROV_ID,
      row.MED_serial_num,
      row.STOCK_itemQty,
      row.STOCK_dateAdded
    );
    res.json(stock);
  } catch (error) {
    console.error("Error fetching stock by serial number:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

// Get all stocks by a specific provider
exports.getStocksByProvider = async (req, res) => {
  try {
    const { PROV_ID } = req.params;
    const result = await db.query("SELECT * FROM STOCK WHERE PROV_ID = $1", [PROV_ID]);
    const stocks = result.rows.map(
      (row) =>
        new Stock(
          row.PROV_ID,
          row.MED_serial_num,
          row.STOCK_itemQty,
          row.STOCK_dateAdded
        )
    );
    res.json(stocks);
  } catch (error) {
    console.error("Error fetching stocks by provider:", error);
    res.status(500).json({error: "Internal server error"});
  }
};

// Get the most recently added stocks
exports.getRecentStocks = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM STOCK ORDER BY STOCK_dateAdded DESC LIMIT 10");
    const stocks = result.rows.map(
      (row) =>
        new Stock(
          row.PROV_ID,
          row.MED_serial_num,
          row.STOCK_itemQty,
          row.STOCK_dateAdded
        )
    );
    res.json(stocks);
  } catch (error) {
    console.error("Error fetching recent stocks:", error);
    res.status(500).json({error: "Internal server error"});
  }
};