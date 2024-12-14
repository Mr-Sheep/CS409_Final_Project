const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const secrets = require("/etc/secrets/secrets");

const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://cs-409-final-project.vercel.app",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/events", eventRoutes);
app.use("/api", userRoutes);

mongoose.connect(secrets.mongo_connection);

mongoose.connection.on("connected", () =>
  console.log("\nConnected to MongoDB\n")
);

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
