const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let users = []; // dữ liệu tạm để test
app.get("/api/users", (req,res)=> res.json(users));
app.post("/api/users", (req,res)=>{ users.push({id:Date.now(), ...req.body}); res.status(201).json(users.at(-1)); });

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
