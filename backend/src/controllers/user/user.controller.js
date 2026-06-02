"use strict";

const User = require("../../models/providers/user");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    // SECURITY: Filter by companyId to enforce company isolation
    // Super admin (companyId === 0) can see all users; regular users see only their company's users
    const whereClause = req.companyId === 0 ? {} : { companyId: req.companyId };
    
    const users = await User.findAll({
      where: whereClause,
      attributes: ["id", "name", "email", "createdAt"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = { createUser, getUsers };
