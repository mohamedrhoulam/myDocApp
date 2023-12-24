const express = require("express");
const cors = require('cors'); // Import the cors package
const app = express();
const port = 5000;

const appointments = require("./routes/appointments");
const todaysAppointmentsRouter = require("./routes/todaysAppointments");
const patients = require("./routes/patients");
const prescriptionsRouter = require("./routes/prescriptions");
const certificatesRouter = require("./routes/certificates");
const employeesRouter = require("./routes/employees");
const medicineRoutes = require('./routes/medicine');
const providerRoutes = require('./routes/provider');


app.use(cors()); // Use cors middleware here
app.use(express.json());
app.use("/api/appointments", appointments);
app.use("/api/todaysAppointments", todaysAppointmentsRouter);
app.use("/api/patients", patients);
app.use("/api/prescriptions", prescriptionsRouter);
app.use("/api/certificates", certificatesRouter);
app.use("/api/employees", employeesRouter);
app.use('/api/medicines', medicineRoutes);
app.use("/api/providers", require("./routes/provider"));







app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

app.get("/", (request, response) => {
  response.json({ info: "Backend with Express Node and Postgres" });
});