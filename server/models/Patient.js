class Patient {
  constructor(patient_id, patient_fname, patient_lname, patient_phoneNum, patient_dateOfBirth, patient_sex, patient_email, patient_cin, patient_city, patient_street) {
    this.patient_id = patient_id;
    this.patient_fname = patient_fname;
    this.patient_lname = patient_lname;
    this.patient_phoneNum = patient_phoneNum;
    this.patient_dateOfBirth = patient_dateOfBirth;
    this.patient_sex = patient_sex;
    this.patient_email = patient_email;
    this.patient_cin = patient_cin;
    this.patient_city = patient_city;
    this.patient_street = patient_street;
  }
}

module.exports = Patient;