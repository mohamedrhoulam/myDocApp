const db = require("../config/db");
const Employee = require("../models/Employee");

exports.getAllEmployees = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM EMPLOYEE");
    const employees = result.rows.map(row => new Employee(
      row.emp_id,
      row.emp_lname,
      row.emp_fname,
      row.emp_gender,
      row.emp_cin,
      row.emp_email,
      row.emp_street,
      row.emp_zipCode,
      row.emp_city,
      row.emp_salary
    ));
    res.json(employees);
  } catch (error) {
    console.error("Error fetching all employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM EMPLOYEE WHERE emp_id = $1", [req.params.id]);
    const row = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: "Employee not found" });
    }
    const employee = new Employee(
      row.emp_id,
      row.emp_lname,
      row.emp_fname,
      row.emp_gender,
      row.emp_cin,
      row.emp_email,
      row.emp_street,
      row.emp_zipCode,
      row.emp_city,
      row.emp_salary
    );
    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { emp_lname, emp_fname, emp_gender, emp_cin, emp_email, emp_street, emp_zipCode, emp_city, emp_salary } = req.body;
    const result = await db.query(
      "INSERT INTO EMPLOYEE (emp_lname, emp_fname, emp_gender, emp_cin, emp_email, emp_street, emp_zipCode, emp_city, emp_salary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [emp_lname, emp_fname, emp_gender, emp_cin, emp_email, emp_street, emp_zipCode, emp_city, emp_salary]
    );
    const row = result.rows[0];
    const employee = new Employee(
      row.emp_id,
      row.emp_lname,
      row.emp_fname,
      row.emp_gender,
      row.emp_cin,
      row.emp_email,
      row.emp_street,
      row.emp_zipCode,
      row.emp_city,
      row.emp_salary
    );
    res.json(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { emp_lname, emp_fname, emp_gender, emp_cin, emp_email, emp_street, emp_zipCode, emp_city, emp_salary } = req.body;
    const result = await db.query(
      "UPDATE EMPLOYEE SET emp_lname = $1, emp_fname = $2, emp_gender = $3, emp_cin = $4, emp_email = $5, emp_street = $6, emp_zipCode = $7, emp_city = $8, emp_salary = $9 WHERE emp_id = $10 RETURNING *",
      [emp_lname, emp_fname, emp_gender, emp_cin, emp_email, emp_street, emp_zipCode, emp_city, emp_salary, req.params.id]
    );
    const row = result.rows[0];
    const employee = new Employee(
      row.emp_id,
      row.emp_lname,
      row.emp_fname,
      row.emp_gender,
      row.emp_cin,
      row.emp_email,
      row.emp_street,
      row.emp_zipCode,
      row.emp_city,
      row.emp_salary
    );
    res.json(employee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await db.query("DELETE FROM EMPLOYEE WHERE emp_id = $1", [req.params.id]);
    res.json({ message: "Employee deleted" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};