const express = require("express");
const cors = require('cors'); // Import the cors package
const app = express();
const port = 5000;

const appointments = require("./routes/appointments");

app.use(cors()); // Use cors middleware here
app.use(express.json());
app.use("/api/appointments", appointments);

app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});

app.get("/", (request, response) => {
  response.json({ info: "Backend with Express Node and Postgres" });
});