class Appointment {
  constructor(apt_id, apt_date, apt_status, apt_patientId) {
    this.apt_id = apt_id;
    this.apt_date = apt_date;
    this.apt_status = apt_status;
    this.apt_patientId = apt_patientId;
  }
}

module.exports = Appointment;
