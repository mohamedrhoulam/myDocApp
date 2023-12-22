class Appointment {
  constructor(apt_id, apt_date, apt_status, patient_id) {
    this.apt_id = apt_id;
    this.apt_date = apt_date;
    this.apt_status = apt_status;
    this.patient_id = patient_id;
  }
}

module.exports = Appointment;
