const User = require("../models/user");
const client = require("../config/elasticSearch");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create user in database
    const user = await User.create({ name, email, password });

    // Sync to Elasticsearch
    await client.index({
      index: 'users',
      id: user.id.toString(),
      body: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'createdAt']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = { createUser, getUsers };