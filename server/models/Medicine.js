class Medicine {
  constructor(MED_serial_num, MED_name, MED_expDate, MED_prodDate, MED_amount) {
    this.MED_serial_num = MED_serial_num;
    this.MED_name = MED_name;
    this.MED_expDate = MED_expDate;
    this.MED_prodDate = MED_prodDate;
    this.MED_amount = MED_amount;
  }
}

module.exports = Medicine;