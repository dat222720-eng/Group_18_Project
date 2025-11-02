require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());               // <-- phải có trước routes
app.use(express.json());
app.use('/api', require('./routes/user'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err.message));
