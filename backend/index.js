const jwt = require("jsonwebtoken");
require("./config/db");
const sequelize = require("./config/db");
require("dotenv").config();
const express = require("express");
const cors = require("cors"); 

// controllers
const { search, stats, providersList, loginController } = require("./controllers/authController");
const { getToken } = require("./middlewares/token");
const authMiddleware = require("./middlewares/authmiddleware");


const app = express();

app.use(cors());              
app.use(express.json());

sequelize.sync({ alter: true }).then(() => {
  console.log("Database & tables synced!");
});

app.post("/api/login", loginController);
app.get("/api/search", authMiddleware, search);
app.get("/api/stats", authMiddleware, stats);
app.get("/api/providersList", authMiddleware, providersList);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
