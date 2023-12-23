class Employee {
  constructor(emp_id, emp_lname, emp_fname, emp_gender, emp_cin, emp_email, emp_street, emp_zipCode, emp_city, emp_salary) {
    this.emp_id = emp_id;
    this.emp_lname = emp_lname;
    this.emp_fname = emp_fname;
    this.emp_gender = emp_gender;
    this.emp_cin = emp_cin;
    this.emp_email = emp_email;
    this.emp_street = emp_street;
    this.emp_zipCode = emp_zipCode;
    this.emp_city = emp_city;
    this.emp_salary = emp_salary;
  }
}

module.exports = Employee;