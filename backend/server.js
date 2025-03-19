const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const emailWalletRoutes = require("./routes/emailWalletRoutes");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use("/api", emailWalletRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
