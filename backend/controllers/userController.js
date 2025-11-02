const User = require("../models/User");

exports.getUsers = async (req,res)=>{
  try{
    const list = await User.find().sort({ createdAt: -1 });
    res.json(list);
  }catch(e){ res.status(500).json({ message: e.message }); }
};

exports.createUser = async (req,res)=>{
  try{
    const { name, email } = req.body || {};
    if(!name || !email) return res.status(400).json({ message:"name/email required" });
    const u = await User.create({ name, email });
    res.status(201).json(u);
  }catch(e){ res.status(500).json({ message: e.message }); }
};
