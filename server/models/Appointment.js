class Appointment {
  constructor(apt_id, apt_date, apt_status, patient_id, patient_fname, patient_lname) {
    this.apt_id = apt_id;
    this.apt_date = apt_date;
    this.apt_status = apt_status;
    this.patient_id = patient_id;
    this.patient_fname = patient_fname;
    this.patient_lname = patient_lname;
  }
}

module.exports = Appointment;
