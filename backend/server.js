require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.json({ mongo: mongoose.connection.readyState }); // 1 = connected
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/profile"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/account"));

const PORT = process.env.PORT || 5000;

(async function start() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ Missing MONGO_URI in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB || "groupDB",
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Mongo connected:", mongoose.connection.host);

    app.listen(PORT, () => console.log("API running on", PORT));
  } catch (err) {
    console.error("❌ Mongo connect failed:", err.message);
    process.exit(1);
  }
})();
