const express = require("express");
const cors = require('cors'); // Import the cors package
const app = express();
const port = 5000;

const appointments = require("./routes/appointments");
const todaysAppointmentsRouter = require("./routes/todaysAppointments");
const patients = require("./routes/patients");


app.use(cors()); // Use cors middleware here
app.use(express.json());
app.use("/api/appointments", appointments);
app.use("/api/todaysAppointments", todaysAppointmentsRouter);
app.use("/api/patients", patients);



app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

app.get("/", (request, response) => {
  response.json({ info: "Backend with Express Node and Postgres" });
});